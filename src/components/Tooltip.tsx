import { cloneElement, useEffect, useId, useState, type ReactElement, type ReactNode } from 'react';
import { cx } from '../utils/cx';

export interface TooltipProps {
  /** The message. Nothing renders when it's empty. */
  content: ReactNode;
  placement?: 'top' | 'bottom';
  /** One focusable element; it receives `aria-describedby` pointing at the message. */
  children: ReactElement<Record<string, unknown>>;
  className?: string;
}

/** Short message shown while the child is hovered or focused. Escape hides it.
 * The text stays in the DOM, so screen readers announce it as the child's description. */
export function Tooltip({ content, placement = 'top', children, className }: TooltipProps) {
  const id = useId();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  if (content == null || content === false || content === '') return children;

  return (
    <span
      className={cx('relative inline-flex', className)}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      {cloneElement(children, { 'aria-describedby': cx(children.props['aria-describedby'] as string | undefined, id) || undefined })}
      <span
        role="tooltip"
        id={id}
        className={cx(
          'absolute left-1/2 -translate-x-1/2 z-50 w-max max-w-xs pointer-events-none',
          'bg-kaleiopi-navy text-white text-xs font-medium leading-snug rounded-lg px-2.5 py-1.5 shadow-lg',
          placement === 'top' ? 'bottom-full mb-2' : 'top-full mt-2',
          !open && 'hidden',
        )}
      >
        {content}
      </span>
    </span>
  );
}
