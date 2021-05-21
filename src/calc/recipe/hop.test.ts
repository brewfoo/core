import { Hop } from './hop';
import { Mass, MassUnit } from '../../quantity/mass';
import { Volume } from '../../quantity/volume';
import { Gravity, GravityUnit } from '../../quantity/gravity';
import { IBUFormula } from '../ibu';
import { Duration } from '../../quantity/duration';
import { Temperature, TemperatureUnit } from '../../quantity/temperature';

describe('Hop', () => {
  const boilLeaf = new Hop({
    boilTime: Duration.minutes(60),
    mass: new Mass(MassUnit.Gram, 30),
    alpha: 11.6,
  });
  const boilPellets = new Hop({
    boilTime: Duration.minutes(60),
    mass: new Mass(MassUnit.Gram, 30),
    alpha: 11.6,
    multiplier: 1.1,
  });
  const flameOut = new Hop({
    standTime: Duration.minutes(10),
    mass: new Mass(MassUnit.USOunce, 2),
    alpha: 11.6,
  });
  const hopStand = new Hop({
    standTime: Duration.minutes(20),
    mass: new Mass(MassUnit.USOunce, 2),
    alpha: 11.6,
    wortTemperature: new Temperature(TemperatureUnit.Fahrenheit, 185),
  });
  const dryHop = new Hop({
    mass: new Mass(MassUnit.Gram, 60),
    alpha: 10.2,
  });
  const customUtil = new Hop({
    mass: new Mass(MassUnit.Gram, 60),
    alpha: 14.0,
    utilization: 5,
  });

  const formula = IBUFormula.Tinseth;
  const batchVolume = Volume.liter(25);
  const gravity = new Gravity(GravityUnit.SG, 1.042);
  const outside = new Temperature(TemperatureUnit.Fahrenheit, 50);

  it('should calculate utilization', () => {
    expect(boilLeaf.calcUtil(formula, batchVolume, gravity)).toBeCloseTo(24.8, 1);
    expect(boilPellets.calcUtil(formula, batchVolume, gravity)).toBeCloseTo(27.3, 1);
    expect(flameOut.calcUtil(formula, batchVolume, gravity)).toBeCloseTo(6.9, 1);
    expect(flameOut.calcUtil(formula, batchVolume, gravity, outside)).toBeCloseTo(6.7, 1);
    expect(hopStand.calcUtil(formula, batchVolume, gravity)).toBeCloseTo(5.1, 1);
    expect(dryHop.calcUtil(formula, batchVolume, gravity)).toBeCloseTo(0.0, 1);
    expect(customUtil.calcUtil(formula, batchVolume, gravity)).toBeCloseTo(5.0, 1);
  });

  it('should calculate IBU', () => {
    expect(boilLeaf.calcIBU(formula, batchVolume, gravity)).toBeCloseTo(34.5, 1);
    expect(boilPellets.calcIBU(formula, batchVolume, gravity)).toBeCloseTo(38, 1);
    expect(flameOut.calcIBU(formula, batchVolume, gravity)).toBeCloseTo(18.3, 1);
    expect(flameOut.calcIBU(formula, batchVolume, gravity, outside)).toBeCloseTo(17.7, 1);
    expect(hopStand.calcIBU(formula, batchVolume, gravity)).toBeCloseTo(13.3, 1);
    expect(dryHop.calcIBU(formula, batchVolume, gravity)).toBeCloseTo(0.0, 1);
    expect(customUtil.calcIBU(formula, batchVolume, gravity)).toBeCloseTo(16.8, 1);
  });
});
