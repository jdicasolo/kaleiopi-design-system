import type { Meta, StoryObj } from '@storybook/react-vite';
import { AvatarStack } from './Avatar';
import { Badge } from './Badge';
import { Button } from './Button';
import { Card } from './Card';

const meta = {
  title: 'Components/Card',
  component: Card,
  args: { padding: 'md', elevation: 'flat' },
  argTypes: {
    padding: { control: 'inline-radio', options: ['none', 'sm', 'md', 'lg'] },
    elevation: { control: 'inline-radio', options: ['flat', 'raised'] },
  },
  decorators: [(Story) => <div style={{ width: 360 }}><Story /></div>],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    children: (
      <>
        <h2 className="font-semibold text-gray-900">Upcoming session</h2>
        <p className="text-sm text-gray-500 mt-1">Thursday, 7:00 – 8:30 PM · Pattee Library</p>
      </>
    ),
  },
};

export const StudyGroup: Story = {
  args: {
    children: (
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-semibold text-gray-900">CS 221 Study Crew</h2>
            <p className="text-sm text-gray-500">Data Structures · Fall 2026</p>
          </div>
          <Badge tone="gold">🔥 5-week streak</Badge>
        </div>
        <div className="flex items-center justify-between">
          <AvatarStack people={[{ name: 'Maya Patel' }, { name: 'Jordan Lee' }, { name: 'Sam Rivera' }, { name: 'Alex Kim' }, { name: 'Priya Shah' }]} />
          <Button size="sm">Open room</Button>
        </div>
      </div>
    ),
  },
};

export const Raised: Story = { args: { elevation: 'raised', padding: 'lg', children: <p className="text-sm text-gray-600">Raised cards match modals and popovers.</p> } };
