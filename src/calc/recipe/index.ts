import { populate } from '../../util';
import { Fermentable } from './fermentable';
import { Hop } from './hop';
import { Volume } from '../../quantity/volume';
import { Temperature } from '../../quantity/temperature';
import { Gravity } from '../../quantity/gravity';
import { Mass } from '../../quantity/mass';
import { Energy } from '../../quantity/energy';
import { Color } from '../../quantity/color';
import { DiastaticPower } from '../../quantity/diastatic-power';
import { IBUFormula } from '../ibu';
import { BeerColorCalc, BeerColorFormula } from '../beer-color';
import { FermentationCalc } from '../fermentation';
import { SpecificVolume } from '../../quantity/specific-volume';
import { WaterUsage } from '../../water/usage';
import { Percent } from '../../quantity/other';
import { Duration } from '../../quantity/duration';

export { Fermentable as RecipeCalcFermentable, Hop as RecipeCalcHop };

interface Cache {
  OG?: Gravity;
  FG?: Gravity;
  BG?: Gravity;
  IBU?: number;

  beerColor?: Color;
  DP?: DiastaticPower;
  fermentableMass?: Mass;
  grainMass?: Mass;

  waterUsage?: WaterUsage;
  fermentation?: FermentationCalc;
}

export class RecipeCalc {
  /**
   * The total batch volume.
   * Default: 20 L.
   */
  batchVolume = Volume.liter(20);

  /**
   * Boil duration.
   * Default: 60m.
   */
  boilTime: Duration = Duration.minutes(60);

  /**
   * The typical absorption capacity of the grain.
   * Default: 1 L per kg.
   */
  absorption = SpecificVolume.literPerKg(1);

  /**
   * The typical volume of liquid lost between mash tun and kettle.
   * Default: 1 L.
   */
  mashTunLoss = Volume.liter(1);

  /**
   * The typical volume of liquid evaporating per hour during boil.
   * Default: 4 L per hour.
   */
  evaporation = Volume.liter(4);

  /**
   * The typical volume of liquid lost between kettle and fermentor.
   * Default: 0.5 L.
   */
  kettleLoss = Volume.liter(0.5);

  /**
   * Optional post-boil liquid addition.
   */
  postBoilAddition?: Volume;

  /**
   * Ambient temperature.
   * Default: 20°€
   */
  ambientTemperature = Temperature.celsius(20);

  /**
   * The mash efficiency in %
   */
  mashEfficiency: Percent = 75;

  /**
   * The list of fermentable additions
   */
  fermentables: Fermentable[] = [];

  /**
   * The list of hop additions
   */
  hops: Hop[] = [];

  /**
   * The attenuation in %.
   */
  attenuation: Percent = 75.0;

  /**
   * The IBU formula.
   */
  ibuFormula = IBUFormula.Tinseth;

  /**
   * The beer color formula.
   */
  beerColorFormula = BeerColorFormula.Morey;

  private cache: Cache = {};

  /**
   * @param attrs the partial recipe attributes.
   */
  constructor(attrs?: Partial<RecipeCalc>) {
    populate<RecipeCalc>(this, attrs);
    this.fermentables = this.fermentables.map((v) => new Fermentable(v));
    this.hops = this.hops.map((v) => new Hop(v));
  }

  /**
   * Reset memoization cache.
   */
  reset(): void {
    this.cache = {};
  }

  /**
   * @returns the calculated original gravity
   */
  get OG(): Gravity {
    return (this.cache.OG = this.cache.OG ?? this.calcOG());
  }

  /**
   * @returns the calculated final gravity
   */
  get FG(): Gravity {
    return (this.cache.FG = this.cache.FG ?? this.calcFG());
  }

  /**
   * @returns the calculated boil gravity at the start of the boil
   */
  get BG(): Gravity {
    return (this.cache.BG = this.cache.BG ?? this.calcWortGravity());
  }

  /**
   * @returns the resulting bitterness
   */
  get IBU(): number {
    return (this.cache.IBU = this.cache.IBU ?? this.calcIBU());
  }

  /**
   * @returns ABV alcohol by volume in %
   */
  get ABV(): Percent {
    return this.fermentation.ABV;
  }

  /**
   * @returns ABW alcohol by weight
   */
  get ABW(): Mass {
    return this.fermentation.ABW;
  }

  /**
   * @returns Energetic value per 100ml
   */
  get energy(): Energy {
    return this.fermentation.energy;
  }

  /**
   * @returns the BU/GU ratio
   */
  get BUGU(): number {
    return this.IBU / this.OG.points();
  }

  /**
   * @returns the resulting color
   */
  get beerColor(): Color {
    return (this.cache.beerColor = this.cache.beerColor ?? this.calcBeerColor());
  }

  /**
   * @returns Diastatic power
   */
  get DP(): DiastaticPower {
    return (this.cache.DP = this.cache.DP ?? this.calcDP());
  }

  /**
   * @returns Total mass of all fermentables
   */
  get fermentableMass(): Mass {
    return (this.cache.fermentableMass = this.cache.fermentableMass ?? this.calcFermentableMass());
  }

  /**
   * @returns Total mass of grains
   */
  get grainMass(): Mass {
    return (this.cache.grainMass =
      this.cache.grainMass ?? this.calcFermentableMass((v) => v.isGrain));
  }

  /**
   * @returns Water usage calculations.
   */
  get waterUsage(): WaterUsage {
    return (this.cache.waterUsage =
      this.cache.waterUsage ??
      new WaterUsage({
        batchVolume: this.batchVolume,
        boilTime: this.boilTime,
        absorption: this.absorption,
        mashTunLoss: this.mashTunLoss,
        evaporation: this.evaporation,
        kettleLoss: this.kettleLoss,
        ambientTemperature: this.ambientTemperature,
        postBoilAddition: this.postBoilAddition,
        grainMass: this.grainMass,
      }));
  }

  /**
   * @param n number of minitues since the beginning of the boil.
   * @returns Wort gravity after N minutes of boiling.
   */
  calcWortGravity(d = Duration.none()): Gravity {
    const boilVolume = this.waterUsage.boilVolume;
    const evaporated = this.evaporation.L() * d.hours();
    const remaining = boilVolume.L() - evaporated;
    const vol = Volume.liter(remaining > 0 ? remaining : 0);
    return this.fermentables
      .map((v) => v.BG(vol, this.mashEfficiency))
      .reduce((a, b) => a.plus(b), Gravity.none());
  }

  /**
   * @param formula specific formula.
   * @returns beer color.
   */
  calcBeerColor(formula = this.beerColorFormula): Color {
    return BeerColorCalc.derive(this.batchVolume, this.fermentables).calculate(formula);
  }

  /**
   * @param formula specific formula.
   * @returns IBU value.
   */
  calcIBU(formula = this.ibuFormula): number {
    return this.hops.map((v) => v.recipeIBU(formula, this)).reduce((a, b) => a + b, 0);
  }

  private calcOG(): Gravity {
    return this.fermentables
      .map((v) => v.OG(this.batchVolume, this.mashEfficiency))
      .reduce((a, b) => a.plus(b), Gravity.none());
  }

  private calcFG(): Gravity {
    return this.fermentables
      .map((v) => v.FG(this.batchVolume, this.mashEfficiency, this.attenuation))
      .reduce((a, b) => a.plus(b), Gravity.none());
  }

  private calcDP(): DiastaticPower {
    const total = this.fermentableMass.kg();

    let sum = 0.0;
    this.fermentables.forEach((v) => (sum += (v.power.lintner() * v.mass.kg()) / total));
    return DiastaticPower.lintner(sum);
  }

  private calcFermentableMass(filterFn?: (v: Fermentable) => boolean): Mass {
    let items = this.fermentables;
    if (filterFn != null) {
      items = items.filter(filterFn);
    }
    return items.map((v) => v.mass).reduce((a, b) => a.plus(b), Mass.none());
  }

  private get fermentation(): FermentationCalc {
    return (this.cache.fermentation =
      this.cache.fermentation ?? new FermentationCalc(this.OG, this.FG));
  }
}
