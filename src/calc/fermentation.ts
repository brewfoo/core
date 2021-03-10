import { Energy, EnergyUnit } from '../quantity/energy';
import { Gravity } from '../quantity/gravity';
import { Mass } from '../quantity/mass';
import { Percent } from '../quantity/other';

/**
 * Fermentation calculation. Example:
 *
 * ```typescript
 * const calc = new FermentationCalc(
 *   new Gravity(GravityUnit.SG, 1.05),
 *   new Gravity(GravityUnit.SG, 1.01),
 * )
 * ```
 */
export class FermentationCalc {
  /**
   * Apparent attenuation in %.
   */
  readonly AA: Percent;

  /**
   * Real attenuation in %.
   */
  readonly RA: Percent;

  /**
   * True extract is a measure of the sugars which are fermented
   * and accounts for the density lowering effects of alcohol in %.
   */
  readonly TE: Percent;

  /**
   * ABW alcohol by weight:
   * https://en.wikipedia.org/wiki/Gravity_(alcoholic_beverage)#Terms_related_to_gravity.
   */
  readonly ABW: Mass;

  /**
   * ABV alcohol by volume in %.
   */
  readonly ABV: Percent;

  /**
   * Energetic value per 100ml.
   */
  readonly energy!: Energy;

  /**
   *
   * @param OG the original gravity
   * @param FG the final gravity
   */
  constructor(readonly OG: Gravity, readonly FG: Gravity) {
    const p = this.OG.plato(); // original extract
    const m = this.FG.plato(); // apparent extract
    const q = 0.22 + 0.001 * p; // attenuation coefficient

    const te = (q * p + m) / (q + 1);
    this.TE = te < 0 ? 0.0 : te;

    this.AA = p <= 0 ? 0.0 : (1 - m / p) * 100;
    this.RA = p <= 0 ? 0.0 : (1 - this.TE / p) * 100;

    this.ABW =
      p <= 0 || te <= 0 ? Mass.kg(0.0) : Mass.kg((0.001 * (p - te)) / (2.0665 - 0.010665 * p));
    this.ABV = (this.ABW.g() * this.FG.SG()) / 0.794;

    this.energy = new Energy(
      EnergyUnit.Joule,
      this.ABW.g() * 29000 + (this.TE - 0.1) * 17000 * this.FG.SG(),
    );
  }
}
