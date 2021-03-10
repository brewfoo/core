import { DiastaticPower, DiastaticPowerUnit } from './diastatic-power';

describe('DiastaticPower', () => {
  let subject: DiastaticPower;

  beforeEach(() => {
    subject = DiastaticPower.lintner(40);
  });

  it('should init', () => {
    expect(new DiastaticPower(DiastaticPowerUnit.WindischKolbach, 124).lintner()).toBeCloseTo(
      40,
      1,
    );
  });

  it('should convert', () => {
    expect(subject.convert(DiastaticPowerUnit.Lintner)).toBeCloseTo(40, 1);
    expect(subject.convert(DiastaticPowerUnit.WindischKolbach)).toBeCloseTo(124, 1);
  });
});
