import { Gravity, GravityUnit } from '../quantity/gravity';
import { FermentationCalc } from './fermentation';

/**
 * Refractometer calculations.
 */
export class RefractometerCalc {
  /**
   * @param wortCorrectionFactor the wort correction factor
   */
  constructor(readonly wortCorrectionFactor = 1.0) {}

  /**
   * Converts refractormeter reading into OG.
   *
   * @param brix refractometer value as °Brix.
   * @returns calculated original gravity.
   */
  OG(brix: number): Gravity {
    return new Gravity(GravityUnit.Plato, brix / this.wortCorrectionFactor);
  }

  /**
   * Estimates FG from refractormeter readings.
   * Credit to http://seanterrill.com/2011/04/07/refractometer-fg-results/.
   *
   * @param startBx start refractometer value as °Brix.
   * @param finishBx finish refractometer value as °Brix.
   * @returns calculated final gravity.
   */
  FG(startBx: number, finishBx: number): Gravity {
    const p0 = startBx / this.wortCorrectionFactor;
    const p1 = finishBx / this.wortCorrectionFactor;
    const sg =
      1 -
      0.0044993 * p0 +
      0.0117741 * p1 +
      0.000275806 * p0 * p0 -
      0.00127169 * p1 * p1 -
      0.00000728 * p0 * p0 * p0 +
      0.0000632929 * p1 * p1 * p1;
    return new Gravity(GravityUnit.SG, sg);
  }

  /**
   * @param startBx start refractometer value as °Brix.
   * @param finishBx finish refractometer value as °Brix.
   * @returns fermentation calculation.
   */
  fermentation(startBx: number, finishBx: number): FermentationCalc {
    return new FermentationCalc(this.OG(startBx), this.FG(startBx, finishBx));
  }
}
