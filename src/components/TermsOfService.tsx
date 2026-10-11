import type { ReactNode } from 'react';
import { LegalDocument, LegalDocumentModal, type LegalContent } from './LegalDocument';
import { TERMS_OF_SERVICE } from './TermsOfService.content';

export { TERMS_OF_SERVICE, PARENT_CONSENT_ADDENDUM } from './TermsOfService.content';

export interface TermsOfServiceProps {
  /** Defaults to the Terms of Service; pass `PARENT_CONSENT_ADDENDUM` for the minor-user addendum. */
  document?: LegalContent;
  /** Show the document title as a heading. Off inside `TermsOfServiceModal`, which titles itself. */
  showTitle?: boolean;
  className?: string;
}

/** The app's Terms of Service. Inline on a standalone page, or inside
 * `TermsOfServiceModal` during sign-up. */
export function TermsOfService({ document = TERMS_OF_SERVICE, ...props }: TermsOfServiceProps) {
  return <LegalDocument content={document} {...props} />;
}

export interface TermsOfServiceModalProps {
  open: boolean;
  onClose: () => void;
  document?: LegalContent;
  /** Replaces the default "Close" button, e.g. with Decline / I agree. */
  footer?: ReactNode;
}

/** The sign-up form's "Terms of Service and Release of Liability" dialog. */
export function TermsOfServiceModal({ document = TERMS_OF_SERVICE, ...props }: TermsOfServiceModalProps) {
  return <LegalDocumentModal content={document} {...props} />;
}
