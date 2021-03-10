export enum TemperatureUnit {
  Celsius = 'C',
  Fahrenheit = 'F',
  Kelvin = 'K',
}

/**
 * Temperature volume quantity.
 */
export class Temperature {
  /**
   * Convenience constructor.
   * @param value value as °C
   */
  static celsius(value: number): Temperature {
    return new this(TemperatureUnit.Celsius, value);
  }

  /**
   * Convenience constructor.
   */
  static boiling(): Temperature {
    return this.celsius(100);
  }

  private readonly value: number;

  /**
   * @param unit the unit.
   * @param value the value.
   */
  constructor(unit: TemperatureUnit, value: number) {
    switch (unit) {
      case TemperatureUnit.Fahrenheit:
        this.value = (value - 32) / 1.8;
        break;
      case TemperatureUnit.Kelvin:
        this.value = value - 273.15;
        break;
      default:
        this.value = value;
    }
  }

  /**
   * Convenience method.
   * @return °C
   */
  C(): number {
    return this.value;
  }

  convert(unit: TemperatureUnit): number {
    switch (unit) {
      case TemperatureUnit.Fahrenheit:
        return this.value * 1.8 + 32;
      case TemperatureUnit.Kelvin:
        return this.value + 273.15;
      default:
        return this.value;
    }
  }

  toJSON(): number {
    return this.value;
  }
}
