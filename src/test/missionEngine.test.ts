import { describe, expect, it } from 'vitest';
import {
  advance,
  choose,
  createSession,
  getCurrentScene,
  inspectClue,
  resetMission,
  restartMission,
  startMission,
} from '../features/missions/engine/missionEngine';
import { PARCEL_MISSION } from '../features/missions/data/parcelMission';

const GOOD = ['inspect-sender', 'verify-official', 'refuse-details'];
const MIXED = ['ask-someone', 'web-search', 'postpone'];
const BAD = ['trust-alert', 'open-fake-link', 'provide-fictional-data'];

function play(ids: readonly string[]) {
  let state = startMission(createSession(), PARCEL_MISSION, 100);
  state = advance(state, PARCEL_MISSION, 101); // incoming SMS -> checkpoint 1
  for (let index = 0; index < ids.length; index += 1) {
    state = choose(state, PARCEL_MISSION, ids[index], 102 + index * 2);
    state = advance(state, PARCEL_MISSION, 103 + index * 2);
  }
  state = advance(state, PARCEL_MISSION, 110); // reveal -> debrief
  return state;
}

describe('Batch 2A pure gameplay engine', () => {
  it('creates independent, incomplete records and starts parcel mission', () => {
    const initial = createSession();
    expect(initial.overallScore).toBeNull();
    expect(initial.missionRecords.internship.status).toBe('not_started');
    const started = startMission(initial, PARCEL_MISSION, 500);
    expect(started.missionRecords.parcel.currentSceneId).toBe('incoming-alert');
    expect(started.missionRecords.parcel.startedAt).toBe(500);
    expect(initial.missionRecords.parcel.status).toBe('not_started'); // immutable
    expect(() => startMission(started, PARCEL_MISSION)).toThrow('Use restartMission');
  });

  it('tracks clues once without changing points and rejects unavailable clues', () => {
    let state = startMission(createSession(), PARCEL_MISSION);
    state = inspectClue(state, PARCEL_MISSION, 'sender-identity');
    const same = inspectClue(state, PARCEL_MISSION, 'sender-identity');
    expect(same).toBe(state);
    expect(state.missionRecords.parcel.inspectedClueIds).toEqual(['sender-identity']);
    expect(state.missionRecords.parcel.score).toBe(0);
    expect(() => inspectClue(state, PARCEL_MISSION, 'unfamiliar-domain'))
      .toThrow('not available');
    state = advance(state, PARCEL_MISSION);
    expect(() => advance(state, PARCEL_MISSION)).toThrow('Choose an option');
  });

  it('rejects invalid choices and never double-counts checkpoint decisions', () => {
    let state = startMission(createSession(), PARCEL_MISSION);
    state = advance(state, PARCEL_MISSION);
    expect(() => choose(state, PARCEL_MISSION, 'verify-official')).toThrow('not valid');
    state = choose(state, PARCEL_MISSION, GOOD[0], 77);
    expect(state.missionRecords.parcel.score).toBe(30);
    expect(state.missionRecords.parcel.decisions['checkpoint-1']?.timestamp).toBe(77);
    expect(() => choose(state, PARCEL_MISSION, GOOD[0])).toThrow('No active decision');
    expect(state.missionRecords.parcel.score).toBe(30);
  });

  it.each([
    ['all safe', GOOD, 100],
    ['all cautious', MIXED, 50],
    ['all risky', BAD, 0],
  ])('%s yields expected score and ends at debrief', (_name, ids, expected) => {
    const result = play(ids as string[]);
    expect(result.missionRecords.parcel.status).toBe('completed');
    expect(result.missionRecords.parcel.score).toBe(expected);
    expect(result.overallScore).toBe(expected);
    expect(getCurrentScene(result, PARCEL_MISSION).kind).toBe('debrief');
    expect(() => advance(result, PARCEL_MISSION)).toThrow('completed');
  });

  it('supports all 27 legal decision combinations without missing a scene', () => {
    const all = [GOOD, MIXED, BAD];
    for (const a of all) for (const b of all) for (const c of all) {
      const ids = [a[0], b[1], c[2]];
      const result = play(ids);
      expect(result.missionRecords.parcel.status).toBe('completed');
      expect(Object.keys(result.missionRecords.parcel.decisions)).toHaveLength(3);
      expect(result.missionRecords.parcel.score).toBeGreaterThanOrEqual(0);
      expect(result.missionRecords.parcel.score).toBeLessThanOrEqual(100);
    }
  });

  it('replay resets only parcel data, keeping other mission records untouched', () => {
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
    expect(cleared.missionRecords.parcel.status).toBe('not_started');
    expect(cleared.missionRecords.parcel.currentSceneId).toBeUndefined();
  });
});
