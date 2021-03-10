export enum DiastaticPowerUnit {
  Lintner = 'lintner',
  WindischKolbach = 'wk',
}

/**
 * Diastatic Power quantity.
 */
export class DiastaticPower {
  static lintner(value: number): DiastaticPower {
    return new this(DiastaticPowerUnit.Lintner, value);
  }

  private readonly value: number;

  /**
   * @param unit the unit.
   * @param value the value.
   */
  constructor(unit: DiastaticPowerUnit, value: number) {
    value = value > 0 ? value : 0.0;
    switch (unit) {
      case DiastaticPowerUnit.WindischKolbach:
        this.value = (value + 16) / 3.5;
        break;
      default:
        this.value = value;
    }
  }

  /**
   * Lintner units
   */
  lintner(): number {
    return this.value;
  }

  /**
   * Adds other to this and returns new value.
   */
  plus(other: DiastaticPower): DiastaticPower {
    return DiastaticPower.lintner(this.lintner() + other.lintner());
  }

  /**
   * Subtracts other from this and returns new value.
   */
  minus(other: DiastaticPower): DiastaticPower {
    return DiastaticPower.lintner(this.lintner() - other.lintner());
  }

  convert(unit: DiastaticPowerUnit): number {
    switch (unit) {
      case DiastaticPowerUnit.WindischKolbach:
        return this.value * 3.5 - 16;
      default:
        return this.value;
    }
  }

  toJSON(): number {
    return this.value;
  }
}
