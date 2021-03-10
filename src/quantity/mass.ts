export enum MassUnit {
  Kilogram = 'kg',
  Gram = 'g',
  Milligram = 'mg',
  USPound = 'lbs',
  USOunce = 'oz',
}

/**
 * Mass quantity.
 */
export class Mass {
  /**
   * Convenience constructor.
   * @param value value as kg.
   */
  static kg(value: number): Mass {
    return new this(MassUnit.Kilogram, value);
  }

  /**
   * Convenience constructor.
   */
  static none(): Mass {
    return Mass.kg(0);
  }

  private readonly value: number;

  /**
   * @param unit the unit.
   * @param value the value.
   */
  constructor(unit: MassUnit, value: number) {
    value = value > 0 ? value : 0.0;
    switch (unit) {
      case MassUnit.Gram:
        this.value = value / 1e3;
        break;
      case MassUnit.Milligram:
        this.value = value / 1e6;
        break;
      case MassUnit.USPound:
        this.value = value / 2.20462262;
        break;
      case MassUnit.USOunce:
        this.value = value / 2.20462262 / 16;
        break;
      default:
        this.value = value;
    }
  }

  /**
   * Adds other to this and returns new value.
   */
  plus(other: Mass): Mass {
    return Mass.kg(this.kg() + other.kg());
  }

  /**
   * Subtracts other from this and returns new value.
   */
  minus(other: Mass): Mass {
    return Mass.kg(this.kg() - other.kg());
  }

  /**
   * Convenience method.
   * @returns Kilogram.
   */
  kg(): number {
    return this.value;
  }

  /**
   * Convenience method.
   * @returns Gram.
   */
  g(): number {
    return this.convert(MassUnit.Gram);
  }

  /**
   * Convenience method.
   * @returns Milligram.
   */
  mg(): number {
    return this.convert(MassUnit.Milligram);
  }

  convert(unit: MassUnit): number {
    switch (unit) {
      case MassUnit.Gram:
        return this.value * 1e3;
      case MassUnit.Milligram:
        return this.value * 1e6;
      case MassUnit.USPound:
        return this.value * 2.20462262;
      case MassUnit.USOunce:
        return this.value * 2.20462262 * 16;
      default:
        return this.value;
    }
  }

  toJSON(): number {
    return this.value;
  }
}
