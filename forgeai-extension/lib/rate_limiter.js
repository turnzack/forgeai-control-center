/* Lightweight in-memory limiter for the MV3 service worker lifetime. */
const RateLimiter = (() => {
  let nextAllowedAt = 0;
  let remaining = null;
  let resetAt = null;
  async function wait(minDelayMs = 150) {
    const delay = Math.max(0, nextAllowedAt - Date.now());
    if (delay) await new Promise((resolve) => setTimeout(resolve, delay));
    nextAllowedAt = Date.now() + minDelayMs;
  }
  function update(rate) {
    if (!rate) return;
    remaining = rate.remaining == null ? remaining : Number(rate.remaining);
    resetAt = rate.resetAt || resetAt;
    if (remaining !== null && remaining <= 2 && resetAt) nextAllowedAt = Math.max(nextAllowedAt, Number(resetAt) * 1000);
  }
  function status() { return { remaining, resetAt }; }
  return { wait, update, status };
})();

globalThis.RateLimiter = RateLimiter;
