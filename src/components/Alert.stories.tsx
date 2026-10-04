import type { Meta, StoryObj } from '@storybook/react-vite';
import { Alert } from './Alert';
import { Button } from './Button';

const meta = {
  title: 'Components/Alert',
  component: Alert,
  args: { tone: 'info', title: 'Your study plan is ready', children: 'We spread 14 topics across the 3 weeks before your midterm.' },
  argTypes: { tone: { control: 'inline-radio', options: ['info', 'success', 'warning', 'error'] } },
  decorators: [(Story) => <div style={{ width: 560, maxWidth: '100%' }}><Story /></div>],
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = { args: { icon: '✨' } };

/** The app's "verify your email" banner. */
export const VerifyEmail: Story = {
  args: {
    tone: 'warning',
    icon: '📬',
    title: 'Verify your email to unlock study rooms, matches, chat, and calendar',
    children: 'We sent a link to maya@psu.edu.',
    action: <Button size="sm" pill className="bg-amber-700 hover:bg-amber-800">Resend email</Button>,
  },
};

export const Success: Story = { args: { tone: 'success', icon: '✅', title: 'Calendar synced', children: '12 class meetings imported from Google Calendar.' } };
export const Error: Story = { args: { tone: 'error', title: 'Upload blocked', children: 'This file failed the malware scan and was not saved.' } };
