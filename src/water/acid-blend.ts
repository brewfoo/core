import { Acid } from './acid';
import { Percent } from '../quantity/other';

export enum AcidBlendType {
  CRS = 'crs',
}

export class AcidBlend {
  static readonly CRS = new AcidBlend(AcidBlendType.CRS);

  readonly name: string;
  readonly components: Array<{ acid: Acid; concentration: Percent }>;

  constructor(readonly type: AcidBlendType) {
    switch (type) {
      case AcidBlendType.CRS:
        this.name = 'CRS';
        this.components = [
          { acid: Acid.Hydrochloric, concentration: 12.75 },
          { acid: Acid.Sulfuric, concentration: 16.25 },
        ];
        break;
    }
  }
}
