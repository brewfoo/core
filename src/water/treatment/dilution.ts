import { WaterProfile } from '../profile';
import { WaterTreatment } from './abstract';
import { Percent } from '../../quantity/other';

/**
 * Dilution water treatment.
 */
export class DilutionTreatment implements WaterTreatment {
  private readonly profile: WaterProfile = new WaterProfile();

  constructor(private readonly percentage: Percent, profile?: WaterProfile) {
    if (profile != null) {
      this.profile = profile;
    }
  }

  transform(profile: WaterProfile): void {
    const a = this.percentage / 100;
    const b = 1 - a;
    profile.calcium = this.profile.calcium * a + profile.calcium * b;
    profile.magnesium = this.profile.magnesium * a + profile.magnesium * b;
    profile.sodium = this.profile.sodium * a + profile.sodium * b;
    profile.chloride = this.profile.chloride * a + profile.chloride * b;
    profile.sulphate = this.profile.sulphate * a + profile.sulphate * b;
    profile.bicarbonate = this.profile.bicarbonate * a + profile.bicarbonate * b;
    profile.alkalinity = this.profile.alkalinity * a + profile.alkalinity * b;
  }
}
