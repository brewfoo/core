import * as Fixture from '../profile.fixtures';
import { LimeTreatment } from './lime';
import { Mass, MassUnit } from '../../quantity/mass';
import { Volume } from '../../quantity/volume';
import { WaterProfile } from '../profile';

describe('LimeTreatment', () => {
  it('should calculate maximum addition (as ppm)', () => {
    // 163 mg/L x 20 L = 3,260 mg
    expect(LimeTreatment.maximum(Fixture.MuswellHill)).toBeCloseTo(163.0, 1);
  });

  it('should reduce alkalinity', () => {
    const profile = Fixture.MuswellHill.clone();
    const treatment = new LimeTreatment(new Mass(MassUnit.Gram, 3.2));
    treatment.transform(profile, Volume.liter(20));
    expect(profile.round()).toMatchObject({
      alkalinity: 3,
      bicarbonate: 4,
      calcium: 21,
    });
  });

  it('may raise alkalinity through excess', () => {
    const profile = Fixture.MuswellHill.clone();
    const treatment = new LimeTreatment(new Mass(MassUnit.Gram, 4.6));
    treatment.transform(profile, Volume.liter(20));
    expect(profile.round()).toMatchObject({
      alkalinity: 89,
      bicarbonate: 110,
      calcium: 56,
    });
  });

  it('should be capped by calcium levels', () => {
    // Extreme profile: low calcium, high alkalinity
    const profile = new WaterProfile({
      calcium: 10,
      magnesium: 30,
      sodium: 40,
      sulphate: 10,
      chloride: 15,
      bicarbonate: 250,
    });
    expect(profile.round()).toMatchObject({
      alkalinity: 207,
      bicarbonate: 250,
      calcium: 10,
    });
    // 19.4 mg/L x 20 L = 388 mg
    expect(LimeTreatment.maximum(profile)).toBeCloseTo(19.4, 1);

    const treatment = new LimeTreatment(new Mass(MassUnit.Gram, 1.0));
    treatment.transform(profile, Volume.liter(20));
    expect(profile.round()).toMatchObject({
      alkalinity: 182,
      bicarbonate: 220,
      calcium: 0,
    });
  });
});
