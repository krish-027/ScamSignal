import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { HomeCasePreview } from '../features/home/HomeCasePreview';
import { HomePage } from '../features/home/HomePage';

describe('Batch 4C three-case homepage preview', () => {
  it('previews all three current missions rather than only the parcel message', () => {
    const onSelect = vi.fn();
    render(<HomeCasePreview onSelectMission={onSelect} onBrowseMissions={vi.fn()} />);
    const tabs = screen.getAllByRole('tab');
    expect(tabs).toHaveLength(3);
    expect(screen.getByRole('tab', { name: /delivery/i })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('SpeedPost Courier');
    fireEvent.click(screen.getByRole('tab', { name: /internship/i }));
    expect(screen.getByRole('tabpanel')).toHaveTextContent('TalentBridge Recruiting');
    fireEvent.click(screen.getByRole('tab', { name: /refund/i }));
    expect(screen.getByRole('tabpanel')).toHaveTextContent('MossCart Support');
    fireEvent.click(screen.getByRole('button', { name: 'Explore The Refund Trap' }));
    expect(onSelect).toHaveBeenCalledWith('refund');
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it('supports Arrow keys, Home and End without autoplay or hidden answer changes', () => {
    render(<HomeCasePreview onBrowseMissions={vi.fn()} />);
    const delivery = screen.getByRole('tab', { name: /delivery/i });
    delivery.focus();
    fireEvent.keyDown(delivery, { key: 'ArrowRight' });
    const internship = screen.getByRole('tab', { name: /internship/i });
    expect(internship).toHaveAttribute('aria-selected', 'true');
    expect(internship).toHaveFocus();
    fireEvent.keyDown(internship, { key: 'End' });
    expect(screen.getByRole('tab', { name: /refund/i })).toHaveAttribute('aria-selected', 'true');
    fireEvent.keyDown(screen.getByRole('tab', { name: /refund/i }), { key: 'Home' });
    expect(delivery).toHaveAttribute('aria-selected', 'true');
  });

  it('keeps the homepage primary CTA and direct case exploration separate', () => {
    const browse = vi.fn();
    const select = vi.fn();
    render(<HomePage onStart={browse} onSelectMission={select} />);
    fireEvent.click(screen.getByRole('button', { name: /start investigation and choose a mission/i }));
    expect(browse).toHaveBeenCalledOnce();
    fireEvent.click(screen.getByRole('tab', { name: /internship/i }));
    fireEvent.click(screen.getByRole('button', { name: 'Explore The Dream Internship' }));
    expect(select).toHaveBeenCalledWith('internship');
    expect(screen.queryByText('SIMULATED NOTIFICATION PREVIEW')).not.toBeInTheDocument();
  });

  it('falls back to browsing missions if no direct navigation callback was provided', () => {
    const browse = vi.fn();
    render(<HomeCasePreview onBrowseMissions={browse} />);
    fireEvent.click(screen.getByRole('button', { name: /explore the missing package/i }));
    expect(browse).toHaveBeenCalledOnce();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });
});
