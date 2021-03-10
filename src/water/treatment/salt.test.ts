import { WaterProfile } from '../profile';
import { Salt } from '../salt';
import { SaltTreatment } from './salt';
import * as Fixture from '../profile.fixtures';
import { Mass, MassUnit } from '../../quantity/mass';
import { Volume } from '../../quantity/volume';

describe('SaltTreatment', () => {
  const CaCl2 = new SaltTreatment(Salt.CalciumChloride, new Mass(MassUnit.Gram, 5));
  const NaHCO3 = new SaltTreatment(Salt.SodiumBicarbonate, new Mass(MassUnit.Gram, 5));
  let fixture: WaterProfile;

  beforeEach(() => {
    fixture = Fixture.MuswellHill.clone();
  });

  it('should update concentrations', () => {
    CaCl2.transform(fixture, Volume.liter(20));
    expect(fixture.round()).toEqual({
      alkalinity: 200,
      bicarbonate: 245,
      calcium: 168,
      chloride: 171,
      magnesium: 5,
      pH: 7.7,
      sodium: 30,
      sulphate: 50,
    });
  });

  it('should update alkalinity', () => {
    NaHCO3.transform(fixture, Volume.liter(20));
    expect(fixture.round()).toEqual({
      alkalinity: 349,
      bicarbonate: 427,
      calcium: 100,
      chloride: 50,
      magnesium: 5,
      pH: 7.7,
      sodium: 99,
      sulphate: 50,
    });
  });

  it('should account for volumes', () => {
    CaCl2.transform(fixture, Volume.liter(40));
    expect(fixture.round()).toEqual({
      alkalinity: 200,
      bicarbonate: 245,
      calcium: 134,
      chloride: 110,
      magnesium: 5,
      pH: 7.7,
      sodium: 30,
      sulphate: 50,
    });
  });
});
