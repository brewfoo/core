import { Color, ColorUnit } from '../quantity/color';
import { Fermentable } from './recipe/fermentable';
import { Volume } from '../quantity/volume';

// Enumeration of beer color formulae.
export enum BeerColorFormula {
  Morey = 'morey',
  Mosher = 'mosher',
  Daniels = 'daniels',
}

/**
 * Beer color calculations. Example:
 *
 * ```typescript
 * const calc = new BeerColorCalc(10);
 * calc.morey();
 * calc.daniels();
 * ```
 */
export class BeerColorCalc {
  /**
   * Alternative constructor which allows color to be derived from
   * batch volume and the fermentables:
   *
   * ```typescript
   * const calc = BeerColorCalc.derive(Volume.liter(20), [
   *   new Fermentable({ mass: new Mass(MassUnit.USPound, 7), color: new Color(ColorUnit.Lovibond, 4) }),
   *   new Fermentable({ mass: new Mass(MassUnit.USPound, 0.5), color: new Color(ColorUnit.Lovibond, 60) }),
   * ]);
   *
   * @param batchVolume the total batch volume.
   * @param fermentables the array of fermentables.
   */
  static derive(batchVolume: Volume, fermentables: Fermentable[]): BeerColorCalc {
    const mcu = fermentables.reduce((sum: number, v: Fermentable) => {
      return sum + v.MCU(batchVolume);
    }, 0);
    return new this(mcu);
  }

  /**
   * @param mcu the Malt Color Unit.
   */
  constructor(public mcu: number) {}

  /**
   * @param formula the formula to apply.
   * @returns the calculated color.
   */
  calculate(formula: BeerColorFormula): Color {
    switch (formula) {
      case BeerColorFormula.Mosher:
        return this.mosher();
      case BeerColorFormula.Daniels:
        return this.daniels();
      case BeerColorFormula.Morey:
        return this.morey();
      default:
        return new Color(ColorUnit.EBC, 0);
    }
  }

  /**
   * Randy Mosher developed a model based on commercial beers
   * whose recipes and color were known.
   * Using this approximation, minimum beer color is 4.7.
   * This is not realistic and the model should only be used for
   * beer with MCU greater than 7.
   */
  mosher(): Color {
    const srm = this.mcu <= 0 ? 0 : 0.3 * this.mcu + 4.7;
    return new Color(ColorUnit.SRM, srm);
  }

  /**
   * Daniels' model differs from Mosher's and suggests that
   * homebrew is generally darker than commercial beers.
   * Like Mosher's model, the formula has a minimum color that
   * is not reasonable. Consequently the formula should only
   * be used for beers with MCU greater than 11.
   */
  daniels(): Color {
    const srm = this.mcu <= 0 ? 0 : 0.2 * this.mcu + 8.4;
    return new Color(ColorUnit.SRM, srm);
  }

  /**
   * Morey's approximation is based on five assumptions.
   * 1. SRM is approximately equal to MCU for values from 0 to 10.
   * 2. Homebrew is generally darker than commercial beer.
   * 3. Base on the previous qualitative postulate, Morey assumed that
   *    Ray Daniels’ predicted relationship exists for beers with color
   *    greater than 10.
   * 4. Since Mosher’s equation predicts darker color than Daniels’ model
   *    for values of MCU greater than 37, Morey assumed that Mosher’s
   *    approximation governed beer color for all values more than 37 MCUs.
   * 5. Difference in color for beers greater than 40 SRM are essentially
   *    impossible to detect visually; therefore, Morey limited the
   *    analysis to SRM of 50 and less.
   */
  morey(): Color {
    const ebc = this.mcu <= 0 ? 0 : 2.939634 * Math.pow(this.mcu, 0.6859);
    return new Color(ColorUnit.EBC, ebc);
  }
}
