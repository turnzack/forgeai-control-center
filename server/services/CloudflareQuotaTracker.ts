import fs from 'fs';
import path from 'path';

// ─────────────────────────────────────────────────────────────────────────────
// Constantes
// ─────────────────────────────────────────────────────────────────────────────

// Dans ForgeAI, les data temporaires peuvent aller dans le dossier parent du serveur
const TMP_DIR = path.resolve(
  process.env.APP_DATA_DIR || path.join(process.cwd(), '.tmp')
);
const QUOTA_FILE = path.join(TMP_DIR, 'cloudflare_quota.json');
const QUOTA_FILE_TMP = QUOTA_FILE + '.tmp';

const DAILY_LIMIT = 10000;  // Neurons estimés par jour (allocation gratuite CF)
const RATE_LIMIT_PER_MIN = 30;     // Appels max par minute (protection locale)
const RESERVATION_TTL_MS = 120000; // 120 secondes TTL pour réservation inerte

let _lock = false;
const _lockQueue: (() => void)[] = [];

function _acquireLock(): Promise<void> {
  return new Promise((resolve) => {
    if (!_lock) {
      _lock = true;
      resolve();
    } else {
      _lockQueue.push(resolve);
    }
  });
}

function _releaseLock(): void {
  if (_lockQueue.length > 0) {
    const next = _lockQueue.shift();
    if (next) next();
  } else {
    _lock = false;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Persistance atomique
// ─────────────────────────────────────────────────────────────────────────────

function _getToday(): string {
  return new Date().toISOString().slice(0, 10);
}

interface Reservation {
  reservationId: string;
  missionId: string;
  lotId: string;
  neurons: number;
  status: 'reserved' | 'sent';
  createdAt: string;
  expiresAt: number;
  requestStartedAt: number | null;
}

interface QuotaState {
  date: string;
  dailyLimit: number;
  usedEstimated: number;
  reserved: number;
  remainingEstimated: number;
  resetAt: string;
  callsThisMinute: number;
  minuteStart: number;
  reservations: Reservation[];
  history: any[];
}

function _freshState(): QuotaState {
  const tomorrow = new Date();
  tomorrow.setUTCHours(24, 0, 0, 0);
  return {
    date: _getToday(),
    dailyLimit: DAILY_LIMIT,
    usedEstimated: 0,
    reserved: 0,
    remainingEstimated: DAILY_LIMIT,
    resetAt: tomorrow.toISOString(),
    callsThisMinute: 0,
    minuteStart: Date.now(),
    reservations: [],
    history: []
  };
}

function _recoverExpiredReservations(state: QuotaState): QuotaState {
  const now = Date.now();
  const expired = (state.reservations || []).filter(r => {
    if (r.status === 'sent') {
      const sentTs = r.requestStartedAt || r.expiresAt;
      return (now - sentTs) > 180000;
    }
    return r.expiresAt < now;
  });

  if (expired.length > 0) {
    const freed = expired.reduce((s, r) => s + (r.neurons || 0), 0);
    state.reserved = Math.max(0, (state.reserved || 0) - freed);
    state.usedEstimated = Math.max(0, state.usedEstimated - freed);
    state.remainingEstimated = Math.max(0, state.dailyLimit - state.usedEstimated);
    const expiredIds = new Set(expired.map(r => r.reservationId));
    state.reservations = state.reservations.filter(r => !expiredIds.has(r.reservationId));
    console.log(`[QUOTA] RESERVED_EXPIRED: ${expired.length} reservation(s) expiree(s) -> +${freed} Neurons liberes`);
  }
  return state;
}

function _loadOrInit(): QuotaState {
  try {
    if (fs.existsSync(QUOTA_FILE)) {
      const stored = JSON.parse(fs.readFileSync(QUOTA_FILE, 'utf8')) as QuotaState;
      if (stored.date === _getToday()) {
        stored.reservations = stored.reservations || [];
        stored.history = stored.history || [];
        return _recoverExpiredReservations(stored);
      }
    }
  } catch {}
  return _freshState();
}

function _persistAtomic(state: QuotaState) {
  try {
    if (!fs.existsSync(TMP_DIR)) fs.mkdirSync(TMP_DIR, { recursive: true });
    fs.writeFileSync(QUOTA_FILE_TMP, JSON.stringify(state, null, 2), 'utf8');
    fs.renameSync(QUOTA_FILE_TMP, QUOTA_FILE);
  } catch (error: any) {
    console.error('[QUOTA] ERROR: Persistance atomique echouee:', error.message);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// API publique
// ─────────────────────────────────────────────────────────────────────────────

export const CloudflareQuotaTracker = {
  canCall() {
    const state = _loadOrInit();
    const now = Date.now();
    if (state.usedEstimated >= state.dailyLimit) {
      return { allowed: false, reason: 'CLOUDFLARE_QUOTA_EXHAUSTED' };
    }
    const elapsed = now - state.minuteStart;
    if (elapsed <= 60000 && state.callsThisMinute >= RATE_LIMIT_PER_MIN) {
      return { allowed: false, reason: 'RATE_LIMIT_EXCEEDED' };
    }
    return { allowed: true };
  },

  async reserveQuota(missionId: string, lotId: string, neurons = 50) {
    await _acquireLock();
    try {
      let cleanNeurons = Number(neurons);
      if (!Number.isFinite(cleanNeurons) || cleanNeurons <= 0) {
        return { reserved: false, reason: 'INVALID_NEURON_ESTIMATE' };
      }
      cleanNeurons = Math.ceil(cleanNeurons);

      const state = _loadOrInit();
      const now = Date.now();

      if (state.usedEstimated + cleanNeurons > state.dailyLimit) {
        return { reserved: false, reason: 'CLOUDFLARE_QUOTA_EXHAUSTED' };
      }

      if (now - state.minuteStart > 60000) {
        state.callsThisMinute = 0;
        state.minuteStart = now;
      }

      if (state.callsThisMinute >= RATE_LIMIT_PER_MIN) {
        return { reserved: false, reason: 'RATE_LIMIT_EXCEEDED' };
      }

      const reservationId = `res_${missionId}_${lotId}_${now}_${Math.random().toString(36).substring(2, 6)}`;
      state.reservations.push({
        reservationId,
        missionId,
        lotId,
        neurons: cleanNeurons,
        status: 'reserved',
        createdAt: new Date(now).toISOString(),
        expiresAt: now + RESERVATION_TTL_MS,
        requestStartedAt: null
      });
      state.callsThisMinute += 1;
      state.usedEstimated += cleanNeurons;
      state.reserved += cleanNeurons;
      state.remainingEstimated = Math.max(0, state.dailyLimit - state.usedEstimated);

      state.history.push({ ts: now, missionId, lotId, action: 'reserve', neurons: cleanNeurons, reservationId });
      if (state.history.length > 300) state.history.splice(0, state.history.length - 300);

      _persistAtomic(state);
      console.log(`[QUOTA] RESERVED: ${cleanNeurons}N (${reservationId}) [mission=${missionId}][lot=${lotId}] | used~=${state.usedEstimated}/${state.dailyLimit}`);
      return { reserved: true, reservationId };
    } finally {
      _releaseLock();
    }
  },

  async markSent(reservationId: string) {
    if (!reservationId) return;
    await _acquireLock();
    try {
      const state = _loadOrInit();
      const res = state.reservations.find(r => r.reservationId === reservationId);
      if (res) {
        res.status = 'sent';
        res.requestStartedAt = Date.now();
        _persistAtomic(state);
      }
    } finally {
      _releaseLock();
    }
  },

  async consumeQuota(reservationIdOrMissionId: string, lotId: string) {
    await _acquireLock();
    try {
      const state = _loadOrInit();
      let idx = -1;
      if (reservationIdOrMissionId && reservationIdOrMissionId.startsWith('res_')) {
        idx = state.reservations.findIndex(r => r.reservationId === reservationIdOrMissionId);
      } else {
        idx = state.reservations.findIndex(r => r.missionId === reservationIdOrMissionId && r.lotId === lotId);
      }

      if (idx !== -1) {
        state.reserved = Math.max(0, state.reserved - state.reservations[idx].neurons);
        state.reservations.splice(idx, 1);
      }
      state.history.push({ ts: Date.now(), reservationId: reservationIdOrMissionId, lotId, action: 'consume' });
      _persistAtomic(state);
    } finally {
      _releaseLock();
    }
  },

  async releaseQuota(reservationIdOrMissionId: string, lotId: string) {
    await _acquireLock();
    try {
      const state = _loadOrInit();
      let idx = -1;
      if (reservationIdOrMissionId && reservationIdOrMissionId.startsWith('res_')) {
        idx = state.reservations.findIndex(r => r.reservationId === reservationIdOrMissionId);
      } else {
        idx = state.reservations.findIndex(r => r.missionId === reservationIdOrMissionId && r.lotId === lotId);
      }

      if (idx !== -1) {
        const neurons = state.reservations[idx].neurons;
        state.reservations.splice(idx, 1);
        state.reserved = Math.max(0, state.reserved - neurons);
        state.usedEstimated = Math.max(0, state.usedEstimated - neurons);
        state.remainingEstimated = Math.max(0, state.dailyLimit - state.usedEstimated);
      }
      state.history.push({ ts: Date.now(), reservationId: reservationIdOrMissionId, lotId, action: 'release' });
      _persistAtomic(state);
    } finally {
      _releaseLock();
    }
  },

  getStatus() {
    const state = _loadOrInit();
    return {
      date: state.date,
      dailyLimit: state.dailyLimit,
      usedEstimated: state.usedEstimated,
      reserved: state.reserved,
      remainingEstimated: state.remainingEstimated,
      exhausted: state.usedEstimated >= state.dailyLimit
    };
  }
};
