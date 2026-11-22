import { describe, expect, it } from 'vitest';
import { PARCEL_MISSION } from '../features/missions/data/parcelMission';
import { displayChoices } from '../features/missions/choiceOrder';
import type { Scene } from '../types/mission';

const checkpointScenes = [
  'decision-sender', 'decision-domain', 'decision-details', 'decision-support', 'decision-resolution',
];

describe('Batch 2C position-independent choices', () => {
  it('spreads the safer answer over A/B/C during a single attempt', () => {
    for (const seed of [0, 1, 2, 1000, 1001]) {
      const positions = checkpointScenes.map(id => displayChoices(PARCEL_MISSION.scenes[id], seed).findIndex(choice => choice.outcomeType === 'safe'));
      expect(new Set(positions)).toEqual(new Set([0, 1, 2]));
    }
  });
  it('uses a stable order after refresh, but mixes it between attempts', () => {
    const checkpoint = PARCEL_MISSION.scenes['decision-sender'];
    expect(displayChoices(checkpoint, 1000).map(c => c.id)).toEqual(displayChoices(checkpoint, 1000).map(c => c.id));
    expect(displayChoices(checkpoint, 1000).map(c => c.id)).not.toEqual(displayChoices(checkpoint, 1001).map(c => c.id));
  });
  it('preserves every original choice, score, and immutable choice ID', () => {
    for (const id of checkpointScenes) {
      const source = PARCEL_MISSION.scenes[id].choices ?? [];
      const displayed = displayChoices(PARCEL_MISSION.scenes[id], 12345);
      expect(displayed).toHaveLength(source.length);
      expect([...displayed.map(choice => choice.id)].sort()).toEqual([...source.map(choice => choice.id)].sort());
      for (const choice of displayed) expect(source.find(item => item.id === choice.id)?.points).toBe(choice.points);
    }
  });
  it('leaves non-decision and differently sized choices unchanged', () => {
    const generic: Pick<Scene, 'checkpointId' | 'choices'> = { checkpointId: undefined, choices: undefined };
    expect(displayChoices(generic, 5)).toEqual([]);
    expect(displayChoices({ checkpointId: 'checkpoint-1', choices: PARCEL_MISSION.scenes['decision-sender'].choices?.slice(0, 2) }, 5)).toHaveLength(2);
  });
});
