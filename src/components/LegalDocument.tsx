import { useId, type ReactNode } from 'react';
import { Alert } from './Alert';
import { Button } from './Button';
import { Modal } from './Modal';
import { cx } from '../utils/cx';

/** Section bodies are plain text: blank lines split paragraphs and lines
 * starting with "— " render as bullets. */
export interface LegalSection {
  heading: string;
  body: string;
  /** Numbered children such as "2.1 …", rendered under the section's body. */
  subsections?: LegalSection[];
}

export interface LegalContent {
  title: string;
  /** Recorded alongside the user's acceptance, so bump it whenever the text changes. */
  version?: string;
  /** Shown as "Last updated …"; free text so placeholders like "[DATE]" survive. */
  lastUpdated?: string;
  /** Still has placeholders or attorney-review notes; shows a warning banner. */
  draft?: boolean;
  /** Replaces the banner's generic explanation while `draft` is set. */
  draftNote?: string;
  /** Internal to-dos for reviewers, listed at the end while `draft` is set. */
  reviewChecklist?: string[];
  sections: LegalSection[];
}

const BULLET = '— ';
const DEFAULT_DRAFT_NOTE = 'This text still has unresolved placeholders and attorney-review notes. It is not finalized.';

/** Renders a section body: blank lines split blocks, "— " lines become a list. */
function SectionBody({ body }: { body: string }) {
  return (
    <>
      {body.split(/\n{2,}/).map((block, i) => {
        const lines = block.split('\n');
        const items = lines.filter((l) => l.startsWith(BULLET));
        const text = lines.filter((l) => !l.startsWith(BULLET)).join('\n');
        return (
          <div key={i} className="flex flex-col gap-1.5">
            {text && <p className="whitespace-pre-line">{text}</p>}
            {items.length > 0 && (
              <ul className="list-disc pl-5 flex flex-col gap-1">
                {items.map((item) => <li key={item}>{item.slice(BULLET.length)}</li>)}
              </ul>
            )}
          </div>
        );
      })}
    </>
  );
}

export interface LegalDocumentProps {
  content: LegalContent;
  /** Show the document title as a heading. Off inside `LegalDocumentModal`, which titles itself. */
  showTitle?: boolean;
  className?: string;
}

/** Long-form legal text — version or date, draft banner, and numbered sections.
 * `TermsOfService` and `PrivacyPolicy` are this with their copy filled in. */
export function LegalDocument({ content, showTitle = true, className }: LegalDocumentProps) {
  const titleId = useId();
  const meta = [content.version && `Version ${content.version}`, content.lastUpdated && `Last updated ${content.lastUpdated}`].filter(Boolean).join(' · ');
  return (
    <article aria-labelledby={showTitle ? titleId : undefined} className={cx('text-sm text-gray-600', className)}>
      {showTitle && <h1 id={titleId} className="font-semibold text-gray-900 text-lg">{content.title}</h1>}
      {meta && <p className="text-xs text-gray-400 mb-4">{meta}</p>}
      {content.draft && (
        <Alert tone="warning" icon="⚠️" title="Working draft — pending legal review" className="mb-5">
          {content.draftNote ?? DEFAULT_DRAFT_NOTE}
        </Alert>
      )}
      <div className="flex flex-col gap-5">
        {content.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="font-semibold text-gray-900 mb-1.5">{section.heading}</h2>
            <div className="flex flex-col gap-3 leading-relaxed">
              {section.body && <SectionBody body={section.body} />}
              {section.subsections?.map((sub) => (
                <section key={sub.heading} className="flex flex-col gap-1.5">
                  <h3 className="font-medium text-gray-800">{sub.heading}</h3>
                  <SectionBody body={sub.body} />
                </section>
              ))}
            </div>
          </section>
        ))}
      </div>
      {content.draft && content.reviewChecklist && (
        <section className="mt-6 border border-dashed border-amber-300 rounded-xl p-4">
          <h2 className="font-semibold text-amber-800 mb-2">Reviewer checklist <span className="font-normal text-amber-700">(remove before publishing)</span></h2>
          <ul className="flex flex-col gap-1 text-amber-700">
            {content.reviewChecklist.map((item) => (
              <li key={item} className="flex gap-2"><span aria-hidden="true">☐</span>{item}</li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}

export interface LegalDocumentModalProps {
  open: boolean;
  onClose: () => void;
  content: LegalContent;
  /** Replaces the default "Close" button, e.g. with Decline / I agree. */
  footer?: ReactNode;
}

export function LegalDocumentModal({ open, onClose, content, footer }: LegalDocumentModalProps) {
  return (
    <Modal open={open} onClose={onClose} title={content.title} size="lg" showClose footer={footer ?? <Button onClick={onClose}>Close</Button>}>
      <LegalDocument content={content} showTitle={false} />
    </Modal>
  );
}
