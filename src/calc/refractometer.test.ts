import { RefractometerCalc } from './refractometer';

describe('RefractometerCalc', () => {
  const subject = new RefractometerCalc();
  const custom = new RefractometerCalc(1.04);

  it('should calculate OG', () => {
    expect(subject.OG(13.2).SG()).toBeCloseTo(1.053, 3);
    expect(subject.OG(12.0).SG()).toBeCloseTo(1.048, 3);
    expect(subject.OG(10.8).SG()).toBeCloseTo(1.043, 3);

    expect(custom.OG(13.2).SG()).toBeCloseTo(1.051, 3);
    expect(custom.OG(12.0).SG()).toBeCloseTo(1.046, 3);
    expect(custom.OG(10.8).SG()).toBeCloseTo(1.042, 3);
  });

  it('should calculate FG', () => {
    expect(subject.FG(13.2, 6.1).SG()).toBeCloseTo(1.0108, 4);
    expect(subject.FG(12.0, 5.8).SG()).toBeCloseTo(1.011, 4);
    expect(subject.FG(10.8, 4.8).SG()).toBeCloseTo(1.0086, 4);

    expect(custom.FG(13.2, 6.1).SG()).toBeCloseTo(1.0105, 4);
    expect(custom.FG(12.0, 5.8).SG()).toBeCloseTo(1.0107, 4);
    expect(custom.FG(10.8, 4.8).SG()).toBeCloseTo(1.0083, 4);
  });

  it('should calculate fermentation', () => {
    expect(subject.fermentation(13.2, 6.1).ABV).toBeCloseTo(5.6, 1);
    expect(custom.fermentation(13.2, 6.1).ABV).toBeCloseTo(5.3, 1);
  });
});
