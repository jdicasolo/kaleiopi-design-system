import type { LegalContent } from './LegalDocument';

/** Copy for the app's legal dialogs, mirrored from the registration flow. */
export const TERMS_OF_SERVICE: LegalContent = {
  title: 'Terms of Service',
  version: '2026-09-01-draft1',
  draft: true,
  sections: [
    {
      heading: '1. Acceptance of Terms',
      body: 'By accessing or using Kaleiopi (the "App," "Service," "we," "us," or "our"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, do not use the App. If you are using the App on behalf of a minor, or if you are a parent/guardian registering a minor for use of the App, you agree to these Terms on that minor\'s behalf and represent that you have the authority to do so.',
    },
    {
      heading: '2. Description of Service',
      body: 'Kaleiopi is a free application designed to help students connect, collaborate, and improve study habits and scheduling. Kaleiopi does not guarantee any specific academic outcome, grade improvement, or result from use of the App.',
    },
    {
      heading: '3. Eligibility',
      body: `Users must be at least [13/16/18 — confirm minimum age with legal counsel, especially in light of COPPA if under 13] years old to create an account without parental consent.

If a user is a minor under applicable law, a parent or legal guardian must review and accept these Terms, including the liability release in Section 9, on the minor's behalf.

By registering, you represent that all information provided is accurate and that you meet the eligibility requirements above.`,
    },
    {
      heading: '4. Account Registration & Promo Codes',
      body: `Users may optionally enter a promo code at registration, which may be used to attribute the referral to a Kaleiopi campus ambassador for internal tracking purposes only.

Use of a promo code does not create any additional rights, discounts, or obligations for the registering user.

You are responsible for maintaining the confidentiality of your account credentials and for all activity under your account.`,
    },
    {
      heading: '5. Free Service & Donations',
      body: `Kaleiopi is provided free of charge to students and will remain free for core functionality.

Users and parents may optionally make one-time or recurring monetary donations to support the App's operating costs.

Donations are voluntary, non-refundable, and do not entitle the donor to any additional features, services, or benefits beyond what is otherwise available to all users for free, unless explicitly stated otherwise at the time of donation.

Payment processing is handled by third-party payment providers (e.g., Stripe, PayPal). Kaleiopi does not store full payment card information on its own servers.`,
    },
    {
      heading: '6. User Conduct',
      body: `Users agree not to:
— Use the App for any unlawful purpose or in violation of any applicable school, university, or institutional policy.
— Harass, bully, threaten, or harm other users.
— Impersonate any person or entity, or misrepresent your affiliation with any person or entity.
— Attempt to interfere with, disrupt, or gain unauthorized access to the App, its servers, or related systems.
— Use another user's promo code, account, or identity without authorization.

Kaleiopi reserves the right to suspend or terminate any account that violates these Terms, at our sole discretion.`,
    },
    {
      heading: '7. User-Generated Content (Feature Suggestions, Public Roadmap)',
      body: `Any feature suggestions, feedback, or other content submitted through the App (e.g., via the "Suggest a Feature" tool or public roadmap) may be used, displayed publicly, and implemented by Kaleiopi without compensation or attribution to the submitting user.

By submitting content, you grant Kaleiopi a non-exclusive, royalty-free, worldwide, perpetual license to use, reproduce, modify, and display that content in connection with the operation and promotion of the App.

Do not submit content that is unlawful, defamatory, obscene, or that infringes on the rights of any third party.`,
    },
    {
      heading: '8. Intellectual Property',
      body: `The Kaleiopi name, logo, branding, and all associated trademarks are the property of Vitruvius Informatics LLC. Users may not use Kaleiopi's branding without prior written permission.

All software, design, and content within the App (excluding user-submitted content) are owned by Kaleiopi/Vitruvius Informatics LLC and protected by applicable intellectual property laws.`,
    },
    {
      heading: '9. Release of Liability & Assumption of Risk',
      body: `PLEASE READ THIS SECTION CAREFULLY. IT AFFECTS YOUR LEGAL RIGHTS.

No Guarantee of Results. Kaleiopi is a tool intended to assist with study habits, scheduling, and peer connection. We make no guarantee, warranty, or representation regarding academic performance, grades, or any specific outcome resulting from use of the App.

Peer Interactions. Kaleiopi may facilitate connections between users (e.g., study partners). Kaleiopi does not conduct background checks on users and is not responsible for the conduct, actions, statements, or behavior of any user toward another user, whether occurring within the App or in person as a result of a connection made through the App. Users assume all risk associated with meeting or interacting with other users, including in-person meetings arranged through the App.

"As-Is" Basis. The App is provided "as is" and "as available," without warranties of any kind, either express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, and non-infringement.

Limitation of Liability. To the fullest extent permitted by law, Kaleiopi, its founders, employees, contractors, and affiliates (collectively, the "Released Parties") shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of data, revenue, academic standing, or opportunity, arising out of or related to your use of the App, even if advised of the possibility of such damages.

Release. To the fullest extent permitted by applicable law, you release and forever discharge the Released Parties from any and all claims, demands, damages, causes of action, or liability of any kind, whether known or unknown, arising out of or in any way connected with your use of the App, including but not limited to any interactions with other users, technical issues, data loss, or reliance on any information provided through the App.

Indemnification. You agree to indemnify and hold harmless the Released Parties from any claims, damages, liabilities, and expenses (including reasonable attorneys' fees) arising from your violation of these Terms or your use of the App.`,
    },
    {
      heading: '10. Privacy',
      body: 'Your use of the App is also governed by our Privacy Policy, which describes how we collect, use, and protect your information, including compliance with applicable laws such as FERPA (if applicable to any institutional partnerships).',
    },
    {
      heading: '11. Modifications to the App and Terms',
      body: 'We may modify, suspend, or discontinue the App, or any part of it, at any time without liability. We may also update these Terms from time to time; continued use of the App after changes constitutes acceptance of the revised Terms.',
    },
    {
      heading: '12. Termination',
      body: 'We may suspend or terminate your access to the App at any time, with or without cause or notice, including for violation of these Terms.',
    },
    {
      heading: '13. Governing Law & Dispute Resolution',
      body: `These Terms shall be governed by the laws of the State of [Insert State], without regard to conflict of law principles. Any disputes arising under these Terms shall be resolved in the state or federal courts located in [Insert County/State], and you consent to the jurisdiction of such courts.

[Note for attorney review: Consider whether an arbitration clause and class-action waiver are appropriate for your risk profile; these are common in consumer-facing apps but have specific drafting and disclosure requirements.]`,
    },
    {
      heading: '14. Contact Information',
      body: 'For questions about these Terms, contact us at: [Insert Contact Email]',
    },
  ],
};

export const PARENT_CONSENT_ADDENDUM: LegalContent = {
  title: 'Parent/Guardian Consent Addendum',
  version: '2026-09-01-draft1',
  draft: true,
  sections: [
    {
      heading: 'Parent/Guardian Consent Addendum (For Minor Users)',
      body: `If you are the parent or legal guardian of a minor registering for Kaleiopi, please review and acknowledge the following:

— I am the parent or legal guardian of [Student Name], and I have the legal authority to consent on their behalf.
— I have read and understood the Terms of Service, including the Release of Liability in Section 9, and I agree to its terms on behalf of my child.
— I understand that Kaleiopi may facilitate connections with other students and that I assume responsibility for my child's interactions arising from use of the App.
— I consent to my child's use of the App and to the collection and use of their information as described in the Privacy Policy.`,
    },
  ],
};
