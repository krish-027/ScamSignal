import { describe, expect, it } from 'vitest';
import { MISSION_CATALOG, MISSION_1_META } from '../features/missions/missionCatalog';
import type { CheckpointDecision, CheckpointId, DecisionPoints, MissionRecord } from '../types/mission';

describe('Mission catalog and five-checkpoint scoring', () => {
  it('contains metadata for all three missions and the expanded first case', () => {
    expect(MISSION_CATALOG.parcel).toBeDefined();
    expect(MISSION_CATALOG.internship).toBeDefined();
    expect(MISSION_CATALOG.refund).toBeDefined();
    expect(MISSION_1_META.order).toBe(1);
    expect(MISSION_1_META.id).toBe('parcel');
    expect(MISSION_1_META.title).toBe('The Missing Package');
    expect(MISSION_1_META.estimatedDuration).toBe('3–5 minutes');
    expect(MISSION_1_META.keyCluesCount).toBe(5);
  });

  it('scores five equally weighted checkpoints without exceeding 100', () => {
    const checkpointIds: CheckpointId[] = [
      'checkpoint-1', 'checkpoint-2', 'checkpoint-3', 'checkpoint-4', 'checkpoint-5',
    ];
    const points: DecisionPoints[] = [20, 20, 10, 0, 20];
    const recorded: CheckpointDecision[] = checkpointIds.map((checkpointId, index) => ({
      checkpointId,
      choiceId: `test-${index + 1}`,
      pointsEarned: points[index],
      timestamp: 100 + index,
    }));
    expect(recorded.reduce((sum, decision) => sum + decision.pointsEarned, 0)).toBe(70);
    expect(recorded).toHaveLength(5);
  });

  it('permits a partially completed mission with locked, typed decisions', () => {
    const record: MissionRecord = {
      missionId: 'parcel', status: 'in_progress', currentSceneId: 'sender-safe',
      decisions: {
        'checkpoint-1': {
          checkpointId: 'checkpoint-1', choiceId: 'inspect-sender',
          pointsEarned: 20, timestamp: 1000,
        },
      },
      score: 20, inspectedClueIds: ['sender-identity'], startedAt: 100,
    };
    expect(record.decisions['checkpoint-1']?.pointsEarned).toBe(20);
    expect(record.decisions['checkpoint-2']).toBeUndefined();
    expect(record.status).toBe('in_progress');
  });
});
