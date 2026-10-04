import { cx } from '../utils/cx';

export type AvatarSize = 'sm' | 'md' | 'lg';

export interface AvatarProps {
  name: string;
  /** Photo URL. Falls back to the first initial when absent. */
  src?: string;
  size?: AvatarSize;
  /** White ring, for overlapping avatars in a stack. */
  ringed?: boolean;
  className?: string;
}

const SIZES: Record<AvatarSize, string> = { sm: 'w-7 h-7 text-xs', md: 'w-8 h-8 text-xs', lg: 'w-12 h-12 text-base' };

export const initials = (name: string) => name.trim()[0]?.toUpperCase() ?? '?';

export function Avatar({ name, src, size = 'md', ringed = false, className }: AvatarProps) {
  const classes = cx('rounded-full flex-shrink-0', SIZES[size], ringed && 'ring-2 ring-white', className);
  if (src) return <img src={src} alt={name} className={cx(classes, 'object-cover')} />;
  return (
    <span role="img" aria-label={name} className={cx(classes, 'bg-kaleiopi-purple-100 text-kaleiopi-purple-700 font-bold flex items-center justify-center')}>
      <span aria-hidden="true">{initials(name)}</span>
    </span>
  );
}

export interface AvatarStackProps {
  people: Array<{ name: string; src?: string }>;
  /** How many avatars to show before collapsing the rest into "+N". */
  max?: number;
  size?: AvatarSize;
  className?: string;
}

/** Overlapping avatars with a "+N" overflow chip, as used for study-group members. */
export function AvatarStack({ people, max = 3, size = 'md', className }: AvatarStackProps) {
  const visible = people.slice(0, max);
  const overflow = people.length - visible.length;
  return (
    <div className={cx('flex items-center', className)} role="group" aria-label={`${people.length} member${people.length === 1 ? '' : 's'}`}>
      {visible.map((p, i) => (
        <Avatar key={`${p.name}-${i}`} {...p} size={size} ringed className={i > 0 ? '-ml-2' : undefined} />
      ))}
      {overflow > 0 && (
        <span className={cx('-ml-2 rounded-full bg-gray-100 text-gray-600 font-bold flex items-center justify-center ring-2 ring-white flex-shrink-0', SIZES[size])}>
          +{overflow}
        </span>
      )}
    </div>
  );
}
