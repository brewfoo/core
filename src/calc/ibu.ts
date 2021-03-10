import { Mass } from '../quantity/mass';
import { Volume } from '../quantity/volume';
import { Percent } from '../quantity/other';

export enum IBUFormula {
  Tinseth = 'tinseth',
  Rager = 'rager',
}

interface Params {
  mass: Mass;
  alpha: Percent;
  batchVolume: Volume;
  utilization: Percent;
}

/**
 * IBU calculation. Example:
 *
 * ```typescript
 * const calc = new IBUCalc({
 *   mass: new Mass(MassUnit.USOunce, 2),
 *   alpha: 10.0,
 *   batchVolume: new Volume(VolumeUnit.USGallon, 5),
 *   utilization: 10,
 * })
 * ```
 */
export class IBUCalc {
  /**
   * Calculated mass of alpha acids.
   */
  readonly alphaMass: Mass;

  /**
   * Calculated IBU
   */
  readonly IBU: number;

  /**
   * @param o calculation parameters
   */
  constructor(o: Params) {
    this.alphaMass = Mass.kg(o.mass.kg() * o.alpha * 0.01);
    this.IBU = (this.alphaMass.g() * 10 * o.utilization) / o.batchVolume.L();
  }
}
