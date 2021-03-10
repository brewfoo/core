export enum VolumeUnit {
  Liter = 'L',
  Milliliter = 'ml',
  USGallon = 'gal',
  USQuart = 'qt',
  USOunce = 'oz',
}

const LTG = 0.264172051;

/**
 * Volume quantity.
 */
export class Volume {
  /**
   * Convenience constructor.
   * @param value value as L
   */
  static liter(value: number): Volume {
    return new this(VolumeUnit.Liter, value);
  }

  private readonly value: number;

  /**
   * @param unit the unit.
   * @param value the value.
   */
  constructor(unit: VolumeUnit, value: number) {
    value = value > 0 ? value : 0;
    switch (unit) {
      case VolumeUnit.Milliliter:
        this.value = value / 1000;
        break;
      case VolumeUnit.USGallon:
        this.value = value / LTG;
        break;
      case VolumeUnit.USQuart:
        this.value = value / LTG / 4;
        break;
      case VolumeUnit.USOunce:
        this.value = value / LTG / 128;
        break;
      default:
        this.value = value;
    }
  }

  /**
   * Adds other to this and returns new value.
   */
  plus(other: Volume): Volume {
    return Volume.liter(this.L() + other.L());
  }

  /**
   * Subtracts other from this and returns new value.
   */
  minus(other: Volume): Volume {
    return Volume.liter(this.L() - other.L());
  }

  /**
   * Convenience method.
   * @return liters.
   */
  L(): number {
    return this.value;
  }

  convert(unit: VolumeUnit): number {
    switch (unit) {
      case VolumeUnit.Milliliter:
        return this.value * 1000;
      case VolumeUnit.USGallon:
        return this.value * LTG;
      case VolumeUnit.USQuart:
        return this.value * LTG * 4;
      case VolumeUnit.USOunce:
        return this.value * LTG * 128;
      default:
        return this.value;
    }
  }

  toJSON(): number {
    return this.value;
  }
}
