import { describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fireEvent, render, screen } from '@testing-library/react';
import { HomePage } from '../features/home/HomePage';
import { MissionSelectPage } from '../features/missions/directory/MissionSelectPage';
import { BrandMark } from '../components/ui/BrandMark';

describe('SIGNAL / NOISE visual overhaul regression', () => {
  it('retains hero accessibility and shows noninteractive signal artwork', () => {
    const browse = vi.fn();
    const { container } = render(<HomePage onStart={browse} />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('The internet is testing you.');
    expect(container.querySelector('.visual-home .visual-hero')).toBeTruthy();
    expect(container.querySelector('.signal-field')?.getAttribute('aria-hidden')).toBe('true');
    expect(container.querySelector('.signal-field svg')?.getAttribute('focusable')).toBe('false');
    expect(screen.getAllByRole('tab')).toHaveLength(3);
    fireEvent.click(screen.getByRole('button', { name: /start investigation and choose a mission/i }));
    expect(browse).toHaveBeenCalledTimes(1);
  });

  it('keeps three case tabs keyboard operated after the visual refresh', () => {
    const { container } = render(<HomePage onStart={vi.fn()} />);
    const first = screen.getByRole('tab', { name: /delivery/i });
    first.focus();
    fireEvent.keyDown(first, { key: 'ArrowRight' });
    expect(screen.getByRole('tab', { name: /internship/i })).toHaveFocus();
    expect(screen.getByRole('tabpanel')).toHaveTextContent('TalentBridge Recruiting');
    expect(container.querySelector('.home-case-preview-card')).not.toBeNull();
  });

  it('preserves navigation button labels and ordering on the mission index', () => {
    const onSelect = vi.fn();
    render(<MissionSelectPage onBack={vi.fn()} onSelect={onSelect} />);
    expect(screen.getAllByRole('button', { name: /^Play The/ }).map(button => button.getAttribute('aria-label'))).toEqual([
      'Play The Missing Package', 'Play The Dream Internship', 'Play The Refund Trap',
    ]);
    fireEvent.click(screen.getByRole('button', { name: 'Play The Refund Trap' }));
    expect(onSelect).toHaveBeenCalledWith('refund');
  });

  it('keeps the existing accessible brand name and text during icon redesign', () => {
    render(<BrandMark />);
    expect(screen.getByRole('img', { name: 'ScamSignal Shield' })).toBeInTheDocument();
    expect(screen.getByText(/ScamSignal/i)).toBeInTheDocument();
    expect(screen.getByText(/Interactive Simulation/i)).toBeInTheDocument();
  });

  it('uses the same signal mark in the browser tab and the application header', () => {
    const html = readFileSync(resolve(process.cwd(), 'index.html'), 'utf8');
    const icon = readFileSync(resolve(process.cwd(), 'public/scamsignal-mark-4e.svg'), 'utf8');
    const legacyIcon = readFileSync(resolve(process.cwd(), 'public/favicon.svg'), 'utf8');

    expect(html).toContain('href="/scamsignal-mark-4e.svg"');
    expect(legacyIcon).toBe(icon);

    const { container } = render(<BrandMark showBadge={false} />);
    const headerSvg = container.querySelector('svg');
    const faviconSvg = new DOMParser().parseFromString(icon, 'image/svg+xml').querySelector('svg');

    expect(headerSvg).not.toBeNull();
    expect(faviconSvg).not.toBeNull();
    expect(faviconSvg?.getAttribute('viewBox')).toBe(headerSvg?.getAttribute('viewBox'));
    expect([...faviconSvg!.querySelectorAll('path')].map(path => path.getAttribute('d')))
      .toEqual([...headerSvg!.querySelectorAll('path')].map(path => path.getAttribute('d')));
    expect(faviconSvg?.querySelector('circle')?.getAttribute('cx'))
      .toBe(headerSvg?.querySelector('circle')?.getAttribute('cx'));
    expect(faviconSvg?.querySelector('circle')?.getAttribute('cy'))
      .toBe(headerSvg?.querySelector('circle')?.getAttribute('cy'));
  });
});
