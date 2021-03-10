import { populate } from '../../util';
import { RecipeCalc } from '../recipe';
import { Gravity } from '../../quantity/gravity';
import { Mass, MassUnit } from '../../quantity/mass';
import { Percent } from '../../quantity/other';
import { Temperature } from '../../quantity/temperature';
import { Volume } from '../../quantity/volume';
import { UtilizationCalc } from '../utilization';
import { IBUCalc, IBUFormula } from '../ibu';
import { Duration } from '../../quantity/duration';

export class Hop {
  boilTime = Duration.minutes(0);
  standTime = Duration.minutes(0);
  mass = new Mass(MassUnit.Gram, 1);
  alpha = 10;
  wortTemperature = Temperature.boiling();
  multiplier?: number;
  utilization?: Percent;

  constructor(attrs?: Partial<Hop>) {
    populate<Hop>(this, attrs);
  }

  /**
   * Calculate utilization.
   *
   * @param formula the IBU formula to use.
   * @param batchVolume the volume of the batch.
   * @param wortGravity the gravity of the wort.
   * @param ambientTemperature the ambient temperature.
   * @returns utilization in %.
   */
  calcUtil(
    formula: IBUFormula,
    batchVolume: Volume,
    wortGravity: Gravity,
    ambientTemperature: Temperature,
  ): number {
    if (this.utilization != null) {
      return this.utilization;
    }

    const calc = new UtilizationCalc({
      wortGravity,
      batchVolume,
      boilTime: this.boilTime,
      standTime: this.standTime,
      wortTemperature: this.wortTemperature,
      ambientTemperature,
      multiplier: this.multiplier,
    });
    return calc.calculate(formula);
  }

  /**
   * Calculate IBU.
   *
   * @param formula the IBU formula to use.
   * @param batchVolume the volume of the batch.
   * @param wortGravity the gravity of the wort.
   * @param ambientTemperature the ambient temperature.
   * @returns the estimated IBU value.
   */
  calcIBU(
    formula: IBUFormula,
    batchVolume: Volume,
    wortGravity: Gravity,
    ambientTemperature: Temperature,
  ): number {
    return new IBUCalc({
      mass: this.mass,
      alpha: this.alpha,
      batchVolume,
      utilization: this.calcUtil(formula, batchVolume, wortGravity, ambientTemperature),
    }).IBU;
  }

  /**
   * Calculate the utilization from a recipe.
   *
   * @param formula the IBU formula to use.
   * @param recipe the recipe intance.
   * @returns the calculated utilization in %.
   */
  recipeUtil(formula: IBUFormula, recipe: RecipeCalc): Percent {
    const minute = Math.max(0, recipe.boilTime.minutes() - this.boilTime.minutes());

    return this.calcUtil(
      formula,
      recipe.batchVolume,
      recipe.calcWortGravity(Duration.minutes(minute)),
      recipe.ambientTemperature,
    );
  }

  /**
   * Calculate IBU from a recipe.
   *
   * @param formula the IBU formula to use.
   * @param recipe the recipe intance.
   * @returns the calculated IBU value.
   */
  recipeIBU(formula: IBUFormula, recipe: RecipeCalc): number {
    const minute = Math.max(0, recipe.boilTime.minutes() - this.boilTime.minutes());

    return this.calcIBU(
      formula,
      recipe.batchVolume,
      recipe.calcWortGravity(Duration.minutes(minute)),
      recipe.ambientTemperature,
    );
  }
}
