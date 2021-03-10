import { Acid, AcidSolution } from '../acid';
import { CalciumCarbonate, Bicarbonate, Ion } from '../ions';
import { WaterProfile } from '../profile';
import { WaterTreatment } from './abstract';
import { Mass } from '../../quantity/mass';
import { Volume } from '../../quantity/volume';
import { AcidBlend } from '../acid-blend';

/**
 * Acid water treatment.
 */
export class AcidTreatment implements WaterTreatment {
  constructor(
    private readonly acid: Acid | AcidBlend,
    private readonly quantity: AcidSolution | Mass,
  ) {}

  transform(profile: WaterProfile, volume: Volume): void {
    if (this.acid instanceof Acid) {
      const weight =
        this.quantity instanceof Mass
          ? this.quantity
          : this.acid.mass(this.quantity as AcidSolution);
      this.treat(profile, this.acid, weight, volume);
    }

    if (this.acid instanceof AcidBlend) {
      const components = this.acid.components;
      components.forEach((component) => {
        const weight =
          this.quantity instanceof Mass
            ? this.quantity
            : component.acid.mass({
                volume: Volume.liter(this.quantity.volume.L() / components.length),
                concentration: component.concentration,
              });
        this.treat(profile, component.acid, weight, volume);
      });
    }
  }

  private treat(profile: WaterProfile, acid: Acid, weight: Mass, volume: Volume): void {
    const delta = acid.normality(weight, volume) * 1000;

    profile.alkalinity -= delta * CalciumCarbonate.eW;
    profile.bicarbonate -= delta * Bicarbonate.eW;
    if (profile.bicarbonate < 0) {
      profile.bicarbonate = 0;
    }

    acid.contributions.forEach((ion: Ion) => {
      if (ion.name != null) {
        profile[ion.name] += delta * ion.eW;
      }
    });
  }
}
