import type { Choice, Scene } from '../../types/mission';

/** Balanced options: positions vary by checkpoint and by attempt, but not by rerender. */
const CHECKPOINT_ORDER: Record<string, readonly number[]> = {
  'checkpoint-1': [1, 0, 2],
  'checkpoint-2': [2, 1, 0],
  'checkpoint-3': [0, 2, 1],
  'checkpoint-4': [1, 2, 0],
  'checkpoint-5': [2, 0, 1],
};

/**
 * Uses the mission's persisted startedAt timestamp as a presentation-only seed.
 * This avoids the unsafe `Math.random()`-on-render pattern: refreshing a
 * locked attempt cannot reorder answers, but replaying may display new order.
 */
export function displayChoices(
  scene: Pick<Scene, 'checkpointId' | 'choices'>,
  attemptStartedAt: number | undefined,
): Choice[] {
  const choices = scene.choices ?? [];
  const order = scene.checkpointId ? CHECKPOINT_ORDER[scene.checkpointId] : undefined;
  if (!order || choices.length !== order.length) return [...choices];
  const seed = Number.isFinite(attemptStartedAt) ? Math.floor(Math.abs(attemptStartedAt ?? 0)) : 0;
  const shift = seed % 3;
  const reversed = Math.floor(seed / 3) % 2 === 1;
  const rotated = [...order.slice(shift), ...order.slice(0, shift)];
  if (reversed) rotated.reverse();
  return rotated.map(index => choices[index]);
}
