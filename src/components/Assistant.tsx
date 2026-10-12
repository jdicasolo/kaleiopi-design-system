import { useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent, type ReactNode } from 'react';
import { Maximize2 } from 'lucide-react';
import { Badge, type BadgeTone } from './Badge';
import { Button } from './Button';
import { Card } from './Card';
import { Textarea } from './Input';
import { Modal, type ModalProps } from './Modal';
import { cx } from '../utils/cx';

export type AssistantSourceKind = 'material' | 'note' | 'learning-science';

export interface AssistantSource {
  id: string;
  /** e.g. "Lecture 3 slides" or "My Cornell notes · Week 2". */
  label: string;
  kind?: AssistantSourceKind;
  href?: string;
}

export interface AssistantMessage {
  id: string;
  role: 'user' | 'assistant';
  content: ReactNode;
  /** What an assistant reply was drawn from. Shown under the reply so students can check it. */
  sources?: AssistantSource[];
  /** Renders the reply as a failed request, e.g. a timeout. */
  status?: 'error';
}

export interface AssistantSuggestion {
  label: ReactNode;
  /** Passed to `onSend` when the chip is clicked. */
  prompt: string;
}

export interface AssistantProps {
  /** The conversation, oldest first. The app owns it, so an embedded and a modal assistant can share one thread. */
  messages: AssistantMessage[];
  /** Called with the trimmed text when the student sends a message or picks a suggestion. */
  onSend: (text: string) => void;
  /** Waiting on a reply: shows a typing indicator and holds sending. */
  pending?: boolean;
  pendingLabel?: ReactNode;
  /** Quick-start chips above the input, e.g. "Make flashcards" or "Just a hint". */
  suggestions?: AssistantSuggestion[];
  /** What the assistant is looking at, e.g. the current quiz question. Shown as a strip above the conversation. */
  context?: ReactNode;
  /** Shown while the conversation is empty. */
  greeting?: ReactNode;
  greetingHint?: ReactNode;
  placeholder?: string;
  /** Grounding note under the input. Pass `null` to hide it. */
  disclaimer?: ReactNode;
  title?: ReactNode;
  subtitle?: ReactNode;
  /** Leading emoji or icon in the header. */
  icon?: ReactNode;
  /** Shows the expand button in the header, usually to reopen the thread in an AssistantModal. */
  onExpand?: () => void;
  /** Extra header actions, placed before the expand button. */
  actions?: ReactNode;
  /** Drops the card and header, for hosting inside another surface such as a Modal. */
  bare?: boolean;
  /** Focus the input on mount. */
  autoFocus?: boolean;
  /** Set a height here (e.g. `h-[32rem]`); the conversation scrolls inside it. */
  className?: string;
}

const SOURCE_KINDS: Record<AssistantSourceKind, { tone: BadgeTone; icon: string }> = {
  material: { tone: 'brand', icon: '📄' },
  note: { tone: 'teal', icon: '✍️' },
  'learning-science': { tone: 'gold', icon: '🔬' },
};

/** The study room's natural-language assistant: a chat panel grounded in the room's
 * materials and notes. Embed it in a page, or use AssistantModal for in-context help. */
export function Assistant({
  messages,
  onSend,
  pending = false,
  pendingLabel = 'Checking your materials…',
  suggestions,
  context,
  greeting = 'How may I help you today?',
  greetingHint = 'Ask about anything in this study room, or start an activity.',
  placeholder = 'Ask a question…',
  disclaimer = 'Answers come only from this room’s materials and notes.',
  title = 'Study assistant',
  subtitle,
  icon = '✨',
  onExpand,
  actions,
  bare = false,
  autoFocus = false,
  className,
}: AssistantProps) {
  const titleId = useId();
  const inputId = useId();
  const [draft, setDraft] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const log = logRef.current;
    if (log) log.scrollTop = log.scrollHeight;
  }, [messages.length, pending]);

  useEffect(() => {
    if (!autoFocus) return;
    // Deferred a frame so it lands after a parent Modal focuses its own panel.
    const frame = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, [autoFocus]);

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || pending) return false;
    onSend(trimmed);
    return true;
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (send(draft)) setDraft('');
  };

  // Enter sends, Shift+Enter adds a line. Skip while an IME is composing.
  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      e.currentTarget.form?.requestSubmit();
    }
  };

  const pad = bare ? 'px-0' : 'px-4';

  const body = (
    <>
      {!bare && (
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
          <span aria-hidden="true" className="w-8 h-8 rounded-full bg-kaleiopi-purple-50 flex items-center justify-center flex-shrink-0">
            {icon}
          </span>
          <div className="min-w-0 flex-1">
            <h2 id={titleId} className="text-sm font-semibold text-gray-900 truncate">{title}</h2>
            {subtitle && <p className="text-xs text-gray-500 truncate">{subtitle}</p>}
          </div>
          {actions}
          {onExpand && (
            <Button variant="ghost" size="sm" className="px-2" onClick={onExpand} aria-label="Open in a larger window">
              <Maximize2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      )}

      {context && (
        <div className={cx(bare ? 'mt-1' : 'mx-4 mt-3', 'rounded-lg bg-kaleiopi-purple-50 border border-kaleiopi-purple-100 px-3 py-2 text-xs text-kaleiopi-purple-800')}>
          <span className="font-semibold text-kaleiopi-navy">Looking at: </span>
          {context}
        </div>
      )}

      <div ref={logRef} role="log" aria-label="Conversation" className={cx('flex-1 min-h-0 overflow-y-auto py-4 flex flex-col gap-3', pad)}>
        {messages.length === 0 && !pending ? (
          <div className="m-auto text-center px-4">
            <p className="text-base font-medium text-gray-700">{greeting}</p>
            {greetingHint && <p className="text-xs text-gray-500 mt-1">{greetingHint}</p>}
          </div>
        ) : (
          messages.map((m) => <Bubble key={m.id} message={m} />)
        )}
        {pending && (
          <div role="status" className="self-start flex items-center gap-2 rounded-2xl rounded-bl-md bg-gray-100 px-3.5 py-2.5 text-xs text-gray-600">
            <span aria-hidden="true" className="flex gap-1">
              {[0, 150, 300].map((delay) => (
                <span key={delay} className="w-1.5 h-1.5 rounded-full bg-kaleiopi-purple-400 animate-bounce motion-reduce:animate-none" style={{ animationDelay: `${delay}ms` }} />
              ))}
            </span>
            {pendingLabel}
          </div>
        )}
      </div>

      <div className={cx('pb-4 pt-3 border-t border-gray-100', pad)}>
        {suggestions && suggestions.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3" role="group" aria-label="Suggestions">
            {suggestions.map((s) => (
              <Button key={s.prompt} variant="secondary" size="sm" pill disabled={pending} onClick={() => send(s.prompt)}>
                {s.label}
              </Button>
            ))}
          </div>
        )}
        <form onSubmit={onSubmit} className="flex items-end gap-2">
          <label htmlFor={inputId} className="sr-only">Message the assistant</label>
          <Textarea
            ref={inputRef}
            id={inputId}
            rows={1}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            className="resize-none! max-h-32 field-sizing-content"
          />
          <Button type="submit" disabled={pending || !draft.trim()}>Send</Button>
        </form>
        {disclaimer && <p className="text-[11px] text-gray-500 mt-2">{disclaimer}</p>}
      </div>
    </>
  );

  if (bare) return <div className={cx('flex flex-col', className)}>{body}</div>;

  return (
    <Card padding="none" role="region" aria-labelledby={titleId} className={cx('flex flex-col min-h-80', className)}>
      {body}
    </Card>
  );
}

function Bubble({ message }: { message: AssistantMessage }) {
  const mine = message.role === 'user';
  const sources = message.sources ?? [];
  return (
    <div className={cx('flex flex-col max-w-[85%]', mine ? 'self-end items-end' : 'self-start items-start')}>
      <div
        className={cx(
          'rounded-2xl px-3.5 py-2 text-sm whitespace-pre-wrap break-words',
          mine
            ? 'bg-kaleiopi-purple-600 text-white rounded-br-md'
            : message.status === 'error'
              ? 'bg-red-50 text-red-700 border border-red-200 rounded-bl-md'
              : 'bg-gray-100 text-gray-800 rounded-bl-md',
        )}
      >
        <span className="sr-only">{mine ? 'You: ' : 'Assistant: '}</span>
        {message.content}
      </div>
      {!mine && sources.length > 0 && (
        <div className="flex flex-wrap items-center gap-1 mt-1.5">
          <span className="text-[11px] text-gray-500">From</span>
          <ul className="contents" aria-label="Sources">
            {sources.map((s) => {
              const kind = SOURCE_KINDS[s.kind ?? 'material'];
              const badge = (
                <Badge size="sm" tone={kind.tone}>
                  <span aria-hidden="true">{kind.icon}</span>
                  {s.label}
                </Badge>
              );
              return (
                <li key={s.id}>
                  {s.href ? (
                    <a href={s.href} className="rounded-full hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-kaleiopi-purple-400">
                      {badge}
                    </a>
                  ) : (
                    badge
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

export interface AssistantModalProps extends Omit<AssistantProps, 'bare' | 'onExpand' | 'actions' | 'subtitle' | 'className'> {
  open: boolean;
  onClose: () => void;
  size?: ModalProps['size'];
}

/** The assistant in a dialog, for in-context help such as hints on a quiz question.
 * Safe to open on top of another Modal: Escape closes this one first. */
export function AssistantModal({ open, onClose, size = 'md', title = 'Study assistant', icon = '✨', autoFocus = true, ...props }: AssistantModalProps) {
  return (
    <Modal open={open} onClose={onClose} title={title} icon={icon} size={size} showClose>
      <Assistant {...props} bare autoFocus={autoFocus} className="h-[min(32rem,65vh)]" />
    </Modal>
  );
}
