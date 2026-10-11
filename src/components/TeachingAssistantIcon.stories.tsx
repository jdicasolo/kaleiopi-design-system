import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Avatar } from './Avatar';
import { ProfessorIcon } from './ProfessorIcon';
import { TeachingAssistantIcon } from './TeachingAssistantIcon';

const meta = {
  title: 'Components/TeachingAssistantIcon',
  component: TeachingAssistantIcon,
  args: { size: 48, tone: 'teal' },
  argTypes: {
    size: { control: { type: 'range', min: 12, max: 128, step: 4 } },
    tone: { control: 'inline-radio', options: ['brand', 'navy', 'teal', 'gold', 'pink', 'inherit'] },
  },
} satisfies Meta<typeof TeachingAssistantIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-4">
      {[16, 20, 24, 32, 48, 84].map((size) => <TeachingAssistantIcon key={size} size={size} />)}
    </div>
  ),
};

/** Same palette outlines as `ProfessorIcon`. */
export const Tones: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      {(['brand', 'navy', 'teal', 'gold', 'pink'] as const).map((tone) => <TeachingAssistantIcon key={tone} size={48} tone={tone} />)}
    </div>
  ),
};

/** `inherit` follows the text color, for icons on dark or colored surfaces. */
export const OnDark: Story = {
  render: () => (
    <span className="inline-flex bg-kaleiopi-teal-800 rounded-xl p-2">
      <TeachingAssistantIcon size={40} tone="inherit" className="text-white" />
    </span>
  ),
};

/** Marks course staff in a member list. */
export const CourseStaff: Story = {
  render: () => (
    <ul className="flex flex-col gap-3 text-sm">
      <li className="flex items-center gap-2">
        <Avatar name="Dana Whitfield" size="sm" />
        <span className="font-medium text-gray-900">Dr. Dana Whitfield</span>
        <ProfessorIcon size={18} title="Professor" />
      </li>
      <li className="flex items-center gap-2">
        <Avatar name="Marcus Chen" size="sm" />
        <span className="font-medium text-gray-900">Marcus Chen</span>
        <TeachingAssistantIcon size={18} title="Teaching assistant" />
      </li>
    </ul>
  ),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('img', { name: 'Teaching assistant' })).toBeInTheDocument();
  },
};
