import { CarbonateSpecies } from './carbonate-species';

describe('CarbonateSpecies', () => {
  const cc5 = new CarbonateSpecies(5.0);
  const cc7 = new CarbonateSpecies(7.0);
  const cc8 = new CarbonateSpecies(8.0);
  const cc11 = new CarbonateSpecies(11.0);

  it('should calculate fractions', () => {
    expect(cc5.carbonicAcid).toBeCloseTo(0.96, 2);
    expect(cc5.bicarbonate).toBeCloseTo(0.04, 2);
    expect(cc5.carbonate).toBeCloseTo(0.0, 2);
    expect(cc5.carbonicAcid + cc5.bicarbonate + cc5.carbonate).toEqual(1.0);

    expect(cc7.carbonicAcid).toBeCloseTo(0.19, 2);
    expect(cc7.bicarbonate).toBeCloseTo(0.81, 2);
    expect(cc7.carbonate).toBeCloseTo(0.0, 2);
    expect(cc7.carbonicAcid + cc7.bicarbonate + cc7.carbonate).toEqual(1.0);

    expect(cc8.carbonicAcid).toBeCloseTo(0.02, 2);
    expect(cc8.bicarbonate).toBeCloseTo(0.97, 2);
    expect(cc8.carbonate).toBeCloseTo(0.0, 2);
    expect(cc8.carbonicAcid + cc8.bicarbonate + cc8.carbonate).toEqual(1.0);

    expect(cc11.carbonicAcid).toBeCloseTo(0.0, 2);
    expect(cc11.bicarbonate).toBeCloseTo(0.19, 2);
    expect(cc11.carbonate).toBeCloseTo(0.81, 2);
    expect(cc11.carbonicAcid + cc11.bicarbonate + cc11.carbonate).toEqual(1.0);
  });
});
