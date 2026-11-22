import { beforeEach, describe, expect, it } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { RefundPage } from '../features/missions/refund/RefundPage';
import { InternshipPage } from '../features/missions/internship/InternshipPage';
import { REFUND_STEPS } from '../features/missions/refund/refundModel';
import { RECRUITMENT_STEPS } from '../features/missions/internship/internshipModel';

beforeEach(() => localStorage.clear());

function reachPuzzle(steps: readonly { kind: string; choices?: readonly { id: string; label: string; outcome: string }[] }[]) {
  fireEvent.click(screen.getByRole('button', { name: /begin investigation/i }));
  for (const step of steps) {
    if (step.kind === 'puzzle') break;
    const safest = step.choices?.find(choice => choice.outcome === 'safe');
    if (!safest) throw new Error('Missing safe choice in test fixture');
    fireEvent.click(screen.getByRole('button', { name: new RegExp(safest.label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') }));
    const dialog = screen.getByRole('dialog');
    fireEvent.click(within(dialog).getByRole('button', { name: /confirm and lock/i }));
  }
}

describe('Batch 4B puzzle field feedback and keyboard labels', () => {
  it('announces an incorrect Refund Trap reference without losing progress', () => {
    render(<RefundPage onExit={() => undefined} />);
    reachPuzzle(REFUND_STEPS);
    const field = screen.getByRole('textbox', { name: /answer from earlier evidence/i });
    expect(field).toHaveAttribute('aria-invalid', 'false');
    fireEvent.change(field, { target: { value: 'WRONG' } });
    fireEvent.click(screen.getByRole('button', { name: /check evidence/i }));
    expect(field).toHaveAttribute('aria-invalid', 'true');
    const alert = screen.getByRole('alert');
    expect(alert.id).toBe('refund-evidence-error');
    expect(field).toHaveAttribute('aria-describedby', alert.id);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '4');
    fireEvent.change(field, { target: { value: 'RF-7318' } });
    expect(field).toHaveAttribute('aria-invalid', 'false');
    fireEvent.click(screen.getByRole('button', { name: /check evidence/i }));
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '5');
  });

  it('announces an incorrect internship reference and accepts correct evidence', () => {
    render(<InternshipPage onExit={() => undefined} />);
    reachPuzzle(RECRUITMENT_STEPS);
    const field = screen.getByRole('textbox', { name: /answer from earlier evidence/i });
    fireEvent.change(field, { target: { value: '0000' } });
    fireEvent.click(screen.getByRole('button', { name: /check evidence/i }));
    const alert = screen.getByRole('alert');
    expect(field).toHaveAttribute('aria-invalid', 'true');
    expect(alert.id).toBe('internship-puzzle-error');
    expect(field).toHaveAttribute('aria-describedby', alert.id);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '4');
    fireEvent.change(field, { target: { value: '4826' } });
    fireEvent.click(screen.getByRole('button', { name: /check evidence/i }));
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '5');
  });
});
