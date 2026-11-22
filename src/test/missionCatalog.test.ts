import { describe, it, expect } from 'vitest';
import { MISSION_CATALOG, MISSION_1_META } from '../features/missions/missionCatalog';
import {
  Checkpoint1or2Points,
  Checkpoint3Points,
  Checkpoint1Decision,
  Checkpoint2Decision,
  Checkpoint3Decision,
  MissionRecord,
} from '../types/mission';

describe('Mission Catalog and Scoring Architecture Contracts', () => {
  it('contains valid metadata for all three defined missions', () => {
    expect(MISSION_CATALOG.parcel).toBeDefined();
    expect(MISSION_CATALOG.internship).toBeDefined();
    expect(MISSION_CATALOG.refund).toBeDefined();

    expect(MISSION_1_META.order).toBe(1);
    expect(MISSION_1_META.id).toBe('parcel');
    expect(MISSION_1_META.title).toBe('The Missing Package');
    expect(MISSION_1_META.estimatedDuration).toBe('60 seconds');
  });

  it('strictly validates checkpoint discriminated points (30 + 30 + 40 constraint)', () => {
    // Checkpoints 1 and 2: only 0, 15, or 30
    const cp1Points: Checkpoint1or2Points = 30;
    const cp2Points: Checkpoint1or2Points = 15;
    // Checkpoint 3: only 0, 20, or 40
    const cp3Points: Checkpoint3Points = 40;

    const total = cp1Points + cp2Points + cp3Points;
    expect(total).toBe(85);

    const cp1Dec: Checkpoint1Decision = {
      checkpointId: 'checkpoint-1',
      choiceId: 'choice-1a',
      pointsEarned: 30,
      timestamp: Date.now(),
    };
    const cp2Dec: Checkpoint2Decision = {
      checkpointId: 'checkpoint-2',
      choiceId: 'choice-2b',
      pointsEarned: 15,
      timestamp: Date.now(),
    };
    const cp3Dec: Checkpoint3Decision = {
      checkpointId: 'checkpoint-3',
      choiceId: 'choice-3a',
      pointsEarned: 40,
      timestamp: Date.now(),
    };

    expect(cp1Dec.checkpointId).toBe('checkpoint-1');
    expect(cp2Dec.checkpointId).toBe('checkpoint-2');
    expect(cp3Dec.checkpointId).toBe('checkpoint-3');
  });

  it('allows incomplete decision maps for in-progress missions', () => {
    const inProgressRecord: MissionRecord = {
      missionId: 'parcel',
      status: 'in_progress',
      decisions: {
        'checkpoint-1': {
          checkpointId: 'checkpoint-1',
          choiceId: 'choice-1a',
          pointsEarned: 30,
          timestamp: 1000,
        },
        // checkpoint-2 and checkpoint-3 are not yet made
      },
      score: 30,
      inspectedClueIds: ['sender-clue'],
    };

    expect(inProgressRecord.decisions['checkpoint-1']?.pointsEarned).toBe(30);
    expect(inProgressRecord.decisions['checkpoint-2']).toBeUndefined();
    expect(inProgressRecord.status).toBe('in_progress');
  });
});
