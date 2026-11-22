import { loadSession } from '../missions/sessionStorage';
import { loadRecruitment, recruitmentScore, RECRUITMENT_STEPS } from '../missions/internship/internshipModel';
import { loadRefundSession, refundScore, REFUND_STEPS } from '../missions/refund/refundModel';
import type { RecruitmentState } from '../missions/internship/internshipModel';
import type { RefundSession } from '../missions/refund/refundModel';
import type { MissionRecord } from '../../types/mission';

export type ProgressMissionId = 'parcel' | 'internship' | 'refund';
export type ProgressStatus = 'not-started' | 'in-progress' | 'completed';

export interface MissionProgress {
  id: ProgressMissionId;
  title: string;
  status: ProgressStatus;
  answered: number;
  total: number;
  points: number;
  maxPoints: 100;
}
export interface Achievement {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
}
export interface ProgressSnapshot {
  missions: MissionProgress[];
  completed: number;
  total: 3;
  actionsDone: number;
  totalActions: number;
  achievements: Achievement[];
}

/** Pure projection of already validated session records; no writes or re-scoring. */
export function assembleProgress(
  parcel: MissionRecord | null | undefined,
  internship: RecruitmentState | null,
  refund: RefundSession | null,
): ProgressSnapshot {
  const parcelAnswers = parcel ? Object.keys(parcel.decisions).length : 0;
  const parcelStatus: ProgressStatus = parcel?.status === 'completed'
    ? 'completed' : parcel?.status === 'in_progress' ? 'in-progress' : 'not-started';
  const internshipStatus: ProgressStatus = !internship ? 'not-started'
    : internship.stepIndex === RECRUITMENT_STEPS.length ? 'completed' : 'in-progress';
  const refundStatus: ProgressStatus = !refund ? 'not-started'
    : refund.stepIndex === REFUND_STEPS.length ? 'completed' : 'in-progress';

  const missions: MissionProgress[] = [
    { id: 'parcel', title: 'The Missing Package', status: parcelStatus, answered: parcelAnswers, total: 5,
      points: parcel?.score ?? 0, maxPoints: 100 },
    { id: 'internship', title: 'The Dream Internship', status: internshipStatus,
      answered: internship?.stepIndex ?? 0, total: RECRUITMENT_STEPS.length,
      points: internship ? recruitmentScore(internship) : 0, maxPoints: 100 },
    { id: 'refund', title: 'The Refund Trap', status: refundStatus,
      answered: refund?.stepIndex ?? 0, total: REFUND_STEPS.length,
      points: refund ? refundScore(refund) : 0, maxPoints: 100 },
  ];
  const completed = missions.filter(mission => mission.status === 'completed').length;
  const fullMarks = missions.every(mission => mission.status === 'completed' && mission.points === 100);
  const puzzlesSolved = internshipStatus === 'completed' && refundStatus === 'completed';
  const achievements: Achievement[] = [
    { id: 'first-case', name: 'First Case Closed', description: 'Complete any one investigation.', unlocked: completed >= 1 },
    { id: 'double-defense', name: 'Double Defense', description: 'Complete two different investigations.', unlocked: completed >= 2 },
    { id: 'three-cases', name: 'Full Spectrum', description: 'Complete all three investigations.', unlocked: completed === 3 },
    { id: 'puzzle-solver', name: 'Evidence Solver', description: 'Complete both missions containing evidence-recall puzzles.', unlocked: puzzlesSolved },
    { id: 'perfect-record', name: 'Perfect Record', description: 'Finish every mission with 100 points in the current saved attempts.', unlocked: fullMarks },
  ];
  return {
    missions, completed, total: 3,
    actionsDone: missions.reduce((sum, mission) => sum + mission.answered, 0),
    totalActions: missions.reduce((sum, mission) => sum + mission.total, 0),
    achievements,
  };
}

/** Runs when the Progress or Mission Directory screen opens, never in the background. */
export function readProgress(): ProgressSnapshot {
  let parcel: MissionRecord | null = null;
  try { parcel = loadSession().missionRecords.parcel; } catch { /* browser storage unavailable */ }
  let internship: RecruitmentState | null = null;
  let refund: RefundSession | null = null;
  try { internship = loadRecruitment(); } catch { /* ignore unavailable storage */ }
  try { refund = loadRefundSession(); } catch { /* ignore unavailable storage */ }
  return assembleProgress(parcel, internship, refund);
}
