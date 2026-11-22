import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { ProgressPage } from '../features/progress/ProgressPage';

beforeEach(() => window.localStorage.clear());

describe('Batch 4A progress dashboard', () => {
  it('shows three unstarted cases and five locked achievements with no saved data', () => {
    render(<ProgressPage onHome={vi.fn()} onMissions={vi.fn()} onSelectMission={vi.fn()} />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/instincts have taken you/i);
    expect(screen.getAllByRole('progressbar')).toHaveLength(3);
    expect(screen.getByRole('heading', { name: 'The Missing Package' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'The Dream Internship' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'The Refund Trap' })).toBeInTheDocument();
    expect(screen.getAllByLabelText('Locked')).toHaveLength(5);
  });
  it('navigates to the correct mission and directory without editing progress', () => {
    const onSelectMission = vi.fn();
    const onMissions = vi.fn();
    const onHome = vi.fn();
    render(<ProgressPage onHome={onHome} onMissions={onMissions} onSelectMission={onSelectMission} />);
    fireEvent.click(screen.getByRole('button', { name: 'Start The Dream Internship' }));
    expect(onSelectMission).toHaveBeenCalledWith('internship');
    fireEvent.click(screen.getByRole('button', { name: /browse all missions/i }));
    expect(onMissions).toHaveBeenCalledOnce();
    fireEvent.click(screen.getByRole('button', { name: /^home$/i }));
    expect(onHome).toHaveBeenCalledOnce();
  });
});
