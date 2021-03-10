import { Mass, MassUnit } from './mass';

describe('Mass', () => {
  let subject: Mass;

  beforeEach(() => {
    subject = Mass.kg(3.5);
  });

  it('should init', () => {
    expect(Mass.kg(-1).kg()).toEqual(0.0);
    expect(Mass.kg(3.5)).toEqual(subject);
    expect(new Mass(MassUnit.Gram, 3500)).toEqual(subject);
    expect(new Mass(MassUnit.Milligram, 3500000)).toEqual(subject);
    expect(new Mass(MassUnit.USOunce, 2).kg()).toBeCloseTo(0.057, 3);
    expect(new Mass(MassUnit.USPound, 7).kg()).toBeCloseTo(3.175, 3);
  });

  it('should convert', () => {
    expect(subject.convert(MassUnit.Gram)).toBeCloseTo(3500, 1);
    expect(subject.convert(MassUnit.Milligram)).toBeCloseTo(3500000, 1);
    expect(subject.convert(MassUnit.USPound)).toBeCloseTo(7.7, 1);
    expect(subject.convert(MassUnit.USOunce)).toBeCloseTo(123.5, 1);
  });
});
