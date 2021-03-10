import { Calcium, Chloride, Ion, Magnesium, Sodium, Sulphate } from './ions';

export enum SaltType {
  CalciumSulphate = 'CaSO4',
  CalciumChloride = 'CaCl2',
  CalciumCarbonate = 'CaCO3',
  CalciumHydroxide = 'Ca(OH)2',
  MagnesiumSulphate = 'MgSO4',
  MagnesiumChloride = 'MgCl2',
  SodiumBicarbonate = 'NaHCO3',
  SodiumChloride = 'NaCl',
}

export interface SaltContribution {
  ion: Ion;
  ppm: number;
}

/**
 * Salts used to treat water.
 */
export class Salt {
  static readonly CalciumSulphate = new Salt(SaltType.CalciumSulphate);
  static readonly Gypsum = new Salt(SaltType.CalciumSulphate);
  static readonly CalciumChloride = new Salt(SaltType.CalciumChloride);
  static readonly CalciumCarbonate = new Salt(SaltType.CalciumCarbonate);
  static readonly Chalk = new Salt(SaltType.CalciumCarbonate);
  static readonly CalciumHydroxide = new Salt(SaltType.CalciumHydroxide);
  static readonly SlackedLime = new Salt(SaltType.CalciumHydroxide);
  static readonly MagnesiumSulphate = new Salt(SaltType.MagnesiumSulphate);
  static readonly Epsom = new Salt(SaltType.MagnesiumSulphate);
  static readonly MagnesiumChloride = new Salt(SaltType.MagnesiumChloride);
  static readonly SodiumBicarbonate = new Salt(SaltType.SodiumBicarbonate);
  static readonly BakingSoda = new Salt(SaltType.SodiumBicarbonate);
  static readonly SodiumChloride = new Salt(SaltType.SodiumChloride);
  static readonly TableSalt = new Salt(SaltType.SodiumChloride);

  readonly type: SaltType;
  readonly name: string;
  readonly tradeName?: string;
  readonly formula: string;
  readonly contributions: SaltContribution[] = [];
  readonly bicarbonate: number; // bicarbonate contribution, ppm

  constructor(type: SaltType) {
    this.type = type;

    switch (type) {
      case SaltType.CalciumSulphate:
        this.name = 'Calcium sulphate';
        this.tradeName = 'Gypsum';
        this.formula = 'CaSO₄';
        this.contributions = [
          { ion: Calcium, ppm: 232.8 },
          { ion: Sulphate, ppm: 557.7 },
        ];
        this.bicarbonate = 0;
        break;
      case SaltType.CalciumChloride:
        this.name = 'Calcium chloride';
        this.formula = 'CaCl₂';
        this.contributions = [
          { ion: Calcium, ppm: 272.6 },
          { ion: Chloride, ppm: 482.3 },
        ];
        this.bicarbonate = 0;
        break;
      case SaltType.CalciumCarbonate:
        this.name = 'Calcium carbonate';
        this.tradeName = 'Chalk';
        this.formula = 'CaCO₃';
        this.contributions = [{ ion: Calcium, ppm: 200 }];
        this.bicarbonate = 600;
        break;
      case SaltType.CalciumHydroxide:
        this.name = 'Calcium hydroxide';
        this.tradeName = 'Slaked Lime';
        this.formula = 'Ca(OH)₂';
        this.contributions = [{ ion: Calcium, ppm: 541 }];
        this.bicarbonate = 1645;
        break;
      case SaltType.MagnesiumSulphate:
        this.name = 'Magnesium sulphate';
        this.tradeName = 'Epsom';
        this.formula = 'MgSO₄';
        this.contributions = [
          { ion: Magnesium, ppm: 98.6 },
          { ion: Sulphate, ppm: 389.6 },
        ];
        this.bicarbonate = 0;
        break;
      case SaltType.MagnesiumChloride:
        this.name = 'Magnesium chloride';
        this.formula = 'MgCl₂';
        this.contributions = [
          { ion: Magnesium, ppm: 119.5 },
          { ion: Chloride, ppm: 348.7 },
        ];
        this.bicarbonate = 0;
        break;
      case SaltType.SodiumBicarbonate:
        this.name = 'Sodium bicarbonate';
        this.tradeName = 'Baking Soda';
        this.formula = 'NaHCO₃';
        this.contributions = [{ ion: Sodium, ppm: 274 }];
        this.bicarbonate = 726;
        break;
      case SaltType.SodiumChloride:
        this.name = 'Sodium chloride';
        this.tradeName = 'Table Salt';
        this.formula = 'NaCl';
        this.contributions = [
          { ion: Sodium, ppm: 393.4 },
          { ion: Chloride, ppm: 606.6 },
        ];
        this.bicarbonate = 0;
        break;
    }
  }
}
