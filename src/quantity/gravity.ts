export enum GravityUnit {
  Points = 'points',
  SG = 'sg',
  Plato = 'plato',
}

/**
 * Gravity quantity.
 */
export class Gravity {
  /**
   * Convenience constructor.
   *
   * @param n value as gravity points.
   */
  static points(n: number): Gravity {
    return new this(GravityUnit.Points, n);
  }

  /**
   * Convenience constructor.
   */
  static none(): Gravity {
    return Gravity.points(0);
  }

  private readonly value: number;

  /**
   * @param unit the unit.
   * @param value the value.
   */
  constructor(unit: GravityUnit, v: number) {
    switch (unit) {
      case GravityUnit.SG:
        this.value = v > 1.0 ? (v - 1) * 1000 : 0;
        break;
      case GravityUnit.Plato:
        this.value = v > 0 ? 0.0000001 + 3.8661 * v + 1.3488e-2 * v * v + 4.3074e-5 * v * v * v : 0;
        break;
      default:
        this.value = v > 0 ? v : 0;
    }
  }

  /**
   * Adds other to this and returns new value.
   */
  plus(other: Gravity): Gravity {
    return Gravity.points(this.points() + other.points());
  }

  /**
   * Subtracts other from this and returns new value.
   */
  minus(other: Gravity): Gravity {
    return Gravity.points(this.points() - other.points());
  }

  /**
   * Convenience method.
   * @returns Gravity points.
   */
  points(): number {
    return this.value;
  }

  /**
   * Convenience method.
   * @returns Specific Gravity.
   */
  SG(): number {
    return 1 + this.value / 1000;
  }

  /**
   * Convenience method.
   * @returns Degrees Plato.
   */
  plato(): number {
    const v = this.SG();
    return -668.962 + 1262.45 * v - 776.43 * v * v + 182.94 * v * v * v;
  }

  convert(unit: GravityUnit): number {
    switch (unit) {
      case GravityUnit.SG:
        return this.SG();
      case GravityUnit.Plato:
        return this.plato();
      default:
        return this.value;
    }
  }

  toJSON(): number {
    return this.value;
  }
}
