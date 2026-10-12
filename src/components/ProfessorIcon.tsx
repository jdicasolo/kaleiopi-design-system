import { GraduationCap } from 'lucide-react';
import { renderRoleIcon, type RoleIconProps } from './RoleIcon';

export type ProfessorIconProps = RoleIconProps;

/** Mortarboard marking professors and instructors. */
export function ProfessorIcon(props: ProfessorIconProps) {
  return renderRoleIcon(GraduationCap, 'brand', props);
}
