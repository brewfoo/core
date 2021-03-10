import { Density } from './density';
import { MassUnit } from './mass';
import { VolumeUnit } from './volume';
import { Temperature } from './temperature';

describe('Density', () => {
  let subject: Density;

  beforeEach(() => {
    subject = new Density(MassUnit.Kilogram, VolumeUnit.Liter, 1);
  });

  it('should calculate water density', () => {
    const c20 = Temperature.celsius(20);
    const c99 = Temperature.celsius(99);

    expect(Density.water(c20).kgPerLiter()).toBeCloseTo(0.9982, 4);
    expect(Density.water(c99).kgPerLiter()).toBeCloseTo(0.9588, 4);
  });

  it('should init', () => {
    expect(new Density(MassUnit.Gram, VolumeUnit.Liter, 950).kgPerLiter()).toBeCloseTo(0.95, 3);
    expect(new Density(MassUnit.USPound, VolumeUnit.USQuart, 2.1).kgPerLiter()).toBeCloseTo(
      1.007,
      3,
    );
    expect(new Density(MassUnit.USPound, VolumeUnit.USOunce, 0.1).kgPerLiter()).toBeCloseTo(
      1.534,
      3,
    );
  });

  it('should convert', () => {
    expect(subject.convert(MassUnit.Gram, VolumeUnit.Liter)).toBeCloseTo(1000, 0);
    expect(subject.convert(MassUnit.USPound, VolumeUnit.USQuart)).toBeCloseTo(2.086, 3);
    expect(subject.convert(MassUnit.USPound, VolumeUnit.USOunce)).toBeCloseTo(0.065, 3);
  });
});
