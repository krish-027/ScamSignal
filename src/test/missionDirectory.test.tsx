import { expect, it, vi } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { MissionSelectPage } from '../features/missions/directory/MissionSelectPage';

it('lists all three available missions in order and opens the chosen one', () => {
  const onSelect = vi.fn();
  const onBack = vi.fn();
  render(<MissionSelectPage onSelect={onSelect} onBack={onBack} />);
  const buttons = screen.getAllByRole('button', { name: /^play the/i });
  expect(buttons).toHaveLength(3);
  expect(buttons.map(button => button.getAttribute('aria-label'))).toEqual([
    'Play The Missing Package', 'Play The Dream Internship', 'Play The Refund Trap',
  ]);
  fireEvent.click(within(screen.getByRole('main')).getByRole('button', { name: 'Play The Dream Internship' }));
  expect(onSelect).toHaveBeenCalledWith('internship');
  fireEvent.click(screen.getByRole('button', { name: /back to home/i }));
  expect(onBack).toHaveBeenCalledOnce();
});
