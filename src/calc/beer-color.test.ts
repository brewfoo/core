import { BeerColorCalc } from './beer-color';
import { Volume } from '../quantity/volume';
import { Fermentable } from './recipe/fermentable';
import { Mass } from '../quantity/mass';
import { Color, ColorUnit } from '../quantity/color';

const SRM = ColorUnit.SRM;

describe('BeerColorCalc', () => {
  const c0 = new BeerColorCalc(0);
  const c1 = new BeerColorCalc(1);
  const c10 = new BeerColorCalc(10);
  const c20 = new BeerColorCalc(20);
  const c40 = new BeerColorCalc(40);
  const c60 = new BeerColorCalc(60);

  it('should derive', () => {
    const subject = BeerColorCalc.derive(Volume.liter(20), [
      new Fermentable({ mass: Mass.kg(3.65), color: new Color(ColorUnit.Lovibond, 4) }),
      new Fermentable({ mass: Mass.kg(0.35), color: new Color(ColorUnit.Lovibond, 60) }),
    ]);
    expect(subject.morey().convert(SRM)).toBeCloseTo(9.5, 1);
  });

  it('should calculate mosher', () => {
    expect(c0.mosher().convert(SRM)).toBeCloseTo(0.0, 1);
    expect(c1.mosher().convert(SRM)).toBeCloseTo(5.0, 1);
    expect(c10.mosher().convert(SRM)).toBeCloseTo(7.7, 1);
    expect(c20.mosher().convert(SRM)).toBeCloseTo(10.7, 1);
    expect(c40.mosher().convert(SRM)).toBeCloseTo(16.7, 1);
    expect(c60.mosher().convert(SRM)).toBeCloseTo(22.7, 1);
  });

  it('should calculate daniels', () => {
    expect(c0.daniels().convert(SRM)).toBeCloseTo(0.0, 1);
    expect(c1.daniels().convert(SRM)).toBeCloseTo(8.6, 1);
    expect(c10.daniels().convert(SRM)).toBeCloseTo(10.4, 1);
    expect(c20.daniels().convert(SRM)).toBeCloseTo(12.4, 1);
    expect(c40.daniels().convert(SRM)).toBeCloseTo(16.4, 1);
    expect(c60.daniels().convert(SRM)).toBeCloseTo(20.4, 1);
  });

  it('should calculate morey', () => {
    expect(c0.morey().convert(SRM)).toBeCloseTo(0.0, 1);
    expect(c1.morey().convert(SRM)).toBeCloseTo(1.5, 1);
    expect(c10.morey().convert(SRM)).toBeCloseTo(7.2, 1);
    expect(c20.morey().convert(SRM)).toBeCloseTo(11.7, 1);
    expect(c40.morey().convert(SRM)).toBeCloseTo(18.8, 1);
    expect(c60.morey().convert(SRM)).toBeCloseTo(24.8, 1);
  });
});
