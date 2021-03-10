import { WaterProfile } from './profile';
import * as Fixture from './profile.fixtures';
import { Mass, MassUnit } from '../quantity/mass';
import { Volume, VolumeUnit } from '../quantity/volume';
import { Acid } from './acid';
import { Salt } from './salt';
import { BoilTreatment } from './treatment/boil';
import { SaltTreatment } from './treatment/salt';
import { DilutionTreatment } from './treatment/dilution';
import { AcidTreatment } from './treatment/acid';

describe('WaterProfile', () => {
  const RO = new WaterProfile();

  it('should init from fragment', () => {
    expect(new WaterProfile()).toEqual({
      alkalinity: 0,
      bicarbonate: 0,
      calcium: 0,
      chloride: 0,
      magnesium: 0,
      pH: 8,
      sodium: 0,
      sulphate: 0,
    });

    expect(
      new WaterProfile({
        calcium: 230,
        magnesium: 15,
        sodium: 40,
        sulphate: 330,
        chloride: 130,
        alkalinity: 200,
        pH: 7.5,
      }),
    ).toEqual({
      alkalinity: 200,
      bicarbonate: 244,
      calcium: 230,
      chloride: 130,
      magnesium: 15,
      pH: 7.5,
      sodium: 40,
      sulphate: 330,
    });
  });

  it('should calculate total hardness', () => {
    expect(RO.hardness()).toEqual(0);
    expect(Fixture.London.hardness()).toEqual(200);
    expect(Fixture.Vienna.hardness()).toEqual(249);
    expect(Fixture.Dortmund.hardness()).toEqual(636);
    expect(Fixture.Munich.hardness()).toEqual(262);
    expect(Fixture.Dublin.hardness()).toEqual(316);
    expect(Fixture.MuswellHill.hardness()).toEqual(270);
  });

  it('should calculate RA', () => {
    expect(RO.RA()).toEqual(0);
    expect(Fixture.London.RA()).toEqual(82);
    expect(Fixture.Vienna.RA()).toEqual(122);
    expect(Fixture.Dortmund.RA()).toEqual(20);
    expect(Fixture.Munich.RA()).toEqual(177);
    expect(Fixture.Dublin.RA()).toEqual(170);
    expect(Fixture.MuswellHill.RA()).toEqual(126);
  });

  it('should calculate sulphate-to-chloride ratio', () => {
    expect(RO.ratio()).toEqual(1.0);
    expect(Fixture.London.ratio()).toEqual(1.05);
    expect(Fixture.Vienna.ratio()).toEqual(4.0);
    expect(Fixture.Dortmund.ratio()).toEqual(2.54);
    expect(Fixture.Munich.ratio()).toEqual(2.25);
    expect(Fixture.Dublin.ratio()).toEqual(2.89);
    expect(Fixture.MuswellHill.ratio()).toEqual(1.0);
  });

  it('should calculate cation concentrations', () => {
    expect(RO.cation()).toEqual(0.0);
    expect(Fixture.London.cation()).toEqual(4.6);
    expect(Fixture.Vienna.cation()).toEqual(5.4);
    expect(Fixture.Dortmund.cation()).toEqual(14.5);
    expect(Fixture.Munich.cation()).toEqual(5.4);
    expect(Fixture.Dublin.cation()).toEqual(6.8);
    expect(Fixture.MuswellHill.cation()).toEqual(6.7);
  });

  it('should calculate anion concentrations', () => {
    expect(RO.anion()).toEqual(0.0);
    expect(Fixture.London.anion()).toEqual(4.6);
    expect(Fixture.Vienna.anion()).toEqual(5.4);
    expect(Fixture.Dortmund.anion()).toEqual(14.4);
    expect(Fixture.Munich.anion()).toEqual(5.4);
    expect(Fixture.Dublin.anion()).toEqual(6.8);
    expect(Fixture.MuswellHill.anion()).toEqual(6.5);
  });

  describe('treatment', () => {
    const source = Fixture.MuswellHill;

    it('should apply treatments (boil)', () => {
      const result = source.treat(Volume.liter(20), [
        new BoilTreatment(),
        new SaltTreatment(Salt.CalciumChloride, new Mass(MassUnit.Gram, 2)),
        new SaltTreatment(Salt.MagnesiumSulphate, new Mass(MassUnit.Gram, 3)),
      ]);
      expect(result).toEqual({
        alkalinity: 60,
        bicarbonate: 74,
        calcium: 71,
        chloride: 98,
        magnesium: 20,
        pH: 7.7,
        sodium: 30,
        sulphate: 108,
      });
      expect(result.RA()).toEqual(-2);
    });

    it('should apply steps (dilution + acidify)', () => {
      const result = source.treat(Volume.liter(20), [
        new DilutionTreatment(10),
        new SaltTreatment(Salt.CalciumChloride, new Mass(MassUnit.Gram, 3)),
        new SaltTreatment(Salt.CalciumSulphate, new Mass(MassUnit.Gram, 3)),
        new AcidTreatment(Acid.Lactic, {
          volume: new Volume(VolumeUnit.Milliliter, 2),
          concentration: 88,
        }),
      ]);
      expect(result).toEqual({
        alkalinity: 122,
        bicarbonate: 150,
        calcium: 166,
        chloride: 117,
        magnesium: 5,
        pH: 7.7,
        sodium: 27,
        sulphate: 129,
      });
      expect(result.RA()).toEqual(0);
    });
  });
});
