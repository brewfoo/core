import { Gravity, GravityUnit } from '../quantity/gravity';
import { Percent } from '../quantity/other';

/**
 * Final gravity calculation. Example:
 *
 * ```typescript
 * const calc = new FinalGravityCalc(new Gravity(GravityUnit.SG, 1.05), 78)
 * ```
 */
export class FinalGravityCalc {
  /**
   * Real(istic) yeast attenuation
   */
  readonly RA: Percent;

  /**
   * Final gravity
   */
  readonly FG: Gravity;

  /**
   * @param OG the original gravity
   * @param AA the apparent yeast attenuation in %
   */
  constructor(readonly OG: Gravity, readonly AA: Percent) {
    this.RA = AA * 0.8192;

    const pi = OG.plato();
    const pf = ((1 - this.RA / 100 - 0.1808) * pi) / 0.8192;
    this.FG = new Gravity(GravityUnit.Plato, pf);
  }
}
