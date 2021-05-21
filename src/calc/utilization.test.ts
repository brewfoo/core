import { Gravity, GravityUnit } from '../quantity/gravity';
import { Temperature } from '../quantity/temperature';
import { Volume } from '../quantity/volume';
import { UtilizationCalc } from './utilization';
import { Duration } from '../quantity/duration';

describe('UtilizationCalc', () => {
  const boilOnly = new UtilizationCalc({
    wortGravity: Gravity.points(60),
    batchVolume: Volume.liter(20),
    boilTime: Duration.minutes(60),
  });
  const plusStand = new UtilizationCalc({
    wortGravity: Gravity.points(60),
    batchVolume: Volume.liter(20),
    boilTime: Duration.minutes(50),
    standTime: Duration.minutes(10),
  });
  const flameOut = new UtilizationCalc({
    wortGravity: Gravity.points(60),
    batchVolume: Volume.liter(20),
    boilTime: Duration.none(),
    standTime: Duration.minutes(10),
  });
  const dryHop = new UtilizationCalc({
    wortGravity: Gravity.points(60),
    batchVolume: Volume.liter(20),
    boilTime: Duration.none(),
    standTime: Duration.none(),
  });

  const setup = (opts: {
    sg: number;
    liter: number;
    boil?: number;
    stand?: number;
    wort?: Temperature;
    ambient?: Temperature;
  }): UtilizationCalc => {
    return new UtilizationCalc({
      wortGravity: new Gravity(GravityUnit.SG, opts.sg),
      batchVolume: Volume.liter(opts.liter),
      boilTime: Duration.minutes(opts.boil || 0),
      standTime: opts.stand != null ? Duration.minutes(opts.stand) : undefined,
      wortTemperature: opts.wort,
      ambientTemperature: opts.ambient,
    });
  };

  it('should calculate rager', () => {
    expect(boilOnly.rager()).toBeCloseTo(29.4, 1);
    expect(plusStand.rager()).toBeCloseTo(28.9, 1);
    expect(flameOut.rager()).toBeCloseTo(4.9, 1);
    expect(dryHop.rager()).toEqual(0.0);
  });

  it('should calculate tinseth', () => {
    expect(boilOnly.tinseth()).toBeCloseTo(21.1, 1);
    expect(plusStand.tinseth()).toBeCloseTo(20.8, 1);
    expect(flameOut.tinseth()).toBeCloseTo(5.8, 1);
    expect(dryHop.tinseth()).toEqual(0.0);
  });

  it('should ignore invalid formulae', () => {
    expect(boilOnly.calculate(-1 as never)).toEqual(0.0);
  });

  it('should allow custom multiplier', () => {
    const calc = new UtilizationCalc({
      wortGravity: Gravity.points(60),
      batchVolume: Volume.liter(20),
      boilTime: Duration.minutes(60),
      multiplier: 1.1,
    });
    expect(calc.tinseth()).toBeCloseTo(23.2, 1);
  });

  it('should adjust for gravity', () => {
    expect(setup({ sg: 1.06, liter: 20, boil: 60 }).tinseth()).toBeCloseTo(21.1, 1);
    expect(setup({ sg: 1.04, liter: 20, boil: 60 }).tinseth()).toBeCloseTo(25.2, 1);

    expect(setup({ sg: 1.06, liter: 20, boil: 10, stand: 10 }).tinseth()).toBeCloseTo(11.5, 1);
    expect(setup({ sg: 1.04, liter: 20, boil: 10, stand: 10 }).tinseth()).toBeCloseTo(13.8, 1);

    expect(setup({ sg: 1.06, liter: 20, stand: 20 }).tinseth()).toBeCloseTo(7.5, 1);
    expect(setup({ sg: 1.04, liter: 20, stand: 20 }).tinseth()).toBeCloseTo(9.0, 1);
  });

  it('should adjust for volume (on stands)', () => {
    expect(setup({ sg: 1.06, liter: 20, boil: 60 }).tinseth()).toBeCloseTo(21.1, 1);
    expect(setup({ sg: 1.06, liter: 10, boil: 60 }).tinseth()).toBeCloseTo(21.1, 1);

    expect(setup({ sg: 1.06, liter: 20, boil: 10, stand: 10 }).tinseth()).toBeCloseTo(11.5, 1);
    expect(setup({ sg: 1.06, liter: 10, boil: 10, stand: 10 }).tinseth()).toBeCloseTo(11.4, 1);

    expect(setup({ sg: 1.06, liter: 20, stand: 20 }).tinseth()).toBeCloseTo(7.5, 1);
    expect(setup({ sg: 1.06, liter: 10, stand: 20 }).tinseth()).toBeCloseTo(6.9, 1);
  });

  it('should adjust for wort temperatures (on stands)', () => {
    const T90 = Temperature.celsius(90);
    const T70 = Temperature.celsius(70);

    expect(setup({ sg: 1.06, liter: 20, stand: 20 }).tinseth()).toBeCloseTo(7.5, 1);
    expect(setup({ sg: 1.06, liter: 20, stand: 20, wort: T90 }).tinseth()).toBeCloseTo(6.3, 1);
    expect(setup({ sg: 1.06, liter: 20, stand: 20, wort: T70 }).tinseth()).toBeCloseTo(1.3, 1);
  });

  it('should adjust for ambient temperatures (on stands)', () => {
    const T80 = Temperature.celsius(80);
    const T10 = Temperature.celsius(10);

    expect(setup({ sg: 1.06, liter: 20, stand: 20 }).tinseth()).toBeCloseTo(7.5, 1);
    expect(setup({ sg: 1.06, liter: 20, stand: 20, ambient: T10 }).tinseth()).toBeCloseTo(7.0, 1);

    // ignore ambient of wort temperature is given
    expect(setup({ sg: 1.06, liter: 20, stand: 20, wort: T80 }).tinseth()).toBeCloseTo(2.9, 1);
    expect(
      setup({ sg: 1.06, liter: 20, stand: 20, wort: T80, ambient: T10 }).tinseth(),
    ).toBeCloseTo(2.9, 1);
  });
});
