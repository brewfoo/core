import { Chloride, Ion, Sulphate } from './ions';
import { Percent } from '../quantity/other';
import { Density } from '../quantity/density';
import { Volume } from '../quantity/volume';
import { Mass } from '../quantity/mass';

export enum AcidType {
  Phosphoric = 'phosphoric',
  Lactic = 'lactic',
  Citric = 'citric',
  Ascorbic = 'ascorbic',
  Hydrochloric = 'hydrochloric',
  Sulfuric = 'sulfuric',
  Tartaric = 'tartaric',
  Acetic = 'acetic',
}

export interface AcidSolution {
  concentration: Percent;
  volume: Volume;
}

export class Acid {
  static readonly Acetic = new Acid(AcidType.Acetic);
  static readonly Ascorbic = new Acid(AcidType.Ascorbic);
  static readonly Citric = new Acid(AcidType.Citric);
  static readonly Hydrochloric = new Acid(AcidType.Hydrochloric);
  static readonly Lactic = new Acid(AcidType.Lactic);
  static readonly Phosphoric = new Acid(AcidType.Phosphoric);
  static readonly Sulfuric = new Acid(AcidType.Sulfuric);
  static readonly Tartaric = new Acid(AcidType.Tartaric);

  readonly type: AcidType;
  readonly name: string;
  readonly formula: string;
  readonly contributions: Ion[] = [];
  readonly weight: number; // molecular weight
  readonly pK1: number;
  readonly pK2?: number;
  readonly pK3?: number;

  constructor(type: AcidType) {
    this.type = type;

    switch (type) {
      case AcidType.Ascorbic:
        this.name = 'Ascorbic';
        this.formula = 'C₆H₈O₆';
        this.weight = 176.12;
        this.pK1 = 4.1;
        this.pK2 = 11.6;
        break;
      case AcidType.Acetic:
        this.name = 'Acetic';
        this.formula = 'CH₃COOH';
        this.weight = 60.05;
        this.pK1 = 4.76;
        break;
      case AcidType.Citric:
        this.name = 'Citric';
        this.formula = 'C₆H₈O₇';
        this.weight = 192.12;
        this.pK1 = 3.14;
        this.pK2 = 4.77;
        this.pK3 = 6.39;
        break;
      case AcidType.Hydrochloric:
        this.name = 'Hydrochloric';
        this.formula = 'HCl';
        this.contributions = [Chloride];
        this.weight = 36.46;
        this.pK1 = -7.0;
        break;
      case AcidType.Lactic:
        this.name = 'Lactic';
        this.formula = 'C₃H₆O₃';
        this.weight = 90.08;
        this.pK1 = 3.86;
        break;
      case AcidType.Phosphoric:
        this.name = 'Phosphoric';
        this.formula = 'H₃PO₄';
        this.weight = 97.99;
        this.pK1 = 2.14;
        this.pK2 = 7.2;
        this.pK3 = 12.37;
        break;
      case AcidType.Sulfuric:
        this.name = 'Sulfuric';
        this.formula = 'H₂SO₄';
        this.contributions = [Sulphate];
        this.weight = 98.08;
        this.pK1 = -3.0;
        this.pK2 = 1.99;
        break;
      case AcidType.Tartaric:
        this.name = 'Tartaric';
        this.formula = 'C₄H₆O₆';
        this.weight = 150.09;
        this.pK1 = 2.89;
        this.pK2 = 4.4;
        break;
    }
  }

  /**
   * The acid relative "strength" factor for a given pH.
   */
  strength(pH: number): number {
    const r1 = Math.pow(10, pH - this.pK1);
    const r2 = this.pK2 != null ? Math.pow(10, pH - this.pK2) : 0;
    const r3 = this.pK3 != null ? Math.pow(10, pH - this.pK3) : 0;
    const m0 = 1 / (1 + r1 + r1 * r2 + r1 * r2 * r3);
    const m1 = r1 * m0;
    const m2 = r2 * m1;
    const m3 = r3 * m2;
    return m1 + 2 * m2 + 3 * m3;
  }

  /**
   * Calculates density for a given concentration (% weight)
   */
  density(ct: Percent): Density {
    switch (this.type) {
      case AcidType.Ascorbic:
        return Density.kgPerLiter(1 + 0.00694 * ct);
      case AcidType.Acetic:
        return Density.kgPerLiter(1 + 0.00049 * ct);
      case AcidType.Citric:
        return Density.kgPerLiter(1 + 0.00665 * ct);
      case AcidType.Hydrochloric:
        return Density.kgPerLiter(1 + 0.00498 * ct);
      case AcidType.Lactic:
        return Density.kgPerLiter(1 + 0.00239 * ct);
      case AcidType.Phosphoric: {
        const x = 1.36 * (1 - Math.pow(1.6, 0.01 * ct));
        return Density.kgPerLiter(1 - x);
      }
      case AcidType.Sulfuric: {
        const x = 2.2e-4 * Math.pow(ct, 2) - 4.5e-6 * Math.pow(ct, 3) + 2.5e-8 * Math.pow(ct, 4);
        return Density.kgPerLiter(1 + 0.011 * ct - x);
      }
      case AcidType.Tartaric:
        return Density.kgPerLiter(1 + 0.0049 * ct);
    }
  }

  /**
   * Estimates the mass of pure acid in a concentrated solution.
   * @param vol the volume of the solution.
   * @param ct the concentration of the solution.
   */
  mass(sol: AcidSolution): Mass {
    const ct = sol.concentration;
    return Mass.kg(sol.volume.L() * ct * 0.01 * this.density(ct).kgPerLiter());
  }

  /**
   * Estimates normality for pure acid dissolved in water.
   * @param weight the weight of pure acid.
   * @param volume the volume of water.
   * @param pH the target pH.
   */
  normality(weight: Mass, volume: Volume, pH = 5.5): number {
    return (weight.g() * this.strength(pH)) / this.weight / volume.L();
  }
}
