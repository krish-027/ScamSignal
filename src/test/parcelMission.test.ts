import { describe, expect, it } from 'vitest';
import type { MissionDefinition } from '../types/mission';
import { PARCEL_MISSION } from '../features/missions/data/parcelMission';
import { validateMission } from '../features/missions/engine/validateMission';

describe('Five-checkpoint parcel story graph', () => {
  it('validates all five checkpoints, two follow-ups, and five evidence clues', () => {
    expect(() => validateMission(PARCEL_MISSION)).not.toThrow();
    expect(Object.values(PARCEL_MISSION.scenes).filter(scene => scene.kind === 'decision')).toHaveLength(5);
    expect(Object.values(PARCEL_MISSION.scenes).filter(scene => scene.kind === 'reveal')).toHaveLength(1);
    expect(Object.keys(PARCEL_MISSION.clues)).toHaveLength(5);
  });

  it('rejects broken target references', () => {
    const altered: MissionDefinition = {
      ...PARCEL_MISSION,
      scenes: {
        ...PARCEL_MISSION.scenes,
        'sender-safe': { ...PARCEL_MISSION.scenes['sender-safe'], nextSceneId: 'missing' },
      },
    };
    expect(() => validateMission(altered)).toThrow('no valid next scene');
  });

  it('rejects invalid point assignments', () => {
    const decision = PARCEL_MISSION.scenes['decision-sender'];
    const altered = {
      ...PARCEL_MISSION,
      scenes: {
        ...PARCEL_MISSION.scenes,
        'decision-sender': {
          ...decision,
          choices: [{ ...decision.choices![0], points: 30 }, ...decision.choices!.slice(1)],
        },
      },
    } as MissionDefinition;
    expect(() => validateMission(altered)).toThrow('invalid points');
  });

  it('rejects cycles', () => {
    const altered = {
      ...PARCEL_MISSION,
      scenes: {
        ...PARCEL_MISSION.scenes,
        'sender-safe': { ...PARCEL_MISSION.scenes['sender-safe'], nextSceneId: 'decision-sender' },
      },
    };
    expect(() => validateMission(altered)).toThrow('cycle');
  });
});
