const NEW_DAYS = 7;
const DAY_MS = 24 * 60 * 60 * 1000;

export function isNewItem(firstSeenAtMs: number, nowMs = Date.now()): boolean {
  return nowMs - firstSeenAtMs <= NEW_DAYS * DAY_MS;
}

export function newBadgeCutoffMs(nowMs = Date.now()): number {
  return nowMs - NEW_DAYS * DAY_MS;
}
