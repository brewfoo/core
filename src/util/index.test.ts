import { roundN } from './index';

describe('roundN', () => {
  it('should round', () => {
    expect(roundN(-0.49999999999999994)).toEqual(-0);
    expect(roundN(-0.5)).toEqual(-1);
    expect(roundN(-0.5000000000000001)).toEqual(-1);
    expect(roundN(0)).toEqual(0);
    expect(roundN(0.49999999999999994)).toEqual(0);
    expect(roundN(0.5)).toEqual(1);
    expect(roundN(0.5000000000000001)).toEqual(1);
    expect(roundN(1.390671161567e-309)).toEqual(0);
    expect(roundN(2.2517998136852485e15)).toEqual(2.251799813685249e15);
    expect(roundN(4.503599627370497e15)).toEqual(4.503599627370497e15);
    expect(roundN(2.251e40, 2)).toEqual(2.251e40);
    expect(roundN(Infinity)).toEqual(Infinity);
    expect(roundN(-Infinity)).toEqual(-Infinity);
    expect(roundN(NaN)).toEqual(NaN);

    expect(roundN(55.55, 1)).toEqual(55.6);
    expect(roundN(55.549, 1)).toEqual(55.5);
    expect(roundN(-55.55, 1)).toEqual(-55.6);
    expect(roundN(-55.549, 1)).toEqual(-55.5);
    expect(roundN(1.005, 2)).toEqual(1.01);
    expect(roundN(-1.005, 2)).toEqual(-1.01);

    expect(roundN(1.2, 1, 5)).toEqual(1);
    expect(roundN(-1.2, 1, 5)).toEqual(-1);
    expect(roundN(1.3, 1, 5)).toEqual(1.5);
    expect(roundN(-1.3, 1, 5)).toEqual(-1.5);
    expect(roundN(1.7, 1, 5)).toEqual(1.5);
    expect(roundN(-1.7, 1, 5)).toEqual(-1.5);
    expect(roundN(1.8, 1, 5)).toEqual(2);
    expect(roundN(-1.8, 1, 5)).toEqual(-2);
    expect(roundN(3.641, 2, 5)).toEqual(3.65);
    expect(roundN(-3.641, 2, 5)).toEqual(-3.65);
    expect(roundN(0.3337799, 2, 5)).toEqual(0.35);
  });
});
