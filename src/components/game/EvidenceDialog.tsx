import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ShieldCheck, X } from 'lucide-react';
import type { Clue } from '../../types/mission';

interface EvidenceDialogProps {
  clue: Clue;
  onClose: () => void;
  returnFocusTo: HTMLButtonElement | null;
}

/** A single-action accessible modal with Escape, Tab trapping and focus return. */
export function EvidenceDialog({ clue, onClose, returnFocusTo }: EvidenceDialogProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
      if (event.key === 'Tab') {
        // Only one focusable control is in this dialog.
        event.preventDefault();
        closeRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = oldOverflow;
      document.removeEventListener('keydown', handleKey);
      if (returnFocusTo?.isConnected) returnFocusTo.focus();
    };
  }, [onClose, returnFocusTo]);

  return createPortal(
    <div
      className="evidence-backdrop"
      onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="evidence-title"
        aria-describedby="evidence-description"
        className="evidence-dialog"
      >
        <div className="evidence-dialog-top">
          <span className="evidence-eyebrow"><ShieldCheck size={16} aria-hidden="true" /> Evidence examined</span>
          <button ref={closeRef} type="button" className="evidence-close" onClick={onClose} aria-label="Close evidence panel">
            <X size={20} aria-hidden="true" />
          </button>
        </div>
        <h2 id="evidence-title" className="text-heading">{clue.sourceLabel}</h2>
        <p id="evidence-description" className="text-body">{clue.explanation}</p>
        <p className="evidence-footnote">Inspecting evidence does not affect your score.</p>
      </section>
    </div>,
    document.body,
  );
}
