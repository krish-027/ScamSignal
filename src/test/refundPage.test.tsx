import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { RefundPage } from '../features/missions/refund/RefundPage';
import { REFUND_STORAGE_KEY } from '../features/missions/refund/refundModel';

beforeEach(() => localStorage.removeItem(REFUND_STORAGE_KEY));

describe('Refund Trap UI', () => {
  it('locks a chosen response, opens read-only Back, and returns to current step', () => {
    const onExit = vi.fn();
    render(<RefundPage onExit={onExit} />);
    fireEvent.click(screen.getByRole('button', { name: /begin investigation/i }));
    fireEvent.click(screen.getByRole('button', { name: /open the store through your own saved app/i }));
    fireEvent.click(screen.getByRole('button', { name: /confirm and lock/i }));
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '1');
    fireEvent.click(screen.getByRole('button', { name: /refund phone back/i }));
    expect(screen.getByRole('dialog', { name: /refund case log/i })).toHaveTextContent('read-only');
    fireEvent.click(screen.getByRole('button', { name: /return to current step/i }));
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '1');
    fireEvent.click(screen.getByRole('button', { name: /refund phone home/i }));
    expect(onExit).toHaveBeenCalledOnce();
  });
});
