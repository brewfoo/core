import { SpecificVolume } from './specific-volume';
import { VolumeUnit } from './volume';
import { MassUnit } from './mass';

describe('SpecificVolume', () => {
  let subject: SpecificVolume;

  beforeEach(() => {
    subject = new SpecificVolume(VolumeUnit.Liter, MassUnit.Kilogram, 2.7);
  });

  it('should init', () => {
    expect(new SpecificVolume(VolumeUnit.USGallon, MassUnit.USPound, 1.2).literPerKg()).toBeCloseTo(
      10.0,
      1,
    );
    expect(new SpecificVolume(VolumeUnit.USQuart, MassUnit.USPound, 1.2).literPerKg()).toBeCloseTo(
      2.5,
      1,
    );
  });

  it('should convert', () => {
    expect(subject.convert(VolumeUnit.Liter, MassUnit.Kilogram)).toBeCloseTo(2.7, 1);
    expect(subject.convert(VolumeUnit.USGallon, MassUnit.USPound)).toBeCloseTo(0.32, 2);
    expect(subject.convert(VolumeUnit.USQuart, MassUnit.USPound)).toBeCloseTo(1.29, 2);
  });
});
