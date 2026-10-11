import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Card } from './Card';
import { PRIVACY_POLICY, PrivacyPolicy, PrivacyPolicyModal } from './PrivacyPolicy';

const meta = {
  title: 'Components/PrivacyPolicy',
  component: PrivacyPolicy,
  decorators: [(Story) => <div style={{ width: 672, maxWidth: '100%' }}><Card padding="lg"><Story /></Card></div>],
} satisfies Meta<typeof PrivacyPolicy>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The full policy, as on a standalone legal page. Drafts end with the reviewer checklist. */
export const Inline: Story = {};

/** Once `draft` is off, the warning banner and reviewer checklist disappear. */
export const Published: Story = {
  args: { document: { ...PRIVACY_POLICY, draft: false } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByText('Working draft — pending legal review')).not.toBeInTheDocument();
    await expect(canvas.queryByText(/Reviewer checklist/)).not.toBeInTheDocument();
  },
};

/** Section 2 is split into numbered subsections. */
export const RendersSubsections: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { level: 3, name: '2.1 Information You Provide Directly' })).toBeInTheDocument();
    await expect(canvas.getByText(/^Device and browser information:/).tagName).toBe('LI');
  },
};

/** Opened from a "Privacy Policy" link in sign-up or settings. */
export const InModal: Story = {
  decorators: [(Story) => <Story />],
  parameters: { layout: 'fullscreen', docs: { story: { inline: false, iframeHeight: 640 } } },
  render: () => <PrivacyPolicyModal open onClose={fn()} />,
};

export const OpenFromLink: Story = {
  decorators: [(Story) => <Story />],
  parameters: { layout: 'centered' },
  render: function Render() {
    const [open, setOpen] = useState(false);
    return (
      <>
        <p className="text-sm text-gray-500">
          Read our{' '}
          <button type="button" onClick={() => setOpen(true)} className="text-kaleiopi-purple-600 hover:underline">Privacy Policy</button>.
        </p>
        <PrivacyPolicyModal open={open} onClose={() => setOpen(false)} />
      </>
    );
  },
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Privacy Policy' }));
    const dialog = within(document.body).getByRole('dialog', { name: 'Privacy Policy' });
    await userEvent.click(within(dialog).getAllByRole('button', { name: /Close/ })[0]);
    await expect(within(document.body).queryByRole('dialog')).not.toBeInTheDocument();
  },
};
