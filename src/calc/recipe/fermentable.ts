import { Mass, MassUnit } from '../../quantity/mass';
import { populate } from '../../util';
import { ExtractYield } from '../../quantity/extract-yield';
import { Color, ColorUnit } from '../../quantity/color';
import { DiastaticPower } from '../../quantity/diastatic-power';
import { Volume, VolumeUnit } from '../../quantity/volume';
import { Gravity, GravityUnit } from '../../quantity/gravity';
import { FinalGravityCalc } from '../final-gravity';
import { Percent } from '../../quantity/other';

export class Fermentable {
  mass = Mass.kg(0);
  color = new Color(ColorUnit.EBC, 3);
  power = DiastaticPower.lintner(0);
  extraction = ExtractYield.percent(80);
  attenuation?: Percent; // maximum attenuation
  isGrain = false;
  lateAddition = false;

  constructor(attrs?: Partial<Fermentable>) {
    populate<Fermentable>(this, attrs);
  }

  BG(boilVolume: Volume, efficiency: Percent): Gravity {
    if (this.lateAddition) {
      return Gravity.none();
    }
    return this.OG(boilVolume, efficiency);
  }

  OG(batchVolume: Volume, mashEfficiency: Percent): Gravity {
    if (batchVolume.L() <= 0) {
      return Gravity.none();
    }

    let plato = (this.mass.kg() * this.extraction.percent()) / batchVolume.L();
    if (this.isGrain) {
      plato = plato * mashEfficiency * 0.01;
    }
    return new Gravity(GravityUnit.Plato, plato);
  }

  FG(batchVolume: Volume, efficiency: Percent, attenuation: Percent): Gravity {
    const og = this.OG(batchVolume, efficiency);
    if (this.attenuation == null) {
      return new FinalGravityCalc(og, attenuation).FG;
    } else if (this.attenuation <= 0) {
      return og;
    } else if (this.attenuation >= 100) {
      return Gravity.none();
    }
    return new Gravity(GravityUnit.Plato, og.plato() * (1 - this.attenuation * 0.01));
  }

  MCU(batchVolume: Volume): number {
    if (batchVolume.L() <= 0) {
      return 0.0;
    }

    return (
      (this.mass.convert(MassUnit.USPound) * this.color.convert(ColorUnit.Lovibond)) /
      batchVolume.convert(VolumeUnit.USGallon)
    );
  }
}
