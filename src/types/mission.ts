/**
 * ScamSignal - Mission and Game State Type Definitions
 * Contracts only for future gameplay engine integration.
 * Safeguard 3: Structure future mission decision storage by mission ID and checkpoint ID,
 * preserving idempotent scoring, replay/reset behavior, and independent mission histories.
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

/**
 * Checkpoint scoring structure:
 * Checkpoint 1: 0 | 15 | 30
 * Checkpoint 2: 0 | 15 | 30
 * Checkpoint 3: 0 | 20 | 40
 * Total possible per mission: 100 points
 */
export type DecisionPoints = 0 | 15 | 20 | 30 | 40;

export interface Choice {
  id: string;
  checkpointId: CheckpointId;
  label: string;
  nextSceneId: string;
  points: DecisionPoints;
  consequenceText: string;
  safetyRationale: string;
  outcomeType: Outcome;
}

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

/**
 * Idempotent decision record stored by checkpoint ID
 */
export interface CheckpointDecision {
  checkpointId: CheckpointId;
  choiceId: string;
  pointsEarned: DecisionPoints;
  timestamp: number;
}

/**
 * Independent mission state to support replay/reset without affecting other missions
 */
export interface MissionRecord {
  missionId: MissionId;
  status: 'not_started' | 'in_progress' | 'completed';
  decisions: Record<CheckpointId, CheckpointDecision>;
  score: number; // 0-100 derived from decisions sum
  inspectedClueIds: string[];
  startedAt?: number;
  completedAt?: number;
}

/**
 * Complete game session state contract
 */
export interface GameSessionState {
  schemaVersion: 1;
  activeMissionId: MissionId;
  missionRecords: Record<MissionId, MissionRecord>;
  overallScore: number | null; // Math.round average of completed missions only
}
