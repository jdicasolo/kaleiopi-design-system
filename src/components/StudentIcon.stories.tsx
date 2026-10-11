import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Avatar } from './Avatar';
import { ProfessorIcon } from './ProfessorIcon';
import { StudentIcon } from './StudentIcon';
import { TeachingAssistantIcon } from './TeachingAssistantIcon';

const meta = {
  title: 'Components/StudentIcon',
  component: StudentIcon,
  args: { size: 48, tone: 'gold' },
  argTypes: {
    size: { control: { type: 'range', min: 12, max: 128, step: 4 } },
    tone: { control: 'inline-radio', options: ['brand', 'navy', 'teal', 'gold', 'pink', 'inherit'] },
  },
} satisfies Meta<typeof StudentIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-4">
      {[16, 20, 24, 32, 48, 84].map((size) => <StudentIcon key={size} size={size} />)}
    </div>
  ),
};

/** Same palette pairings as `ProfessorIcon`: outline plus the family's 200 tint on the pocket. */
export const Tones: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      {(['brand', 'navy', 'teal', 'gold', 'pink'] as const).map((tone) => <StudentIcon key={tone} size={48} tone={tone} />)}
    </div>
  ),
};

/** `inherit` follows the text color, for icons on dark or colored surfaces. */
export const OnDark: Story = {
  render: () => (
    <span className="inline-flex bg-kaleiopi-gold-700 rounded-xl p-2">
      <StudentIcon size={40} tone="inherit" className="text-white" />
    </span>
  ),
};

/** The three role icons together in a course roster. */
export const CourseRoster: Story = {
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
      <li className="flex items-center gap-2">
        <Avatar name="Maya Patel" size="sm" />
        <span className="font-medium text-gray-900">Maya Patel</span>
        <StudentIcon size={18} title="Student" />
      </li>
    </ul>
  ),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('img', { name: 'Student' })).toBeInTheDocument();
  },
};
