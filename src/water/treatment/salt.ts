import { CalciumCarbonate, Bicarbonate } from '../ions';
import { WaterProfile } from '../profile';
import { Salt, SaltContribution } from '../salt';
import { WaterTreatment } from './abstract';
import { Mass } from '../../quantity/mass';
import { Volume } from '../../quantity/volume';

/**
 * Salt water treatment.
 */
export class SaltTreatment implements WaterTreatment {
  constructor(private readonly salt: Salt, private readonly mass: Mass) {}

  transform(profile: WaterProfile, volume: Volume): void {
    const delta = this.mass.g() / volume.L();
    this.salt.contributions.forEach((c: SaltContribution) => {
      if (c.ion.name != null) {
        profile[c.ion.name] += c.ppm * delta;
      }
    });

    profile.bicarbonate += this.salt.bicarbonate * delta;
    profile.alkalinity += (this.salt.bicarbonate / Bicarbonate.eW) * CalciumCarbonate.eW * delta;
  }
}
