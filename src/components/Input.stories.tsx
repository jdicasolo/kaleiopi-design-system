import type { Meta, StoryObj } from '@storybook/react-vite';
import { Field } from './Field';
import { Input, Select, Textarea } from './Input';
import { PasswordInput } from './PasswordInput';

const meta = {
  title: 'Components/Form controls',
  component: Input,
  args: { placeholder: 'you@university.edu' },
  decorators: [(Story) => <div style={{ width: 340 }}><Story /></div>],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TextInput: Story = { args: { 'aria-label': 'Email' } };
export const Small: Story = { args: { 'aria-label': 'Email', controlSize: 'sm' } };
export const Invalid: Story = { args: { 'aria-label': 'Email', invalid: true, defaultValue: 'not-an-email' } };
export const Disabled: Story = { args: { 'aria-label': 'Email', disabled: true, defaultValue: 'admin@kaleiopi.app' } };

/** Field wires the label, hint and error to the control for screen readers. */
export const WithField: Story = {
  render: () => (
    <Field label="University email" hint="We use this to match you with classmates." required>
      <Input type="email" placeholder="you@university.edu" />
    </Field>
  ),
};

export const FieldWithError: Story = {
  render: () => (
    <Field label="University email" error="Use your .edu address so we can verify your school.">
      <Input type="email" defaultValue="me@gmail.com" />
    </Field>
  ),
};

/** Single input whose type flips, so autofill and password managers keep working. Re-masks when you switch tabs. */
export const Password: Story = {
  render: () => (
    <Field label="Password" hint="At least 8 characters.">
      <PasswordInput autoComplete="new-password" defaultValue="correct horse" />
    </Field>
  ),
};

export const TextareaControl: Story = {
  render: () => (
    <Field label="What do you want to cover?">
      <Textarea placeholder="Chapter 4 practice problems, then review for Friday's quiz" />
    </Field>
  ),
};

export const SelectControl: Story = {
  render: () => (
    <Field label="Course">
      <Select defaultValue="cs221">
        <option value="cs221">CS 221 · Data Structures</option>
        <option value="math230">MATH 230 · Calculus III</option>
        <option value="chem110">CHEM 110 · Chemical Principles</option>
      </Select>
    </Field>
  ),
};
