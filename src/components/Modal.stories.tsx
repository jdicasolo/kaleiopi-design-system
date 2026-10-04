import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Button } from './Button';
import { Field } from './Field';
import { Input } from './Input';
import { Modal } from './Modal';

const meta = {
  title: 'Components/Modal',
  component: Modal,
  args: {
    open: true,
    onClose: fn(),
    icon: '💡',
    title: 'Block out your study time',
    children: 'Drag across the calendar to mark when you are free. Matches only suggest sessions inside those blocks.',
  },
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] } },
  parameters: { layout: 'fullscreen', docs: { story: { inline: false, iframeHeight: 420 } } },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The app's one-button tip dialog. */
export const Tip: Story = {
  render: (args) => <Modal {...args} footer={<Button onClick={args.onClose}>Got it</Button>} />,
};

export const Form: Story = {
  args: { size: 'md', icon: undefined, title: 'Create a study group', children: undefined, dismissOnBackdrop: false },
  render: (args) => (
    <Modal
      {...args}
      footer={
        <>
          <Button variant="secondary" onClick={args.onClose}>Cancel</Button>
          <Button>Create group</Button>
        </>
      }
    >
      <div className="flex flex-col gap-4 pt-2">
        <Field label="Group name" required>
          <Input placeholder="CS 221 Study Crew" />
        </Field>
        <Field label="Course" hint="Only classmates in this course can join.">
          <Input defaultValue="CS 221 · Data Structures" />
        </Field>
      </div>
    </Modal>
  ),
};

/** Click the button to open; Escape or the backdrop closes it. */
export const Interactive: Story = {
  args: { open: false },
  parameters: { layout: 'centered' },
  render: function Render(args) {
    const [open, setOpen] = useState(false);
    const close = () => {
      setOpen(false);
      args.onClose();
    };
    return (
      <>
        <Button onClick={() => setOpen(true)}>Show tip</Button>
        <Modal {...args} open={open} onClose={close} footer={<Button onClick={close}>Got it</Button>} />
      </>
    );
  },
};
