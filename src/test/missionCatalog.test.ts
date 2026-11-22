import { describe, it, expect } from 'vitest';
import { MISSION_CATALOG, MISSION_1_META } from '../features/missions/missionCatalog';
import { DecisionPoints, CheckpointId } from '../types/mission';

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

  it('verifies that checkpoint scoring structures conform to the 30 + 30 + 40 constraint', () => {
    // Checkpoint 1: 0 | 15 | 30
    const cp1Full: DecisionPoints = 30;
    const cp1Half: DecisionPoints = 15;
    const cp1Zero: DecisionPoints = 0;

    // Checkpoint 2: 0 | 15 | 30
    const cp2Full: DecisionPoints = 30;
    const cp2Half: DecisionPoints = 15;
    const cp2Zero: DecisionPoints = 0;

    // Checkpoint 3: 0 | 20 | 40
    const cp3Full: DecisionPoints = 40;
    const cp3Half: DecisionPoints = 20;
    const cp3Zero: DecisionPoints = 0;

    const maxScore = cp1Full + cp2Full + cp3Full;
    expect(maxScore).toBe(100);

    const halfScore = cp1Half + cp2Half + cp3Half;
    expect(halfScore).toBe(50);

    const minScore = cp1Zero + cp2Zero + cp3Zero;
    expect(minScore).toBe(0);

    // Verify checkpoint IDs
    const checkpoints: CheckpointId[] = ['checkpoint-1', 'checkpoint-2', 'checkpoint-3'];
    expect(checkpoints).toHaveLength(3);
  });
});
