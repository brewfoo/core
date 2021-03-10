import { Energy, EnergyUnit } from './energy';

describe('Energy', () => {
  let subject: Energy;

  beforeEach(() => {
    subject = new Energy(EnergyUnit.Joule, 543920);
  });

  it('should init', () => {
    expect(new Energy(EnergyUnit.KiloCalories, 130).joule()).toBeCloseTo(543920, 1);
  });

  it('should convert', () => {
    expect(subject.convert(EnergyUnit.Joule)).toBeCloseTo(543920, 1);
    expect(subject.convert(EnergyUnit.KiloCalories)).toBeCloseTo(130, 1);
  });
});
