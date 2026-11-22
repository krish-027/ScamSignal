import { ArrowLeft, ArrowRight, Award, CheckCircle2, Circle, ShieldCheck, Trophy } from 'lucide-react';
import { BrandMark } from '../../components/ui/BrandMark';
import { readProgress } from './progressModel';
import type { ProgressMissionId } from './progressModel';
import './progress.css';

interface ProgressPageProps {
  onHome: () => void;
  onMissions: () => void;
  onSelectMission: (id: ProgressMissionId) => void;
}

export function ProgressPage({ onHome, onMissions, onSelectMission }: ProgressPageProps) {
  // The page remounts after navigation, so saved results are read fresh without polling.
  const snapshot = readProgress();
  const unlocked = snapshot.achievements.filter(achievement => achievement.unlocked).length;
  return (
    <div className="progress-page view-transition">
      <header className="progress-header">
        <BrandMark />
        <button type="button" className="progress-nav" onClick={onHome}><ArrowLeft size={18} aria-hidden="true" /> Home</button>
      </header>
      <main className="progress-main" id="main-content">
        <div className="progress-hero">
          <span className="progress-eyebrow"><ShieldCheck size={17} aria-hidden="true" /> YOUR INVESTIGATION RECORD</span>
          <h1 tabIndex={-1}>See how far your instincts have taken you.</h1>
          <p>Track every case, revisit unfinished investigations, and discover achievements earned through your decisions.</p>
        </div>
        <div className="progress-overview" aria-label="Overall progress summary">
          <div><strong>{snapshot.completed}<small> / {snapshot.total}</small></strong><span>Cases completed</span></div>
          <div><strong>{snapshot.actionsDone}<small> / {snapshot.totalActions}</small></strong><span>Interactions recorded</span></div>
          <div><strong>{unlocked}<small> / {snapshot.achievements.length}</small></strong><span>Achievements unlocked</span></div>
        </div>
        <section aria-labelledby="progress-cases-title" className="progress-section">
          <div className="progress-section-heading"><h2 id="progress-cases-title">Your cases</h2><p>Scores reflect your current locally saved attempt, not an all-time best.</p></div>
          <div className="progress-missions">
            {snapshot.missions.map((mission, index) => (
              <article className="progress-mission" key={mission.id}>
                <div className="progress-mission-head">
                  <span className="progress-case-number">CASE {String(index + 1).padStart(2, '0')}</span>
                  <span className={`progress-status progress-status--${mission.status}`}>
                    {mission.status === 'completed' ? 'Completed' : mission.status === 'in-progress' ? 'In progress' : 'Not started'}
                  </span>
                </div>
                <h3>{mission.title}</h3>
                <p>{mission.answered} of {mission.total} interactions recorded</p>
                <div role="progressbar" aria-label={`${mission.title} completion`} aria-valuemin={0} aria-valuemax={mission.total} aria-valuenow={mission.answered} className="progress-bar">
                  <span style={{ width: `${100 * mission.answered / mission.total}%` }} />
                </div>
                <div className="progress-mission-foot">
                  <span>{mission.status === 'not-started' ? 'No score yet' : `${mission.points} points in this attempt`}</span>
                  <button type="button" onClick={() => onSelectMission(mission.id)} aria-label={`${mission.status === 'not-started' ? 'Start' : mission.status === 'completed' ? 'Review' : 'Continue'} ${mission.title}`}>
                    {mission.status === 'not-started' ? 'Start case' : mission.status === 'completed' ? 'Review case' : 'Continue case'}
                    <ArrowRight size={16} aria-hidden="true" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
        <section aria-labelledby="achievements-title" className="progress-section">
          <div className="progress-section-heading"><h2 id="achievements-title">Achievement cabinet</h2><p>Earned from actual saved completion and score records.</p></div>
          <div className="progress-achievements">
            {snapshot.achievements.map(achievement => (
              <article key={achievement.id} className={`progress-achievement ${achievement.unlocked ? 'is-unlocked' : 'is-locked'}`}>
                <span className="progress-achievement-icon" aria-hidden="true">{achievement.unlocked ? <Trophy size={23} /> : <Award size={23} />}</span>
                <div><h3>{achievement.name}</h3><p>{achievement.description}</p></div>
                <span className="progress-achievement-state" aria-label={achievement.unlocked ? 'Unlocked' : 'Locked'}>
                  {achievement.unlocked ? <CheckCircle2 size={19} aria-hidden="true" /> : <Circle size={19} aria-hidden="true" />}
                </span>
              </article>
            ))}
          </div>
        </section>
        <footer className="progress-footer">
          <p>Progress stays in this browser. Clearing site data or restarting a mission can change the displayed achievements and scores.</p>
          <button type="button" className="progress-browse" onClick={onMissions}>Browse all missions <ArrowRight size={17} aria-hidden="true" /></button>
        </footer>
      </main>
    </div>
  );
}
