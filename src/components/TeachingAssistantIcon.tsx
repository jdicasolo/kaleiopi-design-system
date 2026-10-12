import { ClipboardList } from 'lucide-react';
import { renderRoleIcon, type RoleIconProps } from './RoleIcon';

export type TeachingAssistantIconProps = RoleIconProps;

/** Checklist clipboard marking teaching assistants. */
export function TeachingAssistantIcon(props: TeachingAssistantIconProps) {
  return renderRoleIcon(ClipboardList, 'teal', props);
}
