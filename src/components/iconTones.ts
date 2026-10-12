export type IconTone = 'brand' | 'navy' | 'teal' | 'gold' | 'pink' | 'inherit';

/** Palette colors for the role icons, each at a step that keeps 3:1 contrast on
 * white (purple and navy use their anchors; teal, gold, and pink step darker).
 * `inherit` has no entry: the icon draws in the current text color, for dark or
 * colored backgrounds. */
export const ICON_TONES: Record<Exclude<IconTone, 'inherit'>, string> = {
  brand: 'text-kaleiopi-purple-600',
  navy: 'text-kaleiopi-navy',
  teal: 'text-kaleiopi-teal-800',
  gold: 'text-kaleiopi-gold-700',
  pink: 'text-kaleiopi-pink-600',
};
