import { Hop } from './hop';
import { Mass, MassUnit } from '../../quantity/mass';
import { Volume } from '../../quantity/volume';
import { Gravity, GravityUnit } from '../../quantity/gravity';
import { Temperature } from '../../quantity/temperature';
import { IBUFormula } from '../ibu';
import { Duration } from '../../quantity/duration';

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
  const aromaLeaf = new Hop({
    boilTime: Duration.minutes(10),
    standTime: Duration.minutes(10),
    mass: new Mass(MassUnit.USOunce, 2),
    alpha: 11.6,
  });
  const dryHopLeaf = new Hop({
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
  const ambient = Temperature.celsius(20);

  it('should calculate utilization', () => {
    const u1 = boilLeaf.calcUtil(formula, batchVolume, gravity, ambient);
    expect(u1).toBeCloseTo(24.8, 1);

    const u2 = boilPellets.calcUtil(formula, batchVolume, gravity, ambient);
    expect(u2).toBeCloseTo(27.3, 1);

    const u3 = aromaLeaf.calcUtil(formula, batchVolume, gravity, ambient);
    expect(u3).toBeCloseTo(13.6, 1);

    const u4 = dryHopLeaf.calcUtil(formula, batchVolume, gravity, ambient);
    expect(u4).toBeCloseTo(0.0, 1);

    const u5 = customUtil.calcUtil(formula, batchVolume, gravity, ambient);
    expect(u5).toBeCloseTo(5.0, 1);
  });

  it('should calculate IBU', () => {
    const ibu1 = boilLeaf.calcIBU(formula, batchVolume, gravity, ambient);
    expect(ibu1).toBeCloseTo(34.5, 1);

    const ibu2 = boilPellets.calcIBU(formula, batchVolume, gravity, ambient);
    expect(ibu2).toBeCloseTo(38.0, 1);

    const ibu3 = aromaLeaf.calcIBU(formula, batchVolume, gravity, ambient);
    expect(ibu3).toBeCloseTo(35.9, 1);

    const ibu4 = dryHopLeaf.calcIBU(formula, batchVolume, gravity, ambient);
    expect(ibu4).toBeCloseTo(0.0, 1);

    const ibu5 = customUtil.calcIBU(formula, batchVolume, gravity, ambient);
    expect(ibu5).toBeCloseTo(16.8, 1);
  });
});
