export class HSLAColor {
  constructor(
    public h: number,
    public s: number,
    public l: number,
    public a = 1,
  ) {}

  toCSSFunction(): string {
    const h = Math.round(this.h * 360);
    const s = Math.round(this.s * 100);
    const l = Math.round(this.l * 100);
    return this.a === 1 ? `hsl(${h}, ${s}%, ${l}%)` : `hsla(${h}, ${s}%, ${l}%, ${this.a})`;
  }

  static fromHSLA({ h, s, l, a }: { h: number; s: number; l: number; a: number }) {
    return new HSLAColor(h, s, l, a);
  }

  static fromRGBA = ({ r, g, b, a }: { r: number; g: number; b: number; a: number }): HSLAColor => {
    let max = Math.max(r, g, b);
    let min = Math.min(r, g, b);
    let chroma = max - min;
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;
    if (chroma !== 0) {
      s = chroma / (1 - Math.abs(2 * l - 1));
      switch (max) {
        case r:
          var segment = (g - b) / chroma;
          var shift = 0 / 60;
          if (segment < 0) {
            shift = 360 / 60;
          }
          h = segment + shift;
          break;
        case g:
          var segment = (b - r) / chroma;
          var shift = 120 / 60;
          h = segment + shift;
          break;
        case b:
          var segment = (r - g) / chroma;
          var shift = 240 / 60;
          h = segment + shift;
          break;
      }
    }
    h /= 6;
    return new HSLAColor(h, s, l, a);
  };
}
