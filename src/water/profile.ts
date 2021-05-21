import { Volume } from '../quantity/volume';
import {
  CalciumCarbonate,
  Calcium,
  Chloride,
  Bicarbonate,
  Magnesium,
  Sodium,
  Sulphate,
} from './ions';
import { WaterFragment } from './fragment';
import { WaterTreatment } from './treatment/abstract';
import { roundN } from '../util';

/**
 * Water Profile.
 */
export class WaterProfile {
  /**
   * Ca²⁺ concentration (ppm)
   */
  calcium = 0;

  /**
   * Mg²⁺ concentration (ppm)
   */
  magnesium = 0;

  /**
   * Na⁺ concentration (ppm)
   */
  sodium = 0;

  /**
   * Cl⁻ concentration (ppm)
   */
  chloride = 0;

  /**
   * SO₄²⁻ concentration (ppm)
   */
  sulphate = 0;

  /**
   * HCO₃⁻ concentration (ppm)
   */
  bicarbonate = 0;

  /**
   * Total alkalinity as CaCO₃
   */
  alkalinity = 0;

  /**
   * pH defaults to 8.0
   */
  pH = 8.0;

  /**
   * @param attrs the profile fragment attributes.
   */
  constructor(attrs?: Partial<WaterFragment>) {
    if (attrs == null) {
      return;
    }

    const ft = new WaterFragment(attrs);
    this.calcium = ft.calcium ?? this.calcium;
    this.magnesium = ft.magnesium ?? this.magnesium;
    this.sodium = ft.sodium ?? this.sodium;
    this.chloride = ft.chloride ?? this.chloride;
    this.sulphate = ft.sulphate ?? this.sulphate;
    this.bicarbonate = ft.bicarbonate ?? this.bicarbonate;
    this.alkalinity = ft.alkalinity ?? this.alkalinity;
    this.pH = ft.pH ?? this.pH;
  }

  /**
   * Rounds all concentrations to the nearest integer and returns self.
   */
  round(): WaterProfile {
    this.calcium = roundN(this.calcium);
    this.magnesium = roundN(this.magnesium);
    this.sodium = roundN(this.sodium);
    this.chloride = roundN(this.chloride);
    this.sulphate = roundN(this.sulphate);
    this.bicarbonate = roundN(this.bicarbonate);
    this.alkalinity = roundN(this.alkalinity);
    return this;
  }

  /**
   * Creates a copy of the object.
   */
  clone(): WaterProfile {
    return Object.assign(new WaterProfile(), this);
  }

  /**
   * @returns Total hardness as CaCO₃ (ppm).
   */
  hardness(): number {
    const num = CalciumCarbonate.mm * (this.calcium / Calcium.mm + this.magnesium / Magnesium.mm);
    return roundN(num);
  }

  /**
   * @returns Sulphate to Chloride Ratio.
   */
  ratio(): number {
    return roundN((this.sulphate + 1e-12) / (this.chloride + 1e-12), 2);
  }

  /**
   * @returns Residual alkalinity as CaCO₃.
   */
  RA(): number {
    return roundN(this.alkalinity - this.calcium / 1.4 - this.magnesium / 1.7);
  }

  /**
   * @returns Cation concentration (as mEq/L).
   */
  cation(): number {
    return roundN(
      this.calcium / Calcium.eW + this.magnesium / Magnesium.eW + this.sodium / Sodium.eW,
      1,
    );
  }

  /**
   * @returns Anion concentration (as mEq/L)
   */
  anion(): number {
    return roundN(
      this.bicarbonate / Bicarbonate.eW + this.chloride / Chloride.eW + this.sulphate / Sulphate.eW,
      1,
    );
  }

  /**
   * Simulates treatments and returns the resulting new profile.
   *
   * @param volume the water volume.
   * @param treatments the array of treatments.
   */
  treat(volume: Volume, treatments: WaterTreatment[]): WaterProfile {
    const result = this.clone();
    treatments.forEach((step: WaterTreatment) => {
      step.transform(result, volume);
    });
    return result.round();
  }
}
