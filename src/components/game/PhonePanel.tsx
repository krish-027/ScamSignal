import { useEffect, useId, useRef } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface PhonePanelProps {
  title: string;
  children: ReactNode;
  onClose: () => void;
  returnFocusTo: HTMLElement | null;
  description?: string;
}

/** One modal at a time; Escape and close semantics are owned by the active tool. */
export function PhonePanel({ title, children, onClose, returnFocusTo, description }: PhonePanelProps) {
  const closeButton = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLElement>(null);
  const dialogId = useId();
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const focusReturnRef = useRef(returnFocusTo);
  focusReturnRef.current = returnFocusTo;

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButton.current?.focus();
    const handleKeys = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onCloseRef.current();
        return;
      }
      if (event.key !== 'Tab' || !contentRef.current) return;
      const nodes = Array.from(contentRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], input:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )).filter(el => el.getClientRects().length > 0 || el === closeButton.current);
      if (!nodes.length) { event.preventDefault(); return; }
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault(); first.focus();
      }
    };
    document.addEventListener('keydown', handleKeys);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeys);
      const target = focusReturnRef.current;
      if (target?.isConnected) target.focus();
    };
  }, []);

  return createPortal(
    <div className="phone-panel-backdrop" onMouseDown={event => {
      if (event.currentTarget === event.target) onClose();
    }}>
      <section ref={contentRef} role="dialog" aria-modal="true" aria-labelledby={dialogId} className="phone-panel">
        <div className="phone-panel-titlebar">
          <h2 id={dialogId}>{title}</h2>
          <button ref={closeButton} type="button" className="phone-panel-close" onClick={onClose} aria-label={`Close ${title}`}>
            <X size={20} aria-hidden="true" />
          </button>
        </div>
        {description && <p className="phone-panel-description">{description}</p>}
        {children}
      </section>
    </div>, document.body,
  );
}
