import { Volume } from '../quantity/volume';
import { SpecificVolume } from '../quantity/specific-volume';
import { Temperature } from '../quantity/temperature';
import { Density } from '../quantity/density';
import { Mass } from '../quantity/mass';
import { Percent } from '../quantity/other';
import { Duration } from '../quantity/duration';

interface Params {
  /**
   * The final batch volume.
   */
  batchVolume: Volume;

  /**
   * Boil time.
   */
  boilTime: Duration;

  /**
   * The typical absorption capacity of the grain.
   */
  absorption: SpecificVolume;

  /**
   * The typical volume of liquid lost between mash tun and kettle.
   */
  mashTunLoss: Volume;

  /**
   * The typical volume of liquid evaporating per hour during boil.
   */
  evaporation: Volume;

  /**
   * The typical volume of liquid lost between kettle and fermentor.
   */
  kettleLoss: Volume;

  /**
   * Post-boil addition.
   */
  postBoilAddition?: Volume;

  /**
   * Ambient temperature.
   */
  ambientTemperature: Temperature;

  /**
   * Total grain mass.
   */
  grainMass: Mass;
}

export class WaterUsage {
  /**
   * Boil time.
   */
  readonly boilTime: Duration;

  /**
   * The typical absorption capacity of the grain.
   */
  readonly absorption: SpecificVolume;

  /**
   * Mash tun loss.
   */
  readonly mashTunLoss: Volume;

  /**
   * The typical volume of liquid evaporating per hour during boil.
   */
  readonly evaporation: Volume;

  /**
   * Kettle loss.
   */
  readonly kettleLoss: Volume;

  /**
   * Post-boil addition.
   */
  readonly postBoilAddition: Volume;

  /**
   * Total grain mass.
   */
  readonly grainMass: Mass;

  /**
   * Calculated volume of liquid lost to grain absorption.
   */
  readonly absorptionLoss: Volume;

  /**
   * Calculated volume of liquid lost due to evaporation during boiling.
   */
  readonly evaporationLoss: Volume;

  /**
   * Calculated percentage of liquid lost due to shrinkage during cooling.
   */
  readonly shrinkagePercent: Percent;

  /**
   * Calculated volume of liquid lost due to shrinkage during cooling.
   */
  readonly shrinkageLoss: Volume;

  /**
   * Calculated volume of wort before boil.
   */
  readonly boilVolume: Volume;
  /**
   * Calculated total volume of water required.
   */
  readonly totalVolume: Volume;

  /**
   * @param o parameters.
   */
  constructor(o: Params) {
    this.boilTime = o.boilTime;
    this.absorption = o.absorption;
    this.mashTunLoss = o.mashTunLoss;
    this.evaporation = o.evaporation;
    this.kettleLoss = o.kettleLoss;
    this.postBoilAddition = o.postBoilAddition ?? Volume.liter(0);
    this.grainMass = o.grainMass;

    const dsa = Density.water(o.ambientTemperature).kgPerLiter();
    const dsb = Density.water(Temperature.boiling()).kgPerLiter();
    const dfn = (dsa - dsb) / dsa;
    const pbv = o.batchVolume.minus(this.postBoilAddition);

    this.absorptionLoss = Volume.liter(this.absorption.literPerKg() * this.grainMass.kg());
    this.evaporationLoss = Volume.liter(this.evaporation.L() * this.boilTime.hours());
    this.shrinkagePercent = dfn * 100;
    this.shrinkageLoss = Volume.liter(pbv.L() * dfn);

    this.boilVolume = pbv.plus(this.shrinkageLoss).plus(o.kettleLoss).plus(this.evaporationLoss);
    this.totalVolume = this.boilVolume.plus(this.absorptionLoss).plus(o.mashTunLoss);
  }
}
