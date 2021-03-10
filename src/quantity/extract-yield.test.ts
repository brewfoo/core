import { ExtractYield, ExtractYieldUnit } from './extract-yield';

describe('ExtractYield', () => {
  let subject: ExtractYield;

  beforeEach(() => {
    subject = ExtractYield.percent(82);
  });

  it('should init', () => {
    expect(new ExtractYield(ExtractYieldUnit.PPG, 38).percent()).toBeCloseTo(82.6, 1);
  });

  it('should convert', () => {
    expect(subject.convert(ExtractYieldUnit.Percent)).toBeCloseTo(82, 1);
    expect(subject.convert(ExtractYieldUnit.PPG)).toBeCloseTo(37.7, 1);
  });
});
