import { describe, expect, it } from 'vitest';
import {
  RECRUITMENT_STEPS, answerRecruitment, displayedRecruitmentChoices,
  isValidRecruitmentState, newRecruitment, puzzleMatches, recruitmentScore,
} from '../features/missions/internship/internshipModel';

describe('Dream Internship — scoring, puzzles and locked progress', () => {
  it('contains 8 scored choices plus two evidence-recall puzzles', () => {
    expect(RECRUITMENT_STEPS).toHaveLength(10);
    expect(RECRUITMENT_STEPS.filter(step => step.kind === 'choice')).toHaveLength(8);
    expect(RECRUITMENT_STEPS.filter(step => step.kind === 'puzzle')).toHaveLength(2);
  });
  it('makes choices stable per seed but not fixed in safest-first order', () => {
    const first = RECRUITMENT_STEPS[0];
    if (first.kind !== 'choice') throw new Error('Invalid test fixture');
    expect(displayedRecruitmentChoices(first, 123)).toEqual(displayedRecruitmentChoices(first, 123));
    const locations = new Set<number>();
    for (let seed = 1; seed <= 100; seed++) {
      locations.add(displayedRecruitmentChoices(first, seed).findIndex(c => c.outcome === 'safe'));
    }
    expect(locations.size).toBe(3);
  });
  it('accepts both puzzle answers case-insensitively and rejects wrong answers', () => {
    expect(puzzleMatches(' 4 8 2 6 ', '4826')).toBe(true);
    expect(puzzleMatches('lantern', 'LANTERN')).toBe(true);
    expect(puzzleMatches('1234', '4826')).toBe(false);
  });
  it('completes ten steps and scores 100 for the safe route', () => {
    let state = newRecruitment(101);
    for (const step of RECRUITMENT_STEPS) {
      state = answerRecruitment(state, step.kind === 'puzzle' ? 'solved'
        : step.choices.find(c => c.outcome === 'safe')!.id);
    }
    expect(state.stepIndex).toBe(10);
    expect(recruitmentScore(state)).toBe(100);
    expect(isValidRecruitmentState(state)).toBe(true);
    expect(() => answerRecruitment(state, 'solved')).toThrow(/complete/i);
  });
  it('rejects altered scores and out-of-order decisions when loading', () => {
    const start = newRecruitment(101);
    const first = RECRUITMENT_STEPS[0];
    if (first.kind !== 'choice') throw new Error('Invalid test fixture');
    const state = answerRecruitment(start, first.choices[0].id);
    expect(isValidRecruitmentState(state)).toBe(true);
    expect(isValidRecruitmentState({ ...state, answers: [{...state.answers[0], points: 40}] })).toBe(false);
    expect(isValidRecruitmentState({ ...state, stepIndex: 2 })).toBe(false);
  });
});
