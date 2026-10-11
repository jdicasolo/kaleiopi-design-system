import type { ReactNode } from 'react';
import { LegalDocument, LegalDocumentModal, type LegalContent } from './LegalDocument';
import { PRIVACY_POLICY } from './PrivacyPolicy.content';

export { PRIVACY_POLICY } from './PrivacyPolicy.content';

export interface PrivacyPolicyProps {
  /** Defaults to the app's Privacy Policy copy. */
  document?: LegalContent;
  /** Show the document title as a heading. Off inside `PrivacyPolicyModal`, which titles itself. */
  showTitle?: boolean;
  className?: string;
}

/** The app's Privacy Policy. Inline on a standalone page, or inside
 * `PrivacyPolicyModal` when linked from sign-up or settings. */
export function PrivacyPolicy({ document = PRIVACY_POLICY, ...props }: PrivacyPolicyProps) {
  return <LegalDocument content={document} {...props} />;
}

export interface PrivacyPolicyModalProps {
  open: boolean;
  onClose: () => void;
  document?: LegalContent;
  /** Replaces the default "Close" button. */
  footer?: ReactNode;
}

export function PrivacyPolicyModal({ document = PRIVACY_POLICY, ...props }: PrivacyPolicyModalProps) {
  return <LegalDocumentModal content={document} {...props} />;
}
