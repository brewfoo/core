import { Volume, VolumeUnit } from './volume';
import { Mass, MassUnit } from './mass';
import { Temperature } from './temperature';

const oneKg = Mass.kg(1);
const oneLiter = Volume.liter(1);

/**
 * Density quantity.
 */
export class Density {
  /**
   * Convenience constructor.
   * @param value value in kg/L
   */
  static kgPerLiter(value: number): Density {
    return new this(MassUnit.Kilogram, VolumeUnit.Liter, value);
  }

  /**
   * Calculate water density.
   *
   * @param t the temperature.
   * @returns the density of water at the given temperature.
   */
  static water(t: Temperature): Density {
    const c = t.C();
    return this.kgPerLiter(1.0 - 0.00001 * c - 0.0000041 * c * c);
  }

  private readonly value: number;

  /**
   * @param mUnit the mass unit.
   * @param vUnit the volume unit.
   * @param value the value.
   */
  constructor(mUnit: MassUnit, vUnit: VolumeUnit, value: number) {
    const m = new Mass(mUnit, 1).kg();
    const v = new Volume(vUnit, 1).L();
    this.value = value * (m / v);
  }

  kgPerLiter(): number {
    return this.value;
  }

  convert(mUnit: MassUnit, vUnit: VolumeUnit): number {
    const m = oneKg.convert(mUnit);
    const v = oneLiter.convert(vUnit);
    return this.value * (m / v);
  }

  toJSON(): number {
    return this.value;
  }
}
