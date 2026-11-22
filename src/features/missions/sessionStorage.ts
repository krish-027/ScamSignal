import { createSession } from './engine/missionEngine';
import { PARCEL_MISSION } from './data/parcelMission';
import type { CheckpointId, GameSessionState, MissionRecord } from '../../types/mission';

/** Local-only progress; never store passwords, messages or personal information. */
export const SESSION_KEY = 'scamsignal.session.v1';
const checkpointIds: readonly CheckpointId[] = ['checkpoint-1', 'checkpoint-2', 'checkpoint-3'];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function validParcelRecord(value: unknown): value is MissionRecord {
  if (!isRecord(value) || value.missionId !== 'parcel') return false;
  if (!['not_started', 'in_progress', 'completed'].includes(String(value.status))) return false;
  if (!isRecord(value.decisions) || !Array.isArray(value.inspectedClueIds)) return false;
  if (typeof value.score !== 'number' || !Number.isInteger(value.score)) return false;
  const decisionKeys = Object.keys(value.decisions);
  if (decisionKeys.some(key => !checkpointIds.includes(key as CheckpointId))) return false;
  if (value.inspectedClueIds.length > Object.keys(PARCEL_MISSION.clues).length) return false;
  if (value.inspectedClueIds.some(id => typeof id !== 'string' || !PARCEL_MISSION.clues[id])) return false;
  if (new Set(value.inspectedClueIds).size !== value.inspectedClueIds.length) return false;

  let expectedScore = 0;
  for (const checkpoint of checkpointIds) {
    const saved = value.decisions[checkpoint];
    if (saved === undefined) continue;
    if (!isRecord(saved) || saved.checkpointId !== checkpoint || typeof saved.choiceId !== 'string') return false;
    if (typeof saved.timestamp !== 'number' || !Number.isFinite(saved.timestamp)) return false;
    const candidates = Object.values(PARCEL_MISSION.scenes).flatMap(scene => scene.choices ?? []);
    const match = candidates.find(choice => choice.id === saved.choiceId && choice.checkpointId === checkpoint);
    if (!match || match.points !== saved.pointsEarned) return false;
    expectedScore += match.points;
  }
  if (expectedScore !== value.score) return false;
  if (value.status === 'not_started') {
    return decisionKeys.length === 0 && value.currentSceneId === undefined && value.score === 0;
  }
  if (typeof value.currentSceneId !== 'string' || !PARCEL_MISSION.scenes[value.currentSceneId]) return false;
  if (typeof value.startedAt !== 'number' || !Number.isFinite(value.startedAt)) return false;
  const isDebrief = PARCEL_MISSION.scenes[value.currentSceneId].kind === 'debrief';
  if (value.status === 'completed') {
    return isDebrief && decisionKeys.length === 3 && typeof value.completedAt === 'number';
  }
  return !isDebrief;
}

/** Invalid or stale progress is discarded instead of crashing the app. */
export function loadSession(): GameSessionState {
  const fresh = createSession();
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (!raw) return fresh;
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed) || parsed.schemaVersion !== 1 || !isRecord(parsed.missionRecords)) return fresh;
    const rawParcel = parsed.missionRecords.parcel;
    if (!validParcelRecord(rawParcel)) return fresh;
    const parcel = rawParcel;
    // Other missions are not playable yet; they remain in their default state.
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
    // Full or disabled storage should not prevent playing during this tab session.
  }
}
