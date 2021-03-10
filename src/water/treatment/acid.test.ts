import { Mass, MassUnit } from '../../quantity/mass';
import { Acid } from '../acid';
import { AcidBlend } from '../acid-blend';
import { WaterProfile } from '../profile';
import * as Fixture from '../profile.fixtures';
import { AcidTreatment } from './acid';
import { Volume, VolumeUnit } from '../../quantity/volume';

describe('AcidTreatment', () => {
  let fixture: WaterProfile;

  beforeEach(() => {
    fixture = Fixture.MuswellHill.clone();
  });

  const relevant = (): Record<string, number> => {
    fixture.round();
    return {
      alkalinity: fixture.alkalinity,
      bicarbonate: fixture.bicarbonate,
      chloride: fixture.chloride,
      sulphate: fixture.sulphate,
      RA: fixture.RA(),
    };
  };

  it('should update alkalinity (lactic)', () => {
    new AcidTreatment(Acid.Lactic, {
      volume: new Volume(VolumeUnit.Milliliter, 5),
      concentration: 88,
    }).transform(fixture, Volume.liter(20));

    expect(relevant()).toEqual({
      alkalinity: 55,
      bicarbonate: 69,
      chloride: 50,
      sulphate: 50,
      RA: -19,
    });
  });

  it('should update alkalinity (phosphoric)', () => {
    new AcidTreatment(Acid.Phosphoric, {
      volume: new Volume(VolumeUnit.Milliliter, 4),
      concentration: 75,
    }).transform(fixture, Volume.liter(20));

    expect(relevant()).toEqual({
      alkalinity: 77,
      bicarbonate: 95,
      chloride: 50,
      sulphate: 50,
      RA: 3,
    });
  });

  it('should update alkalinity (CRS)', () => {
    new AcidTreatment(AcidBlend.CRS, {
      volume: new Volume(VolumeUnit.Milliliter, 6),
      concentration: 100,
    }).transform(fixture, Volume.liter(10));

    expect(relevant()).toEqual({
      alkalinity: 88,
      bicarbonate: 108,
      chloride: 90,
      sulphate: 104,
      RA: 14,
    });
  });

  it('should maintain lower bound for bicarbonate', () => {
    fixture = Fixture.Pilsen.clone();
    new AcidTreatment(Acid.Lactic, {
      volume: new Volume(VolumeUnit.Milliliter, 3),
      concentration: 80,
    }).transform(fixture, Volume.liter(20));

    expect(relevant()).toEqual({
      alkalinity: -65,
      bicarbonate: 0,
      chloride: 6,
      sulphate: 8,
      RA: -71,
    });
  });

  it('should support volume inputs', () => {
    new AcidTreatment(Acid.Citric, {
      volume: new Volume(VolumeUnit.Milliliter, 3),
      concentration: 100,
    }).transform(fixture, Volume.liter(20));

    expect(relevant()).toEqual({
      alkalinity: 73,
      bicarbonate: 90,
      chloride: 50,
      sulphate: 50,
      RA: -1,
    });
  });

  it('should support mass inputs', () => {
    new AcidTreatment(Acid.Citric, new Mass(MassUnit.Gram, 5)).transform(fixture, Volume.liter(20));

    expect(relevant()).toEqual({
      alkalinity: 73,
      bicarbonate: 90,
      chloride: 50,
      sulphate: 50,
      RA: -1,
    });
  });

  it('should update ion concentrations (sulfuric)', () => {
    new AcidTreatment(Acid.Sulfuric, {
      volume: new Volume(VolumeUnit.Milliliter, 10),
      concentration: 20,
    }).transform(fixture, Volume.liter(20));

    expect(relevant()).toEqual({
      alkalinity: 81,
      bicarbonate: 100,
      chloride: 50,
      sulphate: 164,
      RA: 7,
    });
  });

  it('should update ion concentrations (hydrochloric)', () => {
    new AcidTreatment(Acid.Hydrochloric, {
      volume: new Volume(VolumeUnit.Milliliter, 3),
      concentration: 37,
    }).transform(fixture, Volume.liter(20));

    expect(relevant()).toEqual({
      alkalinity: 110,
      bicarbonate: 135,
      chloride: 114,
      sulphate: 50,
      RA: 36,
    });
  });
});
