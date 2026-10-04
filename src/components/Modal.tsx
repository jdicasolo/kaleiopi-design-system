import { useEffect, useId, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cx } from '../utils/cx';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  /** Leading emoji or icon shown before the title. */
  icon?: ReactNode;
  children?: ReactNode;
  /** Right-aligned actions row, usually one or two Buttons. */
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  /** Close when the backdrop is clicked. Turn off for forms that would lose input. */
  dismissOnBackdrop?: boolean;
  /** Show a "✕ Close" button in the title row, as on the app's quiz modal. */
  showClose?: boolean;
  /** Extra classes for the panel, e.g. to switch it to a flex column. */
  className?: string;
}

const SIZES = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl' };

/** Centered dialog over a dimmed backdrop. Closes on Escape, traps nothing,
 * and returns focus to whatever was focused before it opened. Modals can stack
 * (e.g. the assistant over a quiz); Escape only closes the topmost one. */
export function Modal({ open, onClose, title, icon, children, footer, size = 'sm', dismissOnBackdrop = true, showClose = false, className }: ModalProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    panelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      // Portals mount in order, so the last open dialog is the one on top.
      const dialogs = document.querySelectorAll('[role="dialog"][aria-modal="true"]');
      if (dialogs[dialogs.length - 1] === panelRef.current) onCloseRef.current();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      previouslyFocused?.focus?.();
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={dismissOnBackdrop ? onClose : undefined}>
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className={cx('bg-white rounded-2xl shadow-lg p-6 w-full max-h-[85vh] overflow-y-auto focus:outline-none', SIZES[size], className)}
      >
        <div className="flex items-start justify-between gap-4 mb-2">
          <h2 id={titleId} className="font-semibold text-gray-900">
            {icon && <span aria-hidden="true">{icon} </span>}
            {title}
          </h2>
          {showClose && (
            <button
              type="button"
              onClick={onClose}
              className="flex-shrink-0 text-sm text-gray-500 hover:text-gray-700 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-kaleiopi-purple-400"
            >
              <span aria-hidden="true">✕ </span>Close
            </button>
          )}
        </div>
        {children && <div className="text-sm text-gray-600">{children}</div>}
        {footer && <div className="flex justify-end gap-2 pt-5">{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}
