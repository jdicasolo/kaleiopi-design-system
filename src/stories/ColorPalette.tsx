import palette from '../tokens/palette.json';

type Swatch = { step: number; hex: string; onWhite: number };

const rating = (ratio: number) => (ratio >= 4.5 ? 'AA' : ratio >= 3 ? 'AA large' : '—');
const luminance = (hex: string) =>
  [1, 3, 5]
    .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4))
    .reduce((sum, c, i) => sum + c * [0.2126, 0.7152, 0.0722][i], 0);
const ratio = (a: string, b: string) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};
/** Navy or white, whichever reads better on the swatch. */
const textOn = (hex: string) => (ratio(hex, '#02154C') >= ratio(hex, '#FFFFFF') ? '#02154C' : '#FFFFFF');

/** Renders every generated brand scale with its WCAG contrast against white. */
export function ColorPalette() {
  return (
    <div style={{ display: 'grid', gap: 28 }}>
      {Object.entries(palette).map(([name, c]) => (
        <section key={name}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap', marginBottom: 8 }}>
            <strong style={{ textTransform: 'capitalize', fontSize: 16 }}>{name}</strong>
            <code>{c.hex}</code>
            <span style={{ color: '#6B7280', fontSize: 13 }}>{c.role}</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(84px, 1fr))', gap: 6 }}>
            {(c.scale as Swatch[]).map((s) => (
              <div key={s.step} style={{ borderRadius: 10, overflow: 'hidden', border: '1px solid #E5E7EB', background: '#fff' }}>
                <div style={{ background: s.hex, color: textOn(s.hex), height: 56, padding: 6, fontSize: 12, fontWeight: 700, outline: s.step === c.anchor ? '3px solid #02154C' : undefined, outlineOffset: -3 }}>
                  {s.step === c.anchor ? 'brand' : ''}
                </div>
                <div style={{ padding: '6px 8px', fontSize: 11, lineHeight: 1.4 }}>
                  <div style={{ fontWeight: 600 }}>{s.step}</div>
                  <div style={{ fontFamily: 'monospace' }}>{s.hex}</div>
                  <div style={{ color: s.onWhite >= 3 ? '#065F46' : '#6B7280' }}>
                    {s.onWhite}:1 {rating(s.onWhite)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
