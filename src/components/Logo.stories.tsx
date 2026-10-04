import type { Meta, StoryObj } from '@storybook/react-vite';
import { Logo } from './Logo';

const meta = {
  title: 'Components/Logo',
  component: Logo,
  args: { variant: 'wordmark', size: 'md' },
  argTypes: {
    variant: { control: 'inline-radio', options: ['icon', 'wordmark'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof Logo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Wordmark: Story = {};
export const Icon: Story = { args: { variant: 'icon', size: 'lg' } };
export const Small: Story = { args: { size: 'sm' } };
