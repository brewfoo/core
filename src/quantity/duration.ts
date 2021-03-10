export enum DurationUnit {
  Second = 's',
  Minute = 'm',
  Hour = 'h',
  Day = 'd',
}
// --------------------------------------------------------------------

/**
 * Duration quantity.
 */
export class Duration {
  /**
   * Convenience constructor.
   * @param value value as minutes.
   */
  static minutes(value: number): Duration {
    return new this(DurationUnit.Minute, value);
  }

  /**
   * Convenience constructor.
   */
  static none(): Duration {
    return new this(DurationUnit.Second, 0);
  }

  private readonly value: number;

  /**
   * @param unit the duration unit.
   * @param value the duration value.
   */
  constructor(unit: DurationUnit, value: number) {
    value = value > 0 ? value : 0.0;
    switch (unit) {
      case DurationUnit.Day:
        this.value = value * 86400;
        break;
      case DurationUnit.Hour:
        this.value = value * 3600;
        break;
      case DurationUnit.Minute:
        this.value = value * 60;
        break;
      default:
        this.value = value;
    }
  }

  seconds(): number {
    return this.value;
  }

  minutes(): number {
    return this.value / 60;
  }

  hours(): number {
    return this.value / 3600;
  }

  convert(unit: DurationUnit): number {
    switch (unit) {
      case DurationUnit.Minute:
        return this.minutes();
      case DurationUnit.Hour:
        return this.hours();
      case DurationUnit.Day:
        return this.value / 86400;
      default:
        return this.value;
    }
  }

  toJSON(): number {
    return this.value;
  }
}
