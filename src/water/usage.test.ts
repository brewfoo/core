import { WaterUsage } from './usage';
import { Volume } from '../quantity/volume';
import { Mass } from '../quantity/mass';
import { SpecificVolume } from '../quantity/specific-volume';
import { Temperature } from '../quantity/temperature';
import { Duration } from '../quantity/duration';

describe('WaterUsage', () => {
  it('should calculate (classic)', () => {
    const subject = new WaterUsage({
      batchVolume: Volume.liter(20),
      boilTime: Duration.minutes(60),
      mashTunLoss: Volume.liter(1),
      evaporation: Volume.liter(4),
      absorption: SpecificVolume.literPerKg(1),
      kettleLoss: Volume.liter(0.5),
      ambientTemperature: Temperature.celsius(20),
      grainMass: Mass.kg(4),
    });
    expect(subject.shrinkageLoss.L()).toBeCloseTo(0.8, 1);
    expect(subject.evaporationLoss.L()).toBeCloseTo(4.0, 1);
    expect(subject.boilVolume.L()).toBeCloseTo(25.3, 1);
    expect(subject.absorptionLoss.L()).toBeCloseTo(4.0, 1);
    expect(subject.totalVolume.L()).toBeCloseTo(30.3, 1);
    expect(subject.mashTunLoss.L()).toBeCloseTo(1.0, 1);
    expect(subject.kettleLoss.L()).toBeCloseTo(0.5, 1);
    expect(subject.postBoilAddition.L()).toBeCloseTo(0.0, 1);
  });

  it('should calculate (other)', () => {
    const subject = new WaterUsage({
      batchVolume: Volume.liter(5),
      boilTime: Duration.minutes(30),
      mashTunLoss: Volume.liter(0.2),
      evaporation: Volume.liter(2),
      absorption: SpecificVolume.literPerKg(0.5),
      kettleLoss: Volume.liter(1),
      ambientTemperature: Temperature.celsius(20),
      postBoilAddition: Volume.liter(0.8),
      grainMass: Mass.kg(1.2),
    });

    expect(subject.shrinkageLoss.L()).toBeCloseTo(0.2, 1);
    expect(subject.evaporationLoss.L()).toBeCloseTo(1.0, 1);
    expect(subject.boilVolume.L()).toBeCloseTo(6.4, 1);
    expect(subject.absorptionLoss.L()).toBeCloseTo(0.6, 1);
    expect(subject.totalVolume.L()).toBeCloseTo(7.2, 1);
  });
});
