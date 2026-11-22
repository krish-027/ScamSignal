/** ScamSignal mission contracts — version 2 (five scored parcel checkpoints). */
export type MissionId = 'parcel' | 'internship' | 'refund';
export type CheckpointId =
  | 'checkpoint-1'
  | 'checkpoint-2'
  | 'checkpoint-3'
  | 'checkpoint-4'
  | 'checkpoint-5';

export type SceneKind = 'message' | 'inspection' | 'decision' | 'consequence' | 'reveal' | 'debrief';
export type Outcome = 'safe' | 'caution' | 'risky';
export type ClueEmphasis = 'sender' | 'url' | 'urgency' | 'payment' | 'claim';

export interface Clue {
  id: string;
  sourceLabel: string;
  explanation: string;
  emphasis: ClueEmphasis;
}

/** Five checkpoints of 20 points each. Cautious choices receive half credit. */
export type DecisionPoints = 0 | 10 | 20;

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

export interface CheckpointDecision {
  checkpointId: CheckpointId;
  choiceId: string;
  pointsEarned: DecisionPoints;
  timestamp: number;
}

export interface MissionRecord {
  missionId: MissionId;
  status: 'not_started' | 'in_progress' | 'completed';
  currentSceneId?: string;
  decisions: Partial<Record<CheckpointId, CheckpointDecision>>;
  score: number;
  inspectedClueIds: string[];
  startedAt?: number;
  completedAt?: number;
}

export interface GameSessionState {
  schemaVersion: 2;
  activeMissionId: MissionId;
  missionRecords: Record<MissionId, MissionRecord>;
  overallScore: number | null;
}

export interface MissionDefinition {
  id: MissionId;
  meta: MissionMeta;
  startSceneId: string;
  clues: Record<string, Clue>;
  scenes: Record<string, Scene>;
}
