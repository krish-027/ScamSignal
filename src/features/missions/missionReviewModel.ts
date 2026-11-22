import type { CheckpointId, MissionDefinition, MissionRecord, Outcome } from '../../types/mission';

export interface ReviewedDecision {
  checkpointId: CheckpointId;
  ordinal: number;
  title: string;
  selectedLabel: string;
  points: number;
  outcome: Outcome;
  rationale: string;
  saferAlternative: string;
}

/** Deterministic report generated from existing locked records; never changes scores. */
export function getReviewedDecisions(record: MissionRecord, definition: MissionDefinition): ReviewedDecision[] {
  const decisionScenes = Object.values(definition.scenes).filter(scene => scene.kind === 'decision');
  return decisionScenes.flatMap((scene, index) => {
    const checkpoint = scene.checkpointId;
    if (!checkpoint) return [];
    const decision = record.decisions[checkpoint];
    const choice = scene.choices?.find(item => item.id === decision?.choiceId);
    if (!decision || !choice) return [];
    const best = scene.choices?.reduce((current, item) => item.points > current.points ? item : current);
    return [{
      checkpointId: checkpoint,
      ordinal: index + 1,
      title: scene.title ?? `Decision ${index + 1}`,
      selectedLabel: choice.label,
      points: decision.pointsEarned,
      outcome: choice.outcomeType,
      rationale: choice.safetyRationale,
      saferAlternative: best?.label ?? choice.label,
    }];
  });
}

export function formatMissionReport(record: MissionRecord, definition: MissionDefinition): string {
  const rows = getReviewedDecisions(record, definition);
  const lines = [
    `ScamSignal - ${definition.meta.title}`,
    `Score: ${record.score}/100`,
    `Decisions: ${rows.length}`,
    `Evidence reviewed: ${record.inspectedClueIds.length}/${Object.keys(definition.clues).length}`,
    '',
  ];
  for (const row of rows) {
    lines.push(
      `${row.ordinal}. ${row.title} (${row.points} points)`,
      `Chosen: ${row.selectedLabel}`,
      `Why: ${row.rationale}`,
      `Safer approach: ${row.saferAlternative}`,
      '',
    );
  }
  lines.push('Review suspicious requests through independently trusted channels.');
  return lines.join('\n');
}
