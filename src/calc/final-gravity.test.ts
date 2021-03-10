import { Gravity, GravityUnit } from '../quantity/gravity';
import { FinalGravityCalc } from './final-gravity';

describe('FinalGravityCalc', () => {
  let subject: FinalGravityCalc;

  beforeEach(() => {
    subject = new FinalGravityCalc(new Gravity(GravityUnit.SG, 1.07), 77.6);
  });

  it('should calculate real attenuation', () => {
    expect(subject.RA).toBeCloseTo(63.6, 1);
  });

  it('should calculate FG', () => {
    expect(subject.FG.SG()).toBeCloseTo(1.015, 3);
  });
});
