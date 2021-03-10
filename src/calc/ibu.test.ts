import { Mass } from '../quantity/mass';
import { Volume } from '../quantity/volume';
import { IBUCalc } from './ibu';

describe('IBUCalc', () => {
  const u15 = new IBUCalc({
    mass: Mass.kg(0.0425),
    alpha: 6.4,
    batchVolume: Volume.liter(20),
    utilization: 15,
  });
  const u10 = new IBUCalc({
    mass: Mass.kg(0.06),
    alpha: 10.0,
    batchVolume: Volume.liter(20),
    utilization: 10,
  });
  const u05 = new IBUCalc({
    mass: Mass.kg(0.03),
    alpha: 12.0,
    batchVolume: Volume.liter(20),
    utilization: 5,
  });

  it('should calculate alpha mass', () => {
    expect(u15.alphaMass.g()).toBeCloseTo(2.7, 1);
    expect(u10.alphaMass.g()).toBeCloseTo(6.0, 1);
    expect(u05.alphaMass.g()).toBeCloseTo(3.6, 1);
  });

  it('should calculate IBU', () => {
    expect(u15.IBU).toBeCloseTo(20.4, 1);
    expect(u10.IBU).toBeCloseTo(30.0, 1);
    expect(u05.IBU).toBeCloseTo(9.0, 1);
  });
});
