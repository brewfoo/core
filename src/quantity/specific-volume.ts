import { Volume, VolumeUnit } from './volume';
import { Mass, MassUnit } from './mass';

const oneKg = Mass.kg(1);
const oneLiter = Volume.liter(1);

/**
 * Specific volume quantity.
 */
export class SpecificVolume {
  /**
   * Convenience constructor.
   * @param value value as L/kg.
   */
  static literPerKg(value: number): SpecificVolume {
    return new this(VolumeUnit.Liter, MassUnit.Kilogram, value);
  }

  private readonly value: number;

  /**
   * @param vUnit the volume unit.
   * @param mUnit the mass unit.
   * @param value the value.
   */
  constructor(vUnit: VolumeUnit, mUnit: MassUnit, value: number) {
    const v = new Volume(vUnit, 1).L();
    const m = new Mass(mUnit, 1).kg();
    this.value = value * (v / m);
  }

  /**
   * @returns Liters per kg
   */
  literPerKg(): number {
    return this.value;
  }

  convert(vUnit: VolumeUnit, mUnit: MassUnit): number {
    const v = oneLiter.convert(vUnit);
    const m = oneKg.convert(mUnit);
    return this.value * (v / m);
  }

  toJSON(): number {
    return this.value;
  }
}
