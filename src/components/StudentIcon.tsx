import { Backpack } from 'lucide-react';
import { renderRoleIcon, type RoleIconProps } from './RoleIcon';

export type StudentIconProps = RoleIconProps;

/** Backpack marking students. */
export function StudentIcon(props: StudentIconProps) {
  return renderRoleIcon(Backpack, 'gold', props);
}
