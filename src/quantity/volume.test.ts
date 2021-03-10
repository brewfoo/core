import { Volume, VolumeUnit } from './volume';

describe('Volume', () => {
  let subject: Volume;

  beforeEach(() => {
    subject = Volume.liter(20);
  });

  it('should init', () => {
    expect(new Volume(VolumeUnit.Milliliter, 50).L()).toBeCloseTo(0.05, 3);
    expect(new Volume(VolumeUnit.USGallon, 6).L()).toBeCloseTo(22.7, 1);
    expect(new Volume(VolumeUnit.USQuart, 4).L()).toBeCloseTo(3.8, 1);
    expect(new Volume(VolumeUnit.USOunce, 12).L()).toBeCloseTo(0.355, 3);
  });

  it('should convert', () => {
    expect(subject.convert(VolumeUnit.Liter)).toBeCloseTo(20, 1);
    expect(subject.convert(VolumeUnit.Milliliter)).toBeCloseTo(20000, 1);
    expect(subject.convert(VolumeUnit.USGallon)).toBeCloseTo(5.3, 1);
    expect(subject.convert(VolumeUnit.USQuart)).toBeCloseTo(21.1, 1);
    expect(subject.convert(VolumeUnit.USOunce)).toBeCloseTo(676.3, 1);
  });
});
