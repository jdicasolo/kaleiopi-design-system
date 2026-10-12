import type { LucideIcon, LucideProps } from 'lucide-react';
import { cx } from '../utils/cx';
import { ICON_TONES, type IconTone } from './iconTones';

export interface RoleIconProps extends Omit<LucideProps, 'ref' | 'children' | 'color'> {
  /** Width and height in px. */
  size?: number;
  /** Palette color; see `ICON_TONES`. */
  tone?: IconTone;
  /** Accessible name. Leave unset when the icon sits next to text that already names the role. */
  title?: string;
}

/** Shared body of `ProfessorIcon`, `TeachingAssistantIcon` and `StudentIcon`:
 * a lucide icon in a palette tone, decorative unless given a title. */
export function renderRoleIcon(Icon: LucideIcon, defaultTone: IconTone, { size = 24, tone = defaultTone, title, className, ...props }: RoleIconProps) {
  return (
    <Icon size={size} role={title ? 'img' : undefined} className={cx('flex-shrink-0', tone !== 'inherit' && ICON_TONES[tone], className)} {...props}>
      {title && <title>{title}</title>}
    </Icon>
  );
}
