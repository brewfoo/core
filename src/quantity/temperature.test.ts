import { Temperature, TemperatureUnit } from './temperature';

const F = TemperatureUnit.Fahrenheit;
const K = TemperatureUnit.Kelvin;

describe('Temperature', () => {
  let subject: Temperature;

  beforeEach(() => {
    subject = Temperature.celsius(19);
  });

  it('should init', () => {
    expect(new Temperature(F, 66.2).C()).toBeCloseTo(19.0, 1);
    expect(new Temperature(K, 292.16).C()).toBeCloseTo(19.0, 1);
  });

  it('should convert', () => {
    expect(subject.convert(F)).toBeCloseTo(66.2, 1);
    expect(subject.convert(K)).toBeCloseTo(292.15, 2);
  });
});
