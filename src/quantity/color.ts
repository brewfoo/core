export enum ColorUnit {
  EBC = 'ebc',
  SRM = 'srm',
  Lovibond = 'lovibond',
}

export interface ColorGroup {
  ebc: number;
  name: string;
  css: string;
}

const sortedGroups: ColorGroup[] = [
  { ebc: 4, name: 'Pale Straw', css: '#ffe682' },
  { ebc: 6, name: 'Straw', css: '#ffc525' },
  { ebc: 8, name: 'Pale Gold', css: '#f2aa20' },
  { ebc: 12, name: 'Deep Gold', css: '#df9027' },
  { ebc: 18, name: 'Pale Amber', css: '#d2742a' },
  { ebc: 24, name: 'Medium Amber', css: '#bb5a2f' },
  { ebc: 30, name: 'Deep Amber', css: '#a04121' },
  { ebc: 36, name: 'Amber Brown', css: '#812613' },
  { ebc: 40, name: 'Brown', css: '#6b0e07' },
  { ebc: 48, name: 'Ruby Brown', css: '#530103' },
  { ebc: 60, name: 'Deep Brown', css: '#400000' },
  { ebc: 80, name: 'Black', css: '#2e0000' },
  { ebc: 100, name: 'Deep Black', css: '#000000' },
];

// --------------------------------------------------------------------

/**
 * Color quantity.
 */
export class Color {
  private readonly value: number;

  /**
   * @param unit the color unit.
   * @param value the color value.
   */
  constructor(unit: ColorUnit, value: number) {
    value = value > 0 ? value : 0.0;
    switch (unit) {
      case ColorUnit.SRM:
        this.value = value / 0.508;
        break;
      case ColorUnit.Lovibond:
        this.value = (value * 1.3546 - 0.76) / 0.508;
        break;
      default:
        this.value = value;
    }
  }

  EBC(): number {
    return this.value;
  }

  convert(unit: ColorUnit): number {
    switch (unit) {
      case ColorUnit.SRM:
        return this.value * 0.508;
      case ColorUnit.Lovibond:
        return (this.value * 0.508 + 0.76) / 1.3546;
      default:
        return this.value;
    }
  }

  group(): ColorGroup {
    const ebc = this.EBC();
    const pos = sortedGroups.findIndex((ent) => ent.ebc >= ebc);
    if (pos === 0) {
      return sortedGroups[0];
    } else if (pos === -1) {
      return sortedGroups[sortedGroups.length - 1];
    }

    const lower = sortedGroups[pos - 1];
    const upper = sortedGroups[pos];
    if (Math.abs(lower.ebc - ebc) < Math.abs(upper.ebc - ebc)) {
      return lower;
    } else {
      return upper;
    }
  }

  toJSON(): number {
    return this.value;
  }
}
