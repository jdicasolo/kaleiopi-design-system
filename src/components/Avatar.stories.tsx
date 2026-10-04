import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar, AvatarStack } from './Avatar';

const meta = {
  title: 'Components/Avatar',
  component: Avatar,
  args: { name: 'Maya Patel', size: 'md' },
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] } },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Initials: Story = {};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-3">
      <Avatar {...args} size="sm" />
      <Avatar {...args} size="md" />
      <Avatar {...args} size="lg" />
    </div>
  ),
};

const members = ['Maya Patel', 'Jordan Lee', 'Sam Rivera', 'Alex Kim', 'Priya Shah', 'Chris Ng'].map((name) => ({ name }));

/** Study-group members: three avatars, then a "+N" overflow chip. */
export const Stack: Story = { render: () => <AvatarStack people={members} /> };
export const StackNoOverflow: Story = { render: () => <AvatarStack people={members.slice(0, 2)} /> };
export const StackLarge: Story = { render: () => <AvatarStack people={members} max={4} size="lg" /> };
