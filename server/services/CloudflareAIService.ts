import { CloudflareQuotaTracker } from './CloudflareQuotaTracker';

const WORKER_URL = 'https://kirov-worker.v0reponses.workers.dev';
const REQUEST_TIMEOUT_MS = 30000;
const MAX_RESPONSE_CHARS = 16000;

function estimateNeurons({ prompt, maxOutputTokens = 384 }: { prompt: string, maxOutputTokens?: number }) {
  const inputTokens = Math.ceil(prompt.length / 4);
  const inputNeurons = inputTokens * 4625 / 1_000_000;
  const outputNeurons = maxOutputTokens * 30475 / 1_000_000;
  return Math.max(1, Math.ceil(inputNeurons + outputNeurons));
}

function _loadSecret(): string | null {
  return process.env.KIROV_WORKER_SECRET || null;
}

function validateWorkerEnvelope(payload: any, expectedMissionId: string, expectedLotId: string) {
  if (!payload || payload.status !== 'ok' || typeof payload.response !== 'string') {
    throw new Error('Réponse Worker invalide (status !== ok ou response absent).');
  }
  if (payload.response.length > MAX_RESPONSE_CHARS) {
    throw new Error(`Réponse Worker trop longue (${payload.response.length} > ${MAX_RESPONSE_CHARS}).`);
  }
  if (payload.missionId !== expectedMissionId) {
    throw new Error(`missionId absent ou incohérent. Reçu="${payload.missionId}", attendu="${expectedMissionId}"`);
  }
  if (payload.lotId !== expectedLotId) {
    throw new Error(`lotId absent ou incohérent. Reçu="${payload.lotId}", attendu="${expectedLotId}"`);
  }
  return payload.response;
}

export const CloudflareAIService = {
  async ask({
    missionId = "hermes",
    lotId = "pipeline",
    prompt,
    purpose = 'plan',
    requireJson = true
  }: {
    missionId?: string;
    lotId?: string;
    prompt: string;
    purpose?: string;
    requireJson?: boolean;
  }) {
    const cleanPrompt = (prompt || '').trim();
    if (!cleanPrompt || cleanPrompt.length > 24000) {
      return { ok: false, error: 'Prompt vide ou trop long (> 24 000 car.).', degraded: false };
    }

    const secret = _loadSecret();
    if (!secret) {
      console.warn('[HERMES] ⚠️ Secret KIROV_WORKER_SECRET absent. Mode API Cloudflare direct non implémenté sans token.');
      return { ok: false, error: 'Secret non configuré.', degraded: true };
    }

    const neurons = estimateNeurons({ prompt: cleanPrompt, maxOutputTokens: 384 });
    const quotaCheck = await CloudflareQuotaTracker.reserveQuota(missionId, lotId, neurons);
    if (!quotaCheck.reserved) {
      return { ok: false, error: quotaCheck.reason, degraded: true };
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      await CloudflareQuotaTracker.markSent(quotaCheck.reservationId!);

      const res = await fetch(WORKER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Kirov-Secret': secret
        },
        body: JSON.stringify({ missionId, lotId, purpose, prompt: cleanPrompt }),
        signal: controller.signal
      });

      clearTimeout(timer);

      if (!res.ok) {
        await CloudflareQuotaTracker.releaseQuota(quotaCheck.reservationId!, lotId);
        return { ok: false, error: `HTTP_${res.status}`, degraded: res.status >= 500 };
      }

      let payload;
      try {
        payload = await res.json();
      } catch (jsonErr) {
        await CloudflareQuotaTracker.consumeQuota(quotaCheck.reservationId!, lotId);
        return { ok: false, error: 'Réponse Worker non JSON.', degraded: false };
      }

      await CloudflareQuotaTracker.consumeQuota(quotaCheck.reservationId!, lotId);

      let responseText;
      try {
        responseText = validateWorkerEnvelope(payload, missionId, lotId);
      } catch (envErr: any) {
        return { ok: false, error: envErr.message, degraded: false };
      }

      let parsedResult = responseText;
      if (requireJson) {
        try {
          parsedResult = JSON.parse(responseText);
        } catch (parseErr: any) {
          return { ok: false, error: 'Sortie non-JSON.', degraded: false };
        }
      }

      return {
        ok: true,
        response: parsedResult,
        modelUsed: payload.modelUsed,
        estimatedNeurons: neurons
      };
    } catch (err: any) {
      clearTimeout(timer);
      await CloudflareQuotaTracker.releaseQuota(quotaCheck.reservationId!, lotId);
      return { ok: false, error: 'Inférence échouée (réseau ou timeout).', degraded: true };
    }
  }
};
