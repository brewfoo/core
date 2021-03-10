export enum EnergyUnit {
  Joule = 'joule',
  KiloCalories = 'kcal',
}

/**
 * Energy quantity.
 */
export class Energy {
  private readonly value: number;

  /**
   * @param unit the unit.
   * @param value the value.
   */
  constructor(unit: EnergyUnit, value: number) {
    value = value > 0 ? value : 0.0;
    switch (unit) {
      case EnergyUnit.KiloCalories:
        this.value = value * 4184;
        break;
      default:
        this.value = value;
    }
  }

  joule(): number {
    return this.value;
  }

  kcal(): number {
    return this.convert(EnergyUnit.KiloCalories);
  }

  convert(unit: EnergyUnit): number {
    switch (unit) {
      case EnergyUnit.KiloCalories:
        return this.value / 4184;
      default:
        return this.value;
    }
  }

  toJSON(): number {
    return this.value;
  }
}
