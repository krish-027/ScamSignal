import { validateMission } from './validateMission';
import type {
  CheckpointDecision,
  Choice,
  GameSessionState,
  MissionDefinition,
  MissionId,
  MissionRecord,
  Scene,
} from '../../../types/mission';

const MISSION_IDS: readonly MissionId[] = ['parcel', 'internship', 'refund'];

function emptyRecord(missionId: MissionId): MissionRecord {
  return {
    missionId,
    status: 'not_started',
    decisions: {},
    score: 0,
    inspectedClueIds: [],
  };
}

export function createSession(): GameSessionState {
  return {
    schemaVersion: 1,
    activeMissionId: 'parcel',
    missionRecords: {
      parcel: emptyRecord('parcel'),
      internship: emptyRecord('internship'),
      refund: emptyRecord('refund'),
    },
    overallScore: null,
  };
}

function withRecord(
  state: GameSessionState,
  record: MissionRecord,
): GameSessionState {
  const records = { ...state.missionRecords, [record.missionId]: record };
  const finished = MISSION_IDS.map((id) => records[id])
    .filter((item) => item.status === 'completed');
  return {
    ...state,
    activeMissionId: record.missionId,
    missionRecords: records,
    // A partial average is informational; final report remains locked until all three finish.
    overallScore: finished.length === 0
      ? null
      : Math.round(finished.reduce((sum, item) => sum + item.score, 0) / finished.length),
  };
}

function requireActive(state: GameSessionState, definition: MissionDefinition): MissionRecord {
  if (state.activeMissionId !== definition.id) {
    throw new Error(`Mission ${definition.id} is not active`);
  }
  const record = state.missionRecords[definition.id];
  if (!record || !record.currentSceneId || record.status === 'not_started') {
    throw new Error(`Mission ${definition.id} has not started`);
  }
  return record;
}

export function getCurrentScene(
  state: GameSessionState,
  definition: MissionDefinition,
): Scene {
  const record = requireActive(state, definition);
  const scene = definition.scenes[record.currentSceneId!];
  if (!scene) throw new Error('Saved progress references an unknown scene');
  return scene;
}

/** Starts a new mission; explicit restartMission is required to discard progress. */
export function startMission(
  state: GameSessionState,
  definition: MissionDefinition,
  now: number = Date.now(),
): GameSessionState {
  validateMission(definition);
  const previous = state.missionRecords[definition.id];
  if (!previous || previous.status !== 'not_started') {
    throw new Error('Use restartMission to discard existing progress');
  }
  if (!definition.scenes[definition.startSceneId]) {
    throw new Error('Mission has an invalid start scene');
  }
  return withRecord(state, {
    ...emptyRecord(definition.id),
    status: 'in_progress',
    currentSceneId: definition.startSceneId,
    startedAt: now,
  });
}

function moveTo(
  state: GameSessionState,
  definition: MissionDefinition,
  record: MissionRecord,
  sceneId: string,
  now: number,
): GameSessionState {
  const target = definition.scenes[sceneId];
  if (!target) throw new Error(`Missing target scene: ${sceneId}`);
  const next: MissionRecord = { ...record, currentSceneId: sceneId };
  if (target.kind === 'debrief') {
    const decisions = next.decisions;
    if (!decisions['checkpoint-1'] || !decisions['checkpoint-2'] || !decisions['checkpoint-3']) {
      throw new Error('Cannot complete a mission without all three decisions');
    }
    next.status = 'completed';
    next.completedAt = now;
  }
  return withRecord(state, next);
}

/** Moves through message, consequence and reveal scenes; decisions require choose(). */
export function advance(
  state: GameSessionState,
  definition: MissionDefinition,
  now: number = Date.now(),
): GameSessionState {
  const record = requireActive(state, definition);
  const scene = getCurrentScene(state, definition);
  if (record.status === 'completed') throw new Error('Mission is completed');
  if (scene.kind === 'decision') throw new Error('Choose an option to leave a decision scene');
  if (!scene.nextSceneId) throw new Error(`Scene ${scene.id} has no next step`);
  return moveTo(state, definition, record, scene.nextSceneId, now);
}

function recordChoice(choice: Choice, timestamp: number): CheckpointDecision {
  switch (choice.checkpointId) {
    case 'checkpoint-1':
      return { checkpointId: 'checkpoint-1', choiceId: choice.id, pointsEarned: choice.points, timestamp };
    case 'checkpoint-2':
      return { checkpointId: 'checkpoint-2', choiceId: choice.id, pointsEarned: choice.points, timestamp };
    case 'checkpoint-3':
      return { checkpointId: 'checkpoint-3', choiceId: choice.id, pointsEarned: choice.points, timestamp };
  }
}

/** Accepts a choice only at the current decision; repeated/invalid choices never add points. */
export function choose(
  state: GameSessionState,
  definition: MissionDefinition,
  choiceId: string,
  now: number = Date.now(),
): GameSessionState {
  const record = requireActive(state, definition);
  const scene = getCurrentScene(state, definition);
  if (record.status !== 'in_progress' || scene.kind !== 'decision') {
    throw new Error('No active decision at the current scene');
  }
  const choice = scene.choices?.find((item) => item.id === choiceId);
  if (!choice || choice.checkpointId !== scene.checkpointId) {
    throw new Error('Choice is not valid for this checkpoint');
  }
  if (record.decisions[choice.checkpointId]) {
    throw new Error('This checkpoint has already been answered');
  }

  const decision = recordChoice(choice, now);
  const decisions: MissionRecord['decisions'] = { ...record.decisions };
  switch (decision.checkpointId) {
    case 'checkpoint-1': decisions['checkpoint-1'] = decision; break;
    case 'checkpoint-2': decisions['checkpoint-2'] = decision; break;
    case 'checkpoint-3': decisions['checkpoint-3'] = decision; break;
  }

  const next: MissionRecord = {
    ...record,
    decisions,
    score: record.score + decision.pointsEarned,
  };
  return moveTo(state, definition, next, choice.nextSceneId, now);
}

/** Clues are free to inspect and never affect scoring. */
export function inspectClue(
  state: GameSessionState,
  definition: MissionDefinition,
  clueId: string,
): GameSessionState {
  const record = requireActive(state, definition);
  const scene = getCurrentScene(state, definition);
  if (record.status !== 'in_progress') throw new Error('Mission is completed');
  if (!definition.clues[clueId] || !scene.clueIds?.includes(clueId)) {
    throw new Error('This clue is not available in the current scene');
  }
  if (record.inspectedClueIds.includes(clueId)) return state;
  return withRecord(state, {
    ...record,
    inspectedClueIds: [...record.inspectedClueIds, clueId],
  });
}

/** Resets only the selected mission. Other missions remain untouched. */
export function resetMission(state: GameSessionState, id: MissionId): GameSessionState {
  return withRecord(state, emptyRecord(id));
}

/** Explicitly replay this mission from the beginning. */
export function restartMission(
  state: GameSessionState,
  definition: MissionDefinition,
  now: number = Date.now(),
): GameSessionState {
  return startMission(resetMission(state, definition.id), definition, now);
}
