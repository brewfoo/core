import { FermentationCalc } from './fermentation';
import { Gravity, GravityUnit } from '../quantity/gravity';

describe('FermentationCalc', () => {
  const fixtureA = new FermentationCalc(
    new Gravity(GravityUnit.SG, 1.05),
    new Gravity(GravityUnit.SG, 1.01),
  );
  const fixtureB = new FermentationCalc(
    new Gravity(GravityUnit.SG, 1.07),
    new Gravity(GravityUnit.SG, 1.015),
  );
  const fixture0 = new FermentationCalc(
    new Gravity(GravityUnit.SG, 1.0),
    new Gravity(GravityUnit.SG, 1.0),
  );

  it('should calculate true extract', () => {
    expect(fixtureA.TE).toBeCloseTo(4.41, 2);
    expect(fixtureB.TE).toBeCloseTo(6.35, 2);
    expect(fixture0.TE).toEqual(0.0);
  });

  it('should calculate attenuation', () => {
    expect(fixtureA.AA).toBeCloseTo(79.3, 1);
    expect(fixtureA.RA).toBeCloseTo(64.4, 1);

    expect(fixtureB.AA).toBeCloseTo(77.6, 1);
    expect(fixtureB.RA).toBeCloseTo(62.7, 1);

    expect(fixture0.AA).toEqual(0.0);
    expect(fixture0.RA).toEqual(0.0);
  });

  it('should calculate ABV/ABW', () => {
    expect(fixtureA.ABV).toBeCloseTo(5.24, 2);
    expect(fixtureA.ABW.g()).toBeCloseTo(4.12, 2);

    expect(fixtureB.ABV).toBeCloseTo(7.24, 2);
    expect(fixtureB.ABW.g()).toBeCloseTo(5.67, 2);

    expect(fixture0.ABV).toEqual(0.0);
    expect(fixture0.ABW.g()).toEqual(0.0);
  });

  it('should calculate energy', () => {
    expect(fixtureA.energy.kcal()).toBeCloseTo(46.21, 2);
    expect(fixtureB.energy.kcal()).toBeCloseTo(65.07, 2);
    expect(fixture0.energy.kcal()).toEqual(0.0);
  });
});
