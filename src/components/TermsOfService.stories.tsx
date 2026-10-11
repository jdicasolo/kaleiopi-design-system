import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Button } from './Button';
import { Card } from './Card';
import { PARENT_CONSENT_ADDENDUM, TermsOfService, TermsOfServiceModal } from './TermsOfService';

const meta = {
  title: 'Components/TermsOfService',
  component: TermsOfService,
  decorators: [(Story) => <div style={{ width: 672, maxWidth: '100%' }}><Card padding="lg"><Story /></Card></div>],
} satisfies Meta<typeof TermsOfService>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The full terms, as on a standalone legal page. */
export const Inline: Story = {};

/** Shown to a parent or guardian when the student is under 18. */
export const ParentConsentAddendum: Story = { args: { document: PARENT_CONSENT_ADDENDUM } };

/** Section 6 lists its rules as bullets. */
export const RendersBullets: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { name: '6. User Conduct' })).toBeInTheDocument();
    await expect(canvas.getByText('Harass, bully, threaten, or harm other users.').tagName).toBe('LI');
  },
};

/** The sign-up form's dialog, opened from the "I have read and agree" checkbox. */
export const InModal: Story = {
  decorators: [(Story) => <Story />],
  parameters: { layout: 'fullscreen', docs: { story: { inline: false, iframeHeight: 640 } } },
  render: () => <TermsOfServiceModal open onClose={fn()} />,
};

/** Agreeing from the dialog ticks the sign-up checkbox. */
export const AgreeFromModal: Story = {
  decorators: [(Story) => <Story />],
  parameters: { layout: 'centered' },
  render: function Render() {
    const [open, setOpen] = useState(false);
    const [agreed, setAgreed] = useState(false);
    return (
      <>
        <label className="flex items-start gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-0.5 accent-kaleiopi-purple-600 w-4 h-4" />
          <span>
            I have read and agree to the{' '}
            <button type="button" onClick={() => setOpen(true)} className="text-kaleiopi-purple-600 hover:underline">
              Terms of Service and Release of Liability
            </button>
            .
          </span>
        </label>
        <TermsOfServiceModal
          open={open}
          onClose={() => setOpen(false)}
          footer={
            <>
              <Button variant="secondary" onClick={() => setOpen(false)}>Close</Button>
              <Button onClick={() => { setAgreed(true); setOpen(false); }}>I agree</Button>
            </>
          }
        />
      </>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: /Terms of Service/ }));
    const dialog = within(document.body).getByRole('dialog', { name: 'Terms of Service' });
    await userEvent.click(within(dialog).getByRole('button', { name: 'I agree' }));
    await expect(canvas.getByRole('checkbox')).toBeChecked();
  },
};
