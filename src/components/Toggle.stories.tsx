import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Toggle } from './Toggle';

const meta = {
  title: 'Components/Toggle',
  component: Toggle,
  args: { label: 'Study reminders', tooltip: 'Get a nudge 15 minutes before each study block', onChange: fn() },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    tooltipPlacement: { control: 'inline-radio', options: ['top', 'bottom'] },
  },
  // Room above for the tooltip.
  decorators: [(Story) => <div style={{ paddingTop: 56 }}><Story /></div>],
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Hover or tab to the switch to see the message. */
export const Default: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const toggle = canvas.getByRole('switch', { name: 'Study reminders' });
    await userEvent.hover(toggle);
    await expect(canvas.getByRole('tooltip')).toBeVisible();
    await expect(toggle).toHaveAccessibleDescription('Get a nudge 15 minutes before each study block');
    await userEvent.click(toggle);
    await expect(toggle).toBeChecked();
    await expect(args.onChange).toHaveBeenCalledWith(true);
    await userEvent.unhover(toggle);
    await expect(canvas.getByRole('tooltip')).not.toBeVisible();
  },
};

export const On: Story = { args: { defaultChecked: true } };

export const Small: Story = { args: { size: 'sm', label: 'Show streak on profile', tooltip: 'Classmates in your rooms can see it' } };

/** The message can change with the state, describing what a click will do. */
export const MessageByState: Story = {
  args: { label: 'Calendar sync', tooltip: (on: boolean) => (on ? 'Stop syncing with Google Calendar' : 'Sync study blocks to Google Calendar') },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const toggle = canvas.getByRole('switch');
    await userEvent.hover(toggle);
    await expect(canvas.getByRole('tooltip')).toHaveTextContent('Sync study blocks to Google Calendar');
    await userEvent.click(toggle);
    await expect(canvas.getByRole('tooltip')).toHaveTextContent('Stop syncing with Google Calendar');
  },
};

/** Stays focusable so the tooltip can say why it's locked; clicks do nothing. */
export const Disabled: Story = {
  args: { label: 'Share notes with room', disabled: true, tooltip: 'Only the room owner can change this' },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const toggle = canvas.getByRole('switch');
    await userEvent.hover(toggle);
    await expect(canvas.getByRole('tooltip')).toHaveTextContent('Only the room owner can change this');
    await userEvent.click(toggle);
    await expect(toggle).not.toBeChecked();
    await expect(args.onChange).not.toHaveBeenCalled();
  },
};

/** No visible label: `aria-label` names it, the tooltip describes it. */
export const IconOnly: Story = {
  args: { label: undefined, 'aria-label': 'Focus mode', tooltip: 'Focus mode hides chat during study sessions' },
};

export const BelowTooltip: Story = {
  args: { tooltipPlacement: 'bottom' },
  decorators: [(Story) => <div style={{ paddingBottom: 56, marginTop: -56 }}><Story /></div>],
};

/** Parent owns the state, e.g. to save it to the server. */
export const Controlled: Story = {
  render: function Render(args) {
    const [on, setOn] = useState(false);
    return (
      <div className="flex flex-col gap-3">
        <Toggle {...args} checked={on} onChange={(next) => { setOn(next); args.onChange?.(next); }} />
        <p className="text-xs text-gray-500">Reminders are {on ? 'on' : 'off'}.</p>
      </div>
    );
  },
};
