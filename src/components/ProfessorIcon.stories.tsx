import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Avatar } from './Avatar';
import { ProfessorIcon } from './ProfessorIcon';

const meta = {
  title: 'Components/ProfessorIcon',
  component: ProfessorIcon,
  args: { size: 48, tone: 'brand' },
  argTypes: {
    size: { control: { type: 'range', min: 12, max: 128, step: 4 } },
    tone: { control: 'inline-radio', options: ['brand', 'navy', 'teal', 'gold', 'pink', 'inherit'] },
  },
} satisfies Meta<typeof ProfessorIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-4">
      {[16, 20, 24, 32, 48, 84].map((size) => <ProfessorIcon key={size} size={size} />)}
    </div>
  ),
};

/** Each tone is a palette color at a step that stays visible on white. */
export const Tones: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      {(['brand', 'navy', 'teal', 'gold', 'pink'] as const).map((tone) => <ProfessorIcon key={tone} size={48} tone={tone} />)}
    </div>
  ),
};

/** `inherit` follows the text color, for icons on dark or colored surfaces. */
export const OnDark: Story = {
  render: () => (
    <span className="inline-flex bg-kaleiopi-purple-600 rounded-xl p-2">
      <ProfessorIcon size={40} tone="inherit" className="text-white" />
    </span>
  ),
};

/** Marks the instructor in a member list. */
export const NextToAName: Story = {
  render: () => (
    <div className="flex items-center gap-2 text-sm">
      <Avatar name="Dana Whitfield" size="sm" />
      <span className="font-medium text-gray-900">Dr. Dana Whitfield</span>
      <ProfessorIcon size={18} title="Professor" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('img', { name: 'Professor' })).toBeInTheDocument();
  },
};
