import { describe, expect, it } from 'vitest';
import {
  REFUND_STEPS, createRefundSession, displayRefundChoices, matchesRefundPuzzle,
  recordRefundResponse, refundScore, validRefundSession,
} from '../features/missions/refund/refundModel';

describe('Refund Trap twelve-step engine', () => {
  it('includes ten choices and two evidence-recall puzzles', () => {
    expect(REFUND_STEPS).toHaveLength(12);
    expect(REFUND_STEPS.filter(step => step.kind === 'choice')).toHaveLength(10);
    expect(REFUND_STEPS.filter(step => step.kind === 'puzzle')).toHaveLength(2);
  });
  it('completes all safest responses with exactly 100 points', () => {
    let state = createRefundSession(123);
    for (const step of REFUND_STEPS) {
      state = recordRefundResponse(state, step.kind === 'puzzle' ? 'solved' : step.choices.find(option => option.outcome === 'safe')!.id);
    }
    expect(state.stepIndex).toBe(12);
    expect(refundScore(state)).toBe(100);
    expect(validRefundSession(state)).toBe(true);
    expect(() => recordRefundResponse(state, 'solved')).toThrow(/complete/i);
  });
  it('accepts entered evidence with normalized spaces, hyphens and case', () => {
    expect(matchesRefundPuzzle('rf 7318', 'RF-7318')).toBe(true);
    expect(matchesRefundPuzzle(' mango ', 'MANGO')).toBe(true);
    expect(matchesRefundPuzzle('7319', 'RF-7318')).toBe(false);
  });
  it('preserves choice IDs and varies the display without altering scores', () => {
    const step = REFUND_STEPS[0];
    if (step.kind !== 'choice') throw new Error('Unexpected fixture');
    const positions = new Set<number>();
    for (let seed = 1; seed <= 100; seed++) {
      const order = displayRefundChoices(step, seed);
      expect(order.map(item => item.id).sort()).toEqual(step.choices.map(item => item.id).sort());
      positions.add(order.findIndex(item => item.outcome === 'safe'));
    }
    expect(positions.size).toBe(3);
    expect(displayRefundChoices(step, 57)).toEqual(displayRefundChoices(step, 57));
  });
  it('rejects edited score and out-of-order progress', () => {
    const first = REFUND_STEPS[0];
    if (first.kind !== 'choice') throw new Error('Unexpected fixture');
    const state = recordRefundResponse(createRefundSession(10), first.choices[0].id);
    expect(validRefundSession(state)).toBe(true);
    expect(validRefundSession({ ...state, responses: [{ ...state.responses[0], points: 10 }] })).toBe(false);
    expect(validRefundSession({ ...state, stepIndex: 2 })).toBe(false);
  });
});
