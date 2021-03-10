import { Gravity, GravityUnit } from './gravity';

describe('Gravity', () => {
  let subject: Gravity;

  beforeEach(() => {
    subject = Gravity.points(70);
  });

  it('should init', () => {
    expect(new Gravity(GravityUnit.Plato, 17.03).points()).toBeCloseTo(70, 1);
    expect(new Gravity(GravityUnit.SG, 1.07).points()).toBeCloseTo(70, 1);
  });

  it('should convert', () => {
    expect(subject.convert(GravityUnit.SG)).toBeCloseTo(1.07, 3);
    expect(subject.convert(GravityUnit.Plato)).toBeCloseTo(17.034, 3);
  });
});
