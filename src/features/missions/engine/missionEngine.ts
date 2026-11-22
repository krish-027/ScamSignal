import { validateMission } from './validateMission';
import type {
  CheckpointDecision, GameSessionState, MissionDefinition, MissionId, MissionRecord, Scene,
} from '../../../types/mission';

const MISSION_IDS: readonly MissionId[] = ['parcel', 'internship', 'refund'];
const CHECKPOINT_COUNT = 5;

function emptyRecord(missionId: MissionId): MissionRecord {
  return { missionId, status: 'not_started', decisions: {}, score: 0, inspectedClueIds: [] };
}

export function createSession(): GameSessionState {
  return {
    schemaVersion: 2,
    activeMissionId: 'parcel',
    missionRecords: {
      parcel: emptyRecord('parcel'),
      internship: emptyRecord('internship'),
      refund: emptyRecord('refund'),
    },
    overallScore: null,
  };
}

function withRecord(state: GameSessionState, record: MissionRecord): GameSessionState {
  const records = { ...state.missionRecords, [record.missionId]: record };
  const finished = MISSION_IDS.map(id => records[id]).filter(item => item.status === 'completed');
  return {
    ...state,
    activeMissionId: record.missionId,
    missionRecords: records,
    overallScore: finished.length === 0 ? null : Math.round(
      finished.reduce((sum, item) => sum + item.score, 0) / finished.length,
    ),
  };
}

function requireActive(state: GameSessionState, definition: MissionDefinition): MissionRecord {
  if (state.activeMissionId !== definition.id) throw new Error(`Mission ${definition.id} is not active`);
  const record = state.missionRecords[definition.id];
  if (!record || !record.currentSceneId || record.status === 'not_started') {
    throw new Error(`Mission ${definition.id} has not started`);
  }
  return record;
}

export function getCurrentScene(state: GameSessionState, definition: MissionDefinition): Scene {
  const record = requireActive(state, definition);
  const scene = definition.scenes[record.currentSceneId!];
  if (!scene) throw new Error('Saved progress references an unknown scene');
  return scene;
}

/** Starting a played mission never erases locked decisions; use restartMission explicitly. */
export function startMission(
  state: GameSessionState, definition: MissionDefinition, now: number = Date.now(),
): GameSessionState {
  validateMission(definition);
  const previous = state.missionRecords[definition.id];
  if (!previous || previous.status !== 'not_started') {
    throw new Error('Use restartMission to discard existing progress');
  }
  return withRecord(state, {
    ...emptyRecord(definition.id), status: 'in_progress',
    currentSceneId: definition.startSceneId, startedAt: now,
  });
}

function moveTo(
  state: GameSessionState, definition: MissionDefinition, record: MissionRecord,
  sceneId: string, now: number,
): GameSessionState {
  const target = definition.scenes[sceneId];
  if (!target) throw new Error(`Missing target scene: ${sceneId}`);
  const next: MissionRecord = { ...record, currentSceneId: sceneId };
  if (target.kind === 'debrief') {
    if (Object.keys(next.decisions).length !== CHECKPOINT_COUNT) {
      throw new Error(`Cannot complete a mission without all ${CHECKPOINT_COUNT} decisions`);
    }
    next.status = 'completed';
    next.completedAt = now;
  }
  return withRecord(state, next);
}

export function advance(
  state: GameSessionState, definition: MissionDefinition, now: number = Date.now(),
): GameSessionState {
  const record = requireActive(state, definition);
  const scene = getCurrentScene(state, definition);
  if (record.status === 'completed') throw new Error('Mission is completed');
  if (scene.kind === 'decision') throw new Error('Choose an option to leave a decision scene');
  if (!scene.nextSceneId) throw new Error(`Scene ${scene.id} has no next step`);
  return moveTo(state, definition, record, scene.nextSceneId, now);
}

/** A choice is accepted only once, at the active checkpoint. */
export function choose(
  state: GameSessionState, definition: MissionDefinition, choiceId: string,
  now: number = Date.now(),
): GameSessionState {
  const record = requireActive(state, definition);
  const scene = getCurrentScene(state, definition);
  if (record.status !== 'in_progress' || scene.kind !== 'decision') {
    throw new Error('No active decision at the current scene');
  }
  const choice = scene.choices?.find(item => item.id === choiceId);
  if (!choice || choice.checkpointId !== scene.checkpointId) {
    throw new Error('Choice is not valid for this checkpoint');
  }
  if (record.decisions[choice.checkpointId]) {
    throw new Error('This checkpoint has already been answered');
  }
  const decision: CheckpointDecision = {
    checkpointId: choice.checkpointId, choiceId: choice.id,
    pointsEarned: choice.points, timestamp: now,
  };
  const next: MissionRecord = {
    ...record,
    decisions: { ...record.decisions, [decision.checkpointId]: decision },
    score: record.score + choice.points,
  };
  return moveTo(state, definition, next, choice.nextSceneId, now);
}

export function inspectClue(
  state: GameSessionState, definition: MissionDefinition, clueId: string,
): GameSessionState {
  const record = requireActive(state, definition);
  const scene = getCurrentScene(state, definition);
  if (record.status !== 'in_progress') throw new Error('Mission is completed');
  if (!definition.clues[clueId] || !scene.clueIds?.includes(clueId)) {
    throw new Error('This clue is not available in the current scene');
  }
  if (record.inspectedClueIds.includes(clueId)) return state;
  return withRecord(state, { ...record, inspectedClueIds: [...record.inspectedClueIds, clueId] });
}

export function resetMission(state: GameSessionState, id: MissionId): GameSessionState {
  return withRecord(state, emptyRecord(id));
}

export function restartMission(
  state: GameSessionState, definition: MissionDefinition, now: number = Date.now(),
): GameSessionState {
  return startMission(resetMission(state, definition.id), definition, now);
}
