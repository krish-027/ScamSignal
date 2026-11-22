import { describe, expect, it } from 'vitest';
import type { MissionDefinition } from '../types/mission';
import { PARCEL_MISSION } from '../features/missions/data/parcelMission';
import { validateMission } from '../features/missions/engine/validateMission';

describe('Batch 2A parcel mission graph validation', () => {
  it('validates every scene, branch, clue and checkpoint path', () => {
    expect(() => validateMission(PARCEL_MISSION)).not.toThrow();
    expect(Object.values(PARCEL_MISSION.scenes).filter((s) => s.kind === 'decision'))
      .toHaveLength(3);
    expect(Object.values(PARCEL_MISSION.scenes).filter((s) => s.kind === 'reveal'))
      .toHaveLength(1);
    expect(Object.keys(PARCEL_MISSION.clues)).toHaveLength(3);
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

  it('rejects invalid choice points even when runtime data bypasses TS types', () => {
    const decision = PARCEL_MISSION.scenes['decision-sender'];
    const invalid = {
      ...decision,
      choices: [
        { ...decision.choices![0], points: 40 },
        ...decision.choices!.slice(1),
      ],
    };
    const altered = {
      ...PARCEL_MISSION,
      scenes: { ...PARCEL_MISSION.scenes, 'decision-sender': invalid },
    } as MissionDefinition;
    expect(() => validateMission(altered)).toThrow('invalid points');
  });

  it('rejects a cycle so the player cannot get trapped', () => {
    const changed = {
      ...PARCEL_MISSION,
      scenes: {
        ...PARCEL_MISSION.scenes,
        'sender-safe': { ...PARCEL_MISSION.scenes['sender-safe'], nextSceneId: 'decision-sender' },
      },
    };
    expect(() => validateMission(changed)).toThrow('cycle');
  });
});
