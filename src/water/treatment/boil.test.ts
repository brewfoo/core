import * as Fixture from '../profile.fixtures';
import { BoilTreatment } from './boil';
import { WaterProfile } from '../profile';

describe('BoilTreatment', () => {
  let subject: BoilTreatment;

  beforeEach(() => {
    subject = new BoilTreatment();
  });

  it('should reduce to min alkalinity level', () => {
    const profile1 = Fixture.MuswellHill.clone();
    subject.transform(profile1);
    expect(profile1.round()).toMatchObject({
      alkalinity: 60,
      bicarbonate: 74,
      calcium: 44,
    });

    const profile2 = Fixture.Vienna.clone();
    subject.transform(profile2);
    expect(profile2.round()).toMatchObject({
      alkalinity: 60,
      bicarbonate: 74,
      calcium: 25,
    });
  });

  it('should reduce to min calcium level', () => {
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

    subject.transform(profile);
    expect(profile.round()).toMatchObject({
      alkalinity: 182,
      bicarbonate: 220,
      calcium: 0,
    });
  });

  it('should NOT reduce alkalinity (Pilsen)', () => {
    const profile = Fixture.Pilsen.clone();
    subject.transform(profile);
    expect(profile).toEqual(Fixture.Pilsen);
  });
});
