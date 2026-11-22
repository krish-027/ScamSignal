/**
 * ScamSignal - Mission and Game State Type Definitions
 * Batch 1 Type Contracts (No playable logic implemented in Batch 1).
 * 
 * Enforces checkpoint-specific scoring rules via discriminated unions:
 * - Checkpoint 1: 0 | 15 | 30 points
 * - Checkpoint 2: 0 | 15 | 30 points
 * - Checkpoint 3: 0 | 20 | 40 points
 * Total potential score per mission: 100 points
 */

export type MissionId = 'parcel' | 'internship' | 'refund';

export type CheckpointId = 'checkpoint-1' | 'checkpoint-2' | 'checkpoint-3';

export type SceneKind = 
  | 'message' 
  | 'inspection' 
  | 'decision' 
  | 'consequence' 
  | 'reveal' 
  | 'debrief';

export type Outcome = 'safe' | 'caution' | 'risky';

export type ClueEmphasis = 'sender' | 'url' | 'urgency' | 'payment' | 'claim';

export interface Clue {
  id: string;
  sourceLabel: string;
  explanation: string;
  emphasis: ClueEmphasis;
}

/** Checkpoint-specific allowed point values */
export type Checkpoint1or2Points = 0 | 15 | 30;
export type Checkpoint3Points = 0 | 20 | 40;
export type DecisionPoints = Checkpoint1or2Points | Checkpoint3Points;

/** Discriminated choice types ensuring checkpoint-specific points */
export interface Checkpoint1Choice {
  id: string;
  checkpointId: 'checkpoint-1';
  label: string;
  nextSceneId: string;
  points: Checkpoint1or2Points;
  consequenceText: string;
  safetyRationale: string;
  outcomeType: Outcome;
}

export interface Checkpoint2Choice {
  id: string;
  checkpointId: 'checkpoint-2';
  label: string;
  nextSceneId: string;
  points: Checkpoint1or2Points;
  consequenceText: string;
  safetyRationale: string;
  outcomeType: Outcome;
}

export interface Checkpoint3Choice {
  id: string;
  checkpointId: 'checkpoint-3';
  label: string;
  nextSceneId: string;
  points: Checkpoint3Points;
  consequenceText: string;
  safetyRationale: string;
  outcomeType: Outcome;
}

export type Choice = Checkpoint1Choice | Checkpoint2Choice | Checkpoint3Choice;

export interface Scene {
  id: string;
  kind: SceneKind;
  checkpointId?: CheckpointId;
  title?: string;
  body: string;
  clueIds?: string[];
  choices?: Choice[];
  nextSceneId?: string;
  outcome?: Outcome;
}

export interface MissionMeta {
  id: MissionId;
  order: 1 | 2 | 3;
  title: string;
  subtitle: string;
  setup: string;
  learningObjective: string;
  estimatedDuration: string;
  simulatedSender: {
    displayName: string;
    address: string;
    verifiedBadge: boolean;
  };
  keyCluesCount: number;
}

/** Discriminated decision records stored by checkpoint ID */
export interface Checkpoint1Decision {
  checkpointId: 'checkpoint-1';
  choiceId: string;
  pointsEarned: Checkpoint1or2Points;
  timestamp: number;
}

export interface Checkpoint2Decision {
  checkpointId: 'checkpoint-2';
  choiceId: string;
  pointsEarned: Checkpoint1or2Points;
  timestamp: number;
}

export interface Checkpoint3Decision {
  checkpointId: 'checkpoint-3';
  choiceId: string;
  pointsEarned: Checkpoint3Points;
  timestamp: number;
}

export type CheckpointDecision =
  | Checkpoint1Decision
  | Checkpoint2Decision
  | Checkpoint3Decision;

/**
 * Independent mission state to support replay/reset without affecting other missions.
 * Optional checkpoint keys also enforce checkpoint-specific point types.
 */
export interface MissionRecord {
  missionId: MissionId;
  status: 'not_started' | 'in_progress' | 'completed';
  currentSceneId?: string; // Unset before starting or after reset
  decisions: {
    'checkpoint-1'?: Checkpoint1Decision;
    'checkpoint-2'?: Checkpoint2Decision;
    'checkpoint-3'?: Checkpoint3Decision;
  };
  score: number; // 0-100 derived sum of decisions
  inspectedClueIds: string[];
  startedAt?: number;
  completedAt?: number;
}

/** Complete game session state contract */
export interface GameSessionState {
  schemaVersion: 1;
  activeMissionId: MissionId;
  missionRecords: Record<MissionId, MissionRecord>;
  overallScore: number | null; // Math.round average of completed missions only
}

/** Data-driven definition consumed by the Batch 2 mission engine. */
export interface MissionDefinition {
  id: MissionId;
  meta: MissionMeta;
  startSceneId: string;
  clues: Record<string, Clue>;
  scenes: Record<string, Scene>;
}
