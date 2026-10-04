import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from './Badge';

const meta = {
  title: 'Components/Badge',
  component: Badge,
  args: { children: 'Home semester', tone: 'brand' },
  argTypes: {
    tone: { control: 'select', options: ['neutral', 'brand', 'gold', 'pink', 'teal', 'success', 'warning', 'danger'] },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Brand: Story = {};

/** Accent tones use a pale tint with navy text, which passes AA whatever the hue. */
export const Accents: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge tone="gold">🔥 5-day streak</Badge>
      <Badge tone="pink">Step 2 of 4</Badge>
      <Badge tone="teal">New material</Badge>
    </div>
  ),
};

/** Functional tones keep their semantic colors and are never remapped to the brand. */
export const Functional: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge tone="success">Correct</Badge>
      <Badge tone="warning">not your home semester</Badge>
      <Badge tone="danger">Overdue</Badge>
      <Badge tone="neutral">Draft</Badge>
    </div>
  ),
};

export const Small: Story = { args: { size: 'sm', tone: 'warning', children: 'not your home semester' } };
