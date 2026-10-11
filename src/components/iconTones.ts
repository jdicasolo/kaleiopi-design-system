export type IconTone = 'brand' | 'navy' | 'teal' | 'gold' | 'pink' | 'inherit';

/** Palette pairings shared by the role icons. Outlines sit at a step that keeps
 * 3:1 contrast on white (purple and navy use their anchors; teal, gold, and pink
 * step darker); tints use the family's 200. `inherit` has no entry: the icon
 * draws in the current text color, for dark or colored backgrounds. */
export const ICON_TONES: Record<Exclude<IconTone, 'inherit'>, { outline: string; tint: string }> = {
  brand: { outline: 'text-kaleiopi-purple-600', tint: 'fill-kaleiopi-purple-200' },
  navy: { outline: 'text-kaleiopi-navy', tint: 'fill-kaleiopi-navy-200' },
  teal: { outline: 'text-kaleiopi-teal-800', tint: 'fill-kaleiopi-teal-200' },
  gold: { outline: 'text-kaleiopi-gold-700', tint: 'fill-kaleiopi-gold-200' },
  pink: { outline: 'text-kaleiopi-pink-600', tint: 'fill-kaleiopi-pink-200' },
};
