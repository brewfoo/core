import { Gravity } from '../quantity/gravity';
import { Temperature, TemperatureUnit } from '../quantity/temperature';
import { Volume } from '../quantity/volume';
import { IBUFormula } from './ibu';
import { Percent } from '../quantity/other';
import { Duration } from '../quantity/duration';

const Kelvin = TemperatureUnit.Kelvin;

interface Params {
  wortGravity: Gravity;
  batchVolume: Volume;
  boilTime: Duration;
  standTime?: Duration;
  ambientTemperature?: Temperature; // ambient temperature
  wortTemperature?: Temperature; // average hop stand wort temperature
  multiplier?: number;
}

/**
 * Utilization calculations. Example:
 *
 * ```typescript
 * const calc = new UtilizationCalc({
 *   wortGravity: new Gravity(GravityUnit.SG, 1.06),
 *   batchVolume: new Volume(VolumeUnit.USGallon, 5),
 *   boilTime: 60,
 *   ambientTemperature: Temperature.ambient(),
 * });
 * ```
 */
export class UtilizationCalc {
  private readonly params: Params;

  /**
   * @param o utilization parameters.
   */
  constructor(o: Params) {
    this.params = { ...o };
  }

  /**
   * Calculate utilization.
   *
   * @param formula IBU formula to use.
   * @returns utilization in %.
   */
  calculate(formula: IBUFormula): Percent {
    switch (formula) {
      case IBUFormula.Rager:
        return this.rager();
      case IBUFormula.Tinseth:
        return this.tinseth();
      default:
        return 0.0;
    }
  }

  /**
   * Returns utilization using Rager's formula.
   */
  rager(): Percent {
    return this.calc((min: number) => {
      const e = Math.exp((2 * (min - 31.32)) / 18.27);
      let u = (18.11 + (13.86 * (e - 1)) / (e + 1)) / 100;
      if (this.params.wortGravity.SG() > 1.05) {
        u = u / ((this.params.wortGravity.SG() - 1.05) / 0.2 + 1);
      }
      return u;
    });
  }

  /**
   * Returns utilization using Tinseth's formula.
   */
  tinseth(): Percent {
    return this.calc((min: number) => {
      const fG = 1.65 * Math.pow(0.000125, this.params.wortGravity.SG() - 1.0);
      const fT = (1 - Math.pow(Math.E, -0.04 * min)) / 4.15;
      return fG * fT;
    });
  }

  private calc(fn: (min: number) => number): Percent {
    const standTime = this.params.standTime?.minutes() || 0;
    const multiplier = this.params.multiplier ?? 1.0;

    // calculate boil utilization
    const bm = this.params.boilTime.minutes();
    const bu = bm <= 0 ? 0.0 : fn(bm) * 100;
    if (standTime <= 0) {
      return bu * multiplier;
    }

    // calculate marginal utilization
    const mu = fn(bm + standTime) * 100 - bu;

    // return temperature adjusted utilization
    return (bu + mu * this.tam()) * multiplier;
  }

  // Calculates the temperature adjusted multiplier.
  private tam(): number {
    // Try to predict average wort temperature if none provided.
    const wortTemperature = this.params.wortTemperature ?? this.predictedWortTemperature();
    return 2.39 * Math.pow(10, 11) * Math.exp(-9773 / wortTemperature.convert(Kelvin));
  }

  // Predicts the average wort temperature during hop stand.
  private predictedWortTemperature(): Temperature {
    const standTime = this.params.standTime?.minutes() || 0;
    const ambientTemperature = this.params.ambientTemperature ?? Temperature.ambient();

    const k = Math.pow(this.params.batchVolume.L(), -0.243) / 46.242;
    const a = ambientTemperature.C(); // ambient
    const b = 100; // initial, boiling
    const c = a + (b - a) * Math.exp(-k * standTime); // after stand time
    const m = (b + c) / 2; // average
    return Temperature.celsius(m);
  }
}
