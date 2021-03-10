import { Gravity, GravityUnit } from '../quantity/gravity';
import { Temperature } from '../quantity/temperature';
import { Volume } from '../quantity/volume';
import { UtilizationCalc } from './utilization';
import { Duration } from '../quantity/duration';

describe('UtilizationCalc', () => {
  const boilHops = new UtilizationCalc({
    wortGravity: Gravity.points(60),
    batchVolume: Volume.liter(20),
    boilTime: Duration.minutes(60),
    ambientTemperature: Temperature.celsius(20),
  });
  const aromaStand = new UtilizationCalc({
    wortGravity: Gravity.points(60),
    batchVolume: Volume.liter(20),
    boilTime: Duration.minutes(10),
    standTime: Duration.minutes(10),
    ambientTemperature: Temperature.celsius(20),
  });
  const flameOut = new UtilizationCalc({
    wortGravity: Gravity.points(60),
    batchVolume: Volume.liter(20),
    boilTime: Duration.none(),
    standTime: Duration.minutes(10),
    ambientTemperature: Temperature.celsius(20),
  });
  const dryHop = new UtilizationCalc({
    wortGravity: Gravity.points(60),
    batchVolume: Volume.liter(20),
    boilTime: Duration.none(),
    standTime: Duration.none(),
    ambientTemperature: Temperature.celsius(20),
  });

  const setup = (
    wg: number,
    bv: number,
    bt: number,
    st?: number,
    wt?: Temperature,
    at?: Temperature,
  ): UtilizationCalc => {
    return new UtilizationCalc({
      wortGravity: new Gravity(GravityUnit.SG, wg),
      batchVolume: Volume.liter(bv),
      boilTime: Duration.minutes(bt),
      standTime: st != null ? Duration.minutes(st) : undefined,
      ambientTemperature: at ?? Temperature.celsius(20),
      wortTemperature: wt,
    });
  };

  it('should calculate rager', () => {
    expect(boilHops.rager()).toBeCloseTo(29.4, 1);
    expect(aromaStand.rager()).toBeCloseTo(9.1, 1);
    expect(flameOut.rager()).toBeCloseTo(4.9, 1);
    expect(dryHop.rager()).toEqual(0.0);
  });

  it('should calculate tinseth', () => {
    expect(boilHops.tinseth()).toBeCloseTo(21.1, 1);
    expect(aromaStand.tinseth()).toBeCloseTo(11.5, 1);
    expect(flameOut.tinseth()).toBeCloseTo(5.8, 1);
    expect(dryHop.tinseth()).toEqual(0.0);
  });

  it('should ignore invalid formulae', () => {
    expect(boilHops.calculate(-1 as never)).toEqual(0.0);
  });

  it('should allow custom multiplier', () => {
    const calc = new UtilizationCalc({
      wortGravity: Gravity.points(60),
      batchVolume: Volume.liter(20),
      boilTime: Duration.minutes(60),
      ambientTemperature: Temperature.celsius(20),
      multiplier: 1.1,
    });
    expect(calc.tinseth()).toBeCloseTo(23.2, 1);
  });

  it('should adjust for gravity', () => {
    expect(setup(1.06, 20, 60, 0).tinseth()).toBeCloseTo(21.1, 1);
    expect(setup(1.04, 20, 60, 0).tinseth()).toBeCloseTo(25.2, 1);

    expect(setup(1.06, 20, 10, 10).tinseth()).toBeCloseTo(11.5, 1);
    expect(setup(1.04, 20, 10, 10).tinseth()).toBeCloseTo(13.8, 1);

    expect(setup(1.06, 20, 0, 20).tinseth()).toBeCloseTo(7.5, 1);
    expect(setup(1.04, 20, 0, 20).tinseth()).toBeCloseTo(9.0, 1);
  });

  it('should adjust for volume (on stands)', () => {
    expect(setup(1.06, 20, 60, 0).tinseth()).toBeCloseTo(21.1, 1);
    expect(setup(1.06, 10, 60, 0).tinseth()).toBeCloseTo(21.1, 1);

    expect(setup(1.06, 20, 10, 10).tinseth()).toBeCloseTo(11.5, 1);
    expect(setup(1.06, 10, 10, 10).tinseth()).toBeCloseTo(11.4, 1);

    expect(setup(1.06, 20, 0, 20).tinseth()).toBeCloseTo(7.5, 1);
    expect(setup(1.06, 10, 0, 20).tinseth()).toBeCloseTo(6.9, 1);
  });

  it('should adjust for temperatures (on stands)', () => {
    const T90 = Temperature.celsius(90);
    const T10 = Temperature.celsius(10);

    expect(setup(1.06, 20, 0, 20).tinseth()).toBeCloseTo(7.5, 1);
    expect(setup(1.06, 20, 0, 20, T90).tinseth()).toBeCloseTo(3.8, 1);
    expect(setup(1.06, 20, 0, 20, T90, T10).tinseth()).toBeCloseTo(3.5, 1);
  });
});
