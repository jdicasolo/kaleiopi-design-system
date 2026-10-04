import { forwardRef, type InputHTMLAttributes, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { cx } from '../utils/cx';

type ControlSize = 'sm' | 'md';

interface ControlProps {
  /** Red border + aria-invalid. Set automatically when wrapped in a Field with an error. */
  invalid?: boolean;
  controlSize?: ControlSize;
}

export const controlClasses = (invalid?: boolean, size: ControlSize = 'md') =>
  cx(
    'w-full border rounded-lg text-sm text-gray-900 bg-white placeholder:text-gray-400',
    'focus:outline-none focus:ring-2 disabled:bg-gray-50 disabled:text-gray-500',
    size === 'sm' ? 'px-2 py-1.5' : 'px-3 py-2',
    invalid ? 'border-red-400 focus:ring-red-300' : 'border-gray-300 focus:ring-kaleiopi-purple-400',
  );

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>, ControlProps {}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input({ invalid, controlSize, className, ...props }, ref) {
  return <input ref={ref} aria-invalid={invalid || undefined} className={cx(controlClasses(invalid, controlSize), className)} {...props} />;
});

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement>, ControlProps {}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea({ invalid, controlSize, className, rows = 4, ...props }, ref) {
  return <textarea ref={ref} rows={rows} aria-invalid={invalid || undefined} className={cx(controlClasses(invalid, controlSize), 'resize-y', className)} {...props} />;
});

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'>, ControlProps {}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select({ invalid, controlSize, className, children, ...props }, ref) {
  return (
    <select ref={ref} aria-invalid={invalid || undefined} className={cx(controlClasses(invalid, controlSize), 'cursor-pointer', className)} {...props}>
      {children}
    </select>
  );
});
