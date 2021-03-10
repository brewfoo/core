import { WaterProfile } from '../profile';
import * as Fixture from '../profile.fixtures';

import { DilutionTreatment } from './dilution';

describe('SaltTreatment', () => {
  let subject: DilutionTreatment;
  let fixture: WaterProfile;

  beforeEach(() => {
    subject = new DilutionTreatment(20, Fixture.Vienna.clone());
    fixture = Fixture.MuswellHill.clone();
  });

  it('should update concentrations and alkalinity', () => {
    subject.transform(fixture);
    expect(fixture.round()).toEqual({
      alkalinity: 197,
      bicarbonate: 241,
      calcium: 95,
      chloride: 43,
      magnesium: 7,
      pH: 7.7,
      sodium: 26,
      sulphate: 52,
    });
  });

  it('should default to RO water', () => {
    subject = new DilutionTreatment(20);
    subject.transform(fixture);
    expect(fixture.round()).toEqual({
      alkalinity: 160,
      bicarbonate: 196,
      calcium: 80,
      chloride: 40,
      magnesium: 4,
      pH: 7.7,
      sodium: 24,
      sulphate: 40,
    });
  });
});
