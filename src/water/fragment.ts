import { CalciumCarbonate, Calcium, Bicarbonate, Magnesium } from './ions';
import { CarbonateSpecies } from './carbonate-species';
import { populate, roundN } from '../util';

// Carbonate species at pH 4.4
const pH44 = new CarbonateSpecies(4.4);

/**
 * Water profile fragment attempts to calculate missing profile values.
 */
export class WaterFragment {
  /**
   * Ca²⁺ concentration (ppm)
   */
  readonly calcium?: number;

  /**
   * Mg²⁺ concentration (ppm)
   */
  readonly magnesium?: number;

  /**
   * Na⁺ concentration (ppm)
   */
  readonly sodium?: number;

  /**
   * Cl⁻ concentration (ppm)
   */
  readonly chloride?: number;

  /**
   * SO₄²⁻ concentration (ppm)
   */
  readonly sulphate?: number;

  /**
   * CaCO₃ (total) hardness (ppm)
   */
  readonly hardness?: number;

  /**
   * CaCO₃ alkalinity (ppm)
   */
  readonly alkalinity?: number;

  /**
   * HCO₃⁻ bicarbonate concentration (ppm)
   */
  readonly bicarbonate?: number;

  /**
   * Hydrogen ion concentration (pH)
   */
  readonly pH?: number;

  constructor(attrs?: Partial<WaterFragment>) {
    populate<WaterFragment>(this, attrs);

    // Hardness components
    if (this.hardness == null && this.calcium != null && this.magnesium != null) {
      const num = CalciumCarbonate.mm * (this.calcium / Calcium.mm + this.magnesium / Magnesium.mm);
      this.hardness = roundN(num);
    }
    if (this.calcium == null && this.hardness != null && this.magnesium != null) {
      const num =
        Calcium.mm * (this.hardness / CalciumCarbonate.mm - this.magnesium / Magnesium.mm);
      this.calcium = roundN(num);
    }
    if (this.magnesium == null && this.hardness != null && this.calcium != null) {
      const num = Magnesium.mm * (this.hardness / CalciumCarbonate.mm - this.calcium / Calcium.mm);
      this.magnesium = roundN(num);
    }

    // Estimate pH if alkalinity and bicarbonate are present.
    if (this.pH == null && this.alkalinity != null && this.bicarbonate != null) {
      this.pH = this.estimatePH(this.alkalinity, this.bicarbonate);
    }

    // Estimate alkalinity if bicarbonate concentration is known.
    if (this.alkalinity == null && this.bicarbonate != null) {
      this.alkalinity = roundN(this.estimateAlkalinity(this.pH ?? 8.0, this.bicarbonate));
    }

    // Estimate bicarbonate concentration if alkalinity is known.
    if (this.bicarbonate == null && this.alkalinity != null) {
      this.bicarbonate = roundN(this.estimateBicarbonate(this.pH ?? 8.0, this.alkalinity));
    }
  }

  private estimatePH(alkalinity: number, bicarbonate: number): number {
    let pH = 7.0;
    let minDelta = Math.abs(this.estimateBicarbonate(pH, alkalinity) - bicarbonate);

    for (let x = 6.8; x > 4; x -= 0.2) {
      const delta = Math.abs(this.estimateBicarbonate(x, alkalinity) - bicarbonate);
      if (delta > minDelta) {
        break;
      }
      minDelta = delta;
      pH = x;
    }
    for (let x = 7.2; x < 14; x += 0.2) {
      const delta = Math.abs(this.estimateBicarbonate(x, alkalinity) - bicarbonate);
      if (delta > minDelta) {
        break;
      }
      minDelta = delta;
      pH = x;
    }

    return roundN(pH, 1);
  }

  private estimateAlkalinity(pH: number, bicarbonate: number): number {
    const { fractions, proportion, adjustment } = this.factors(pH);

    const bc = bicarbonate / Bicarbonate.eW; // bicarbonate concentration in mEq/L
    const ac = bc * proportion + adjustment; // alkalinity concentration in mEq/L
    return (ac / fractions.bicarbonate) * CalciumCarbonate.eW;
  }

  private estimateBicarbonate(pH: number, alkalinity: number): number {
    const { fractions, proportion, adjustment } = this.factors(pH);

    const ac = alkalinity / CalciumCarbonate.eW; // alkalinity concentration in mEq/L
    const bc = (ac - adjustment) / proportion; // bicarbonate concentration in mEq/L
    return bc * fractions.bicarbonate * Bicarbonate.eW;
  }

  // https://www.homebrewtalk.com/forum/threads/calculating-bicarbonate-and-carbonate.473408/
  private factors(
    pH: number,
  ): { fractions: CarbonateSpecies; proportion: number; adjustment: number } {
    const x1 = Math.pow(10, -4.4) - Math.pow(10, -pH);
    const x2 = Math.pow(10, pH - 14) - Math.pow(10, -4.4 - 14);
    const adjustment = 1000 * x1 - 1000 * x2;
    const fractions = new CarbonateSpecies(pH);
    const proportion =
      pH44.carbonicAcid - fractions.carbonicAcid + fractions.carbonate - pH44.carbonate;

    return { fractions, proportion, adjustment };
  }
}
