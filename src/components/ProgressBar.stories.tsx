import type { Meta, StoryObj } from '@storybook/react-vite';
import { ProgressBar, StepIndicator } from './ProgressBar';

const meta = {
  title: 'Components/Progress',
  component: ProgressBar,
  args: { value: 6, max: 10, label: 'Flashcards reviewed', showCount: true, color: 'pink' },
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 10 } },
    color: { control: 'inline-radio', options: ['pink', 'purple', 'teal', 'gold'] },
  },
  decorators: [(Story) => <div style={{ width: 420 }}><Story /></div>],
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Bar: Story = {};
export const Complete: Story = { args: { value: 10 } };
export const Colors: Story = {
  render: (args) => (
    <div className="flex flex-col gap-3">
      {(['pink', 'purple', 'teal', 'gold'] as const).map((c) => (
        <ProgressBar key={c} {...args} color={c} label={`${c} progress`} />
      ))}
    </div>
  ),
};

/** Onboarding steps. */
export const Steps: Story = {
  render: () => <StepIndicator steps={['Account', 'Courses', 'Schedule', 'Matches']} current={2} />,
  decorators: [(Story) => <div style={{ width: 560, maxWidth: '100%' }}><Story /></div>],
};
