export enum ExtractYieldUnit {
  Percent = '%',
  PPG = 'ppg',
}

/**
 * Extract yield quantity.
 */
export class ExtractYield {
  /**
   * Convenience constructor.
   *
   * @param value value in %.
   */
  static percent(value: number): ExtractYield {
    return new this(ExtractYieldUnit.Percent, value);
  }

  private readonly value: number;

  /**
   * @param unit the unit.
   * @param value the value.
   */
  constructor(unit: ExtractYieldUnit, value: number) {
    value = value > 0 ? value : 0.0;
    switch (unit) {
      case ExtractYieldUnit.PPG:
        this.value = value / 0.46;
        break;
      default:
        this.value = value;
    }
  }

  percent(): number {
    return this.value;
  }

  convert(unit: ExtractYieldUnit): number {
    switch (unit) {
      case ExtractYieldUnit.PPG:
        return this.value * 0.46;
      default:
        return this.value;
    }
  }

  toJSON(): number {
    return this.value;
  }
}
