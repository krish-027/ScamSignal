import { describe, expect, it } from 'vitest';
import {
  advance, choose, createSession, getCurrentScene, inspectClue,
  resetMission, restartMission, startMission,
} from '../features/missions/engine/missionEngine';
import { PARCEL_MISSION } from '../features/missions/data/parcelMission';

const GOOD = ['inspect-sender', 'verify-official', 'refuse-details', 'verify-support', 'save-report'];
const MIXED = ['ask-someone', 'web-search', 'postpone', 'request-reference', 'archive-only'];
const BAD = ['trust-alert', 'open-fake-link', 'provide-fictional-data', 'follow-support', 'reopen-ticket'];

function play(ids: readonly string[]) {
  let state = startMission(createSession(), PARCEL_MISSION, 100);
  for (const choiceId of ids) {
    while (getCurrentScene(state, PARCEL_MISSION).kind !== 'decision') {
      state = advance(state, PARCEL_MISSION);
    }
    state = choose(state, PARCEL_MISSION, choiceId);
  }
  while (getCurrentScene(state, PARCEL_MISSION).kind !== 'debrief') {
    state = advance(state, PARCEL_MISSION);
  }
  return state;
}

describe('Five-decision gameplay engine', () => {
  it('creates independent mission records and refuses to silently restart an attempt', () => {
    const initial = createSession();
    expect(initial.schemaVersion).toBe(2);
    expect(initial.overallScore).toBeNull();
    const started = startMission(initial, PARCEL_MISSION, 500);
    expect(started.missionRecords.parcel.currentSceneId).toBe('incoming-alert');
    expect(started.missionRecords.parcel.startedAt).toBe(500);
    expect(initial.missionRecords.parcel.status).toBe('not_started');
    expect(() => startMission(started, PARCEL_MISSION)).toThrow('Use restartMission');
  });

  it('tracks clues only once, without changing points', () => {
    let state = startMission(createSession(), PARCEL_MISSION);
    state = inspectClue(state, PARCEL_MISSION, 'sender-identity');
    expect(inspectClue(state, PARCEL_MISSION, 'sender-identity')).toBe(state);
    expect(state.missionRecords.parcel.inspectedClueIds).toEqual(['sender-identity']);
    expect(state.missionRecords.parcel.score).toBe(0);
    expect(() => inspectClue(state, PARCEL_MISSION, 'unfamiliar-domain')).toThrow('not available');
    state = advance(state, PARCEL_MISSION);
    expect(() => advance(state, PARCEL_MISSION)).toThrow('Choose an option');
  });

  it('rejects invalid and duplicate choices and scores a safe choice once', () => {
    let state = startMission(createSession(), PARCEL_MISSION);
    state = advance(state, PARCEL_MISSION);
    expect(() => choose(state, PARCEL_MISSION, 'verify-official')).toThrow('not valid');
    state = choose(state, PARCEL_MISSION, GOOD[0], 77);
    expect(state.missionRecords.parcel.score).toBe(20);
    expect(state.missionRecords.parcel.decisions['checkpoint-1']?.timestamp).toBe(77);
    expect(() => choose(state, PARCEL_MISSION, GOOD[0])).toThrow('No active decision');
    expect(state.missionRecords.parcel.score).toBe(20);
  });

  it.each([
    ['all safe', GOOD, 100],
    ['all cautious', MIXED, 50],
    ['all risky', BAD, 0],
  ])('%s completes all five checkpoints and scores correctly', (_label, choices, expected) => {
    const state = play(choices as string[]);
    expect(state.missionRecords.parcel.status).toBe('completed');
    expect(Object.keys(state.missionRecords.parcel.decisions)).toHaveLength(5);
    expect(state.missionRecords.parcel.score).toBe(expected);
    expect(state.overallScore).toBe(expected);
    expect(getCurrentScene(state, PARCEL_MISSION).kind).toBe('debrief');
    expect(() => advance(state, PARCEL_MISSION)).toThrow('completed');
  });

  it('traverses all 243 possible five-choice outcome paths', () => {
    const levels = [GOOD, MIXED, BAD];
    let tested = 0;
    for (const a of levels) for (const b of levels) for (const c of levels)
      for (const d of levels) for (const e of levels) {
        const state = play([a[0], b[1], c[2], d[3], e[4]]);
        expect(state.missionRecords.parcel.status).toBe('completed');
        expect(Object.keys(state.missionRecords.parcel.decisions)).toHaveLength(5);
        expect(state.missionRecords.parcel.score).toBeGreaterThanOrEqual(0);
        expect(state.missionRecords.parcel.score).toBeLessThanOrEqual(100);
        tested += 1;
      }
    expect(tested).toBe(243);
  });

  it('replay resets parcel without mutating the other mission records', () => {
    const done = play(GOOD);
    const other = done.missionRecords.internship;
    const restarted = restartMission(done, PARCEL_MISSION, 900);
    expect(restarted.missionRecords.parcel.status).toBe('in_progress');
    expect(restarted.missionRecords.parcel.score).toBe(0);
    expect(restarted.missionRecords.parcel.decisions).toEqual({});
    expect(restarted.missionRecords.parcel.startedAt).toBe(900);
    expect(restarted.missionRecords.internship).toBe(other);
    expect(restarted.overallScore).toBeNull();
    const cleared = resetMission(done, 'parcel');
    expect(cleared.missionRecords.parcel.currentSceneId).toBeUndefined();
  });
});
