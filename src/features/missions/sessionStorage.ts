import { createSession } from './engine/missionEngine';
import { PARCEL_MISSION } from './data/parcelMission';
import type { CheckpointId, GameSessionState, MissionRecord } from '../../types/mission';

/** Version 2 uses a new key. Legacy v1 attempts remain untouched, never silently rewritten. */
export const SESSION_KEY = 'scamsignal.session.v2';
const checkpointIds: readonly CheckpointId[] = [
  'checkpoint-1', 'checkpoint-2', 'checkpoint-3', 'checkpoint-4', 'checkpoint-5',
];
const allChoices = Object.values(PARCEL_MISSION.scenes).flatMap(scene => scene.choices ?? []);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function validParcelRecord(value: unknown): value is MissionRecord {
  if (!isRecord(value) || value.missionId !== 'parcel') return false;
  if (!['not_started', 'in_progress', 'completed'].includes(String(value.status))) return false;
  if (!isRecord(value.decisions) || !Array.isArray(value.inspectedClueIds)) return false;
  if (typeof value.score !== 'number' || !Number.isInteger(value.score)) return false;
  const decisions = value.decisions;
  const decisionKeys = Object.keys(decisions);
  if (decisionKeys.some(key => !checkpointIds.includes(key as CheckpointId))) return false;
  if (value.inspectedClueIds.length > Object.keys(PARCEL_MISSION.clues).length) return false;
  if (value.inspectedClueIds.some(id => typeof id !== 'string' || !PARCEL_MISSION.clues[id])) return false;
  if (new Set(value.inspectedClueIds).size !== value.inspectedClueIds.length) return false;

  let score = 0;
  for (const [index, checkpoint] of checkpointIds.entries()) {
    const saved = decisions[checkpoint];
    if (saved === undefined) {
      // Choices must be made in mission order; no gaps or out-of-order scores.
      if (decisionKeys.some(key => checkpointIds.indexOf(key as CheckpointId) > index)) return false;
      continue;
    }
    if (!isRecord(saved) || saved.checkpointId !== checkpoint || typeof saved.choiceId !== 'string') return false;
    if (typeof saved.timestamp !== 'number' || !Number.isFinite(saved.timestamp)) return false;
    const choice = allChoices.find(item => item.id === saved.choiceId && item.checkpointId === checkpoint);
    if (!choice || saved.pointsEarned !== choice.points) return false;
    score += choice.points;
  }
  if (score !== value.score) return false;
  if (value.status === 'not_started') {
    return decisionKeys.length === 0 && value.currentSceneId === undefined && value.score === 0;
  }
  if (typeof value.currentSceneId !== 'string' || !PARCEL_MISSION.scenes[value.currentSceneId]) return false;
  if (typeof value.startedAt !== 'number' || !Number.isFinite(value.startedAt)) return false;
  const currentScene = PARCEL_MISSION.scenes[value.currentSceneId];
  if (currentScene.kind === 'decision' && currentScene.checkpointId !== checkpointIds[decisionKeys.length]) {
    return false;
  }
  if (value.status === 'completed') {
    return currentScene.kind === 'debrief' && decisionKeys.length === checkpointIds.length
      && typeof value.completedAt === 'number' && Number.isFinite(value.completedAt);
  }
  return currentScene.kind !== 'debrief';
}

export function loadSession(): GameSessionState {
  const fresh = createSession();
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (!raw) return fresh;
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed) || parsed.schemaVersion !== 2 || !isRecord(parsed.missionRecords)) return fresh;
    const rawParcel = parsed.missionRecords.parcel;
    if (!validParcelRecord(rawParcel)) return fresh;
    const parcel = rawParcel;
    return {
      ...fresh,
      activeMissionId: 'parcel',
      missionRecords: { ...fresh.missionRecords, parcel },
      overallScore: parcel.status === 'completed' ? parcel.score : null,
    };
  } catch {
    return fresh;
  }
}

export function persistSession(session: GameSessionState): void {
  try {
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    // Storage may be blocked; the mission remains playable in this tab.
  }
}
