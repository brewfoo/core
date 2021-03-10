import { Calcium, Bicarbonate, CalciumCarbonate } from '../ions';
import { WaterProfile } from '../profile';
import { WaterTreatment } from './abstract';

/**
 * Boil water treatment.
 */
export class BoilTreatment implements WaterTreatment {
  transform(profile: WaterProfile): void {
    // Calcium concentration (as mmol/L).
    const Ca = profile.calcium / Calcium.mm;

    // Calcium carbonate alkalinity (as mmol/L).
    const CaCO3 = profile.alkalinity / CalciumCarbonate.mm;

    // CaCO3 concentration can be reduced to ~0.6 mmol/L by boiling,
    // but only if tehre is sufficient calcium in solution.
    let delta = CaCO3 - 0.6;
    if (delta > Ca) {
      delta = Ca;
    }
    if (delta < 0) {
      return;
    }

    profile.calcium = profile.calcium - delta * Calcium.mm;
    profile.bicarbonate = profile.bicarbonate - 2 * delta * Bicarbonate.mm;
    profile.alkalinity = profile.alkalinity - delta * CalciumCarbonate.mm;
  }
}
