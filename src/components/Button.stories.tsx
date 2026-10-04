import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Button } from './Button';

const meta = {
  title: 'Components/Button',
  component: Button,
  args: { children: 'Find study partners', onClick: fn() },
  argTypes: {
    variant: { control: 'inline-radio', options: ['primary', 'secondary', 'ghost', 'danger', 'celebrate'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
export const Secondary: Story = { args: { variant: 'secondary', children: 'Cancel' } };
export const Ghost: Story = { args: { variant: 'ghost', children: 'View all matches' } };
export const Danger: Story = { args: { variant: 'danger', children: 'Leave group' } };

/** Gold tint with navy text, the AA-safe treatment for the donation CTA. */
export const Celebrate: Story = { args: { variant: 'celebrate', pill: true, children: '☕ Buy us a coffee' } };

export const Loading: Story = { args: { loading: true, loadingLabel: 'Sending…' } };
export const Disabled: Story = { args: { disabled: true } };

/** Compact pill actions, as used inside banners and cards. */
export const SmallPill: Story = { args: { size: 'sm', pill: true, children: 'Resend email' } };

export const FullWidth: Story = {
  args: { fullWidth: true, children: 'Log in' },
  decorators: [(Story) => <div style={{ width: 320 }}><Story /></div>],
};

export const AllVariants: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      <Button {...args}>Primary</Button>
      <Button {...args} variant="secondary">Secondary</Button>
      <Button {...args} variant="ghost">Ghost</Button>
      <Button {...args} variant="danger">Danger</Button>
      <Button {...args} variant="celebrate" pill>☕ Celebrate</Button>
    </div>
  ),
};
