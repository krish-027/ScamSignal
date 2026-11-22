import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { InternshipPage } from '../features/missions/internship/InternshipPage';
import { RECRUITMENT_STORAGE_KEY } from '../features/missions/internship/internshipModel';

beforeEach(() => localStorage.removeItem(RECRUITMENT_STORAGE_KEY));

describe('Dream Internship UI', () => {
  it('locks decisions, allows read-only Back, and keeps accessible icon-only navigation', () => {
    const onExit = vi.fn();
    render(<InternshipPage onExit={onExit} />);
    expect(screen.getByRole('button', { name: /phone home/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /begin investigation/i }));
    fireEvent.click(screen.getByRole('button', { name: /look for the employer through an independent source/i }));
    expect(screen.getByRole('dialog', { name: /lock in decision/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /confirm and lock/i }));
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '1');
    fireEvent.click(screen.getByRole('button', { name: /phone back/i }));
    const dialog = screen.getByRole('dialog', { name: /case log/i });
    expect(dialog).toHaveTextContent('An unexpected invitation');
    expect(dialog).toHaveTextContent('read-only');
    fireEvent.click(screen.getByRole('button', { name: /return to current question/i }));
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '1');
    fireEvent.click(screen.getByRole('button', { name: /phone home/i }));
    expect(onExit).toHaveBeenCalledOnce();
  });
});
