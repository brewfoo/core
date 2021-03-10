import { WaterTreatment } from './abstract';
import { Mass, MassUnit } from '../../quantity/mass';
import { WaterProfile } from '../profile';
import { Volume } from '../../quantity/volume';
import { Calcium, Bicarbonate, CalciumCarbonate } from '../ions';
import { Salt } from '../salt';
import { CarbonateSpecies } from '../carbonate-species';
import { SaltTreatment } from './salt';

// https://en.wikipedia.org/wiki/Calcium_hydroxide
const molarMass = 74.09;

/**
 * Lime softening water treatment.
 * http://www.braukaiser.com/wiki/index.php/Alkalinity_reduction_with_slaked_lime
 *
 * TLDR;
 *
 * Carbonic acid reacts with Calcium hydroxide to form Calcium carbonate which precipitates:
 *   H₂CO₃ + Ca(OH)₂ ⟶ 2 H₂O + CaCO₃↓
 *
 * Bicarbonate reacts with Calcium Hydroxide and existing Calcium also to form Calcium carbonate
 * which precipitates:
 *   2 HCO₃ + Ca(OH)₂ + Ca ⟶ 2 H₂O + 2 CaCO₃↓
 *
 * If water is Calcium deficient bicarbonates cannot be removed, since the remaining OH group
 * reacts with Carbon dioxide to (re-)form bicarbonate:
 *   HCO₃ + Ca(OH)₂ + CO₂ ⟶ H₂O + CaCO₃↓ + HCO₃
 *
 */
export class LimeTreatment implements WaterTreatment {
  /**
   * Calculate the maximum addition (as mg/L or ppm) of calcium hydroxide required.
   * Under normal circumstances the calculated amount should allow to precipitate
   * all alkalinity assuming sufficient calcium is present in the water.
   *
   * @param profile the starting water profile.
   * @returns the concentration of calcium hydroxide as mg/L.
   */
  static maximum(profile: WaterProfile): number {
    const fractions = new CarbonateSpecies(profile.pH);

    // Bicarbonates & carbonic acid (mmol/L)
    const HCO3 = profile.bicarbonate / Bicarbonate.mm;
    const H2CO3 = (HCO3 / fractions.bicarbonate) * fractions.carbonicAcid;

    // Calcium hydroxide required to to precipitate all
    // bicarbonate and carbonic acid (mmol/L)
    const CaOH2 = HCO3 / 2 + H2CO3;

    // Calcium required/available (mmol/L)
    const CaR = HCO3 / 2;
    const CaA = profile.calcium / Calcium.mm;

    if (CaA < CaR) {
      return (CaOH2 / CaR) * CaA * molarMass;
    }
    return CaOH2 * molarMass;
  }

  constructor(private readonly mass: Mass) {}

  transform(profile: WaterProfile, volume: Volume): void {
    // Molar fractions of carbonate species a given pH
    const fractions = new CarbonateSpecies(profile.pH);

    // Calcium hydroxide addition (mmol/L)
    const CaOH2 = this.mass.mg() / molarMass / volume.L();

    // Bicarbonates in solution (mmol/L)
    const HCO3 = profile.bicarbonate / Bicarbonate.mm;

    // Carbonic acid in solution (mmol/L)
    const H2CO3 = (HCO3 / fractions.bicarbonate) * fractions.carbonicAcid;

    // Calculate excess calcium hydroxide (mmol/L)
    const xCaOH2 = CaOH2 - (HCO3 / 2 + H2CO3);

    // Bicarbonates that can actually be precipitated (mmol/L)
    let delta = HCO3;
    if (xCaOH2 < 0) {
      const H = HCO3 / (HCO3 + 2 * H2CO3); // fraction of H ions from bicarbonates
      delta = 2 * CaOH2 * H;
    }

    // Calcium required/available (mmol/L); cap bicarbonates when calcium is insuffient
    const CaR = delta / 2;
    const CaA = profile.calcium / Calcium.mm;
    if (CaA < CaR) {
      delta = 2 * CaA;
    }

    // Apply adjustments
    profile.calcium -= (delta / 2) * Calcium.mm;
    profile.bicarbonate -= delta * Bicarbonate.mm;
    profile.alkalinity -= delta * (CalciumCarbonate.mm / 2);

    // Calculate impact of excess, if any.
    if (xCaOH2 > 0) {
      new SaltTreatment(
        Salt.CalciumHydroxide,
        new Mass(MassUnit.Milligram, xCaOH2 * molarMass),
      ).transform(profile, Volume.liter(1));
    }
  }
}
