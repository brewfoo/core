import { Color, ColorUnit } from '../../quantity/color';
import { ExtractYield } from '../../quantity/extract-yield';
import { DiastaticPower } from '../../quantity/diastatic-power';
import { Mass, MassUnit } from '../../quantity/mass';
import { Volume } from '../../quantity/volume';
import { RecipeCalc } from '.';
import { Fermentable } from './fermentable';
import { Hop } from './hop';
import { BeerColorFormula } from '../beer-color';
import { IBUFormula } from '../ibu';
import { WaterUsage } from '../../water/usage';
import { Duration } from '../../quantity/duration';

describe('RecipeCalc', () => {
  let subject: RecipeCalc;

  const pale = new Fermentable({
    mass: Mass.kg(3.0),
    color: new Color(ColorUnit.Lovibond, 3),
    power: DiastaticPower.lintner(60),
    extraction: ExtractYield.percent(80),
    isGrain: true,
  });
  const crystal = new Fermentable({
    mass: Mass.kg(0.4),
    color: new Color(ColorUnit.Lovibond, 120),
    extraction: ExtractYield.percent(70),
    isGrain: true,
  });
  const brown = new Fermentable({
    mass: Mass.kg(0.4),
    color: new Color(ColorUnit.Lovibond, 160),
    extraction: ExtractYield.percent(70),
    isGrain: true,
  });
  const black = new Fermentable({
    mass: Mass.kg(0.4),
    color: new Color(ColorUnit.Lovibond, 500),
    extraction: ExtractYield.percent(60),
    isGrain: true,
  });
  const oats = new Fermentable({
    mass: Mass.kg(0.4),
    color: new Color(ColorUnit.Lovibond, 1),
    extraction: ExtractYield.percent(70),
    isGrain: true,
  });
  const lactose = new Fermentable({
    mass: Mass.kg(0.4),
    color: new Color(ColorUnit.Lovibond, 1),
    extraction: ExtractYield.percent(90),
    attenuation: 0,
  });
  const syrup = new Fermentable({
    mass: Mass.kg(3.0),
    color: new Color(ColorUnit.Lovibond, 1),
    extraction: ExtractYield.percent(80),
    attenuation: 100,
    lateAddition: true,
  });

  const magnum = new Hop({
    boilTime: Duration.minutes(60),
    mass: new Mass(MassUnit.Gram, 10),
    alpha: 13.8,
    multiplier: 1.1,
  });
  const cascade = new Hop({
    boilTime: Duration.minutes(20),
    mass: new Mass(MassUnit.Gram, 20),
    alpha: 6.7,
    multiplier: 1.1,
  });
  const simcoe = new Hop({
    boilTime: Duration.minutes(5),
    mass: new Mass(MassUnit.Gram, 30),
    alpha: 11.3,
  });
  const citra = new Hop({
    mass: new Mass(MassUnit.Gram, 60),
    alpha: 12.0,
  });

  beforeEach(() => {
    subject = new RecipeCalc({
      attenuation: 78,
      fermentables: [pale, crystal],
      hops: [magnum, simcoe, citra],
    });
  });

  it('should populate', () => {
    subject = new RecipeCalc({
      fermentables: [{} as never],
      hops: [{} as never],
    });
    expect(subject.fermentables).toHaveLength(1);
    expect(subject.fermentables[0]).toBeInstanceOf(Fermentable);
    expect(subject.hops).toHaveLength(1);
    expect(subject.hops[0]).toBeInstanceOf(Hop);
  });

  it('should calculate BG', () => {
    expect(subject.BG.SG()).toBeCloseTo(1.031, 3);

    subject.reset();
    subject.fermentables = [syrup, crystal];
    expect(subject.BG.SG()).toBeCloseTo(1.003, 3);

    subject.reset();
    subject.fermentables = [pale, crystal, brown, black, oats];
    expect(subject.BG.SG()).toBeCloseTo(1.041, 3);

    subject.reset();
    subject.fermentables = [pale, crystal, brown, black, oats, lactose];
    expect(subject.BG.SG()).toBeCloseTo(1.046, 3);

    subject.reset();
    subject.postBoilAddition = Volume.liter(6);
    expect(subject.BG.SG()).toBeCloseTo(1.062, 3);
  });

  it('should calculate OG', () => {
    expect(subject.OG.SG()).toBeCloseTo(1.04, 3);

    subject.reset();
    subject.fermentables = [syrup, crystal];
    expect(subject.OG.SG()).toBeCloseTo(1.052, 3);

    subject.reset();
    subject.fermentables = [pale, crystal, brown, black, oats];
    expect(subject.OG.SG()).toBeCloseTo(1.052, 3);

    subject.reset();
    subject.fermentables = [pale, crystal, brown, black, oats, lactose];
    expect(subject.OG.SG()).toBeCloseTo(1.059, 3);
  });

  it('should calculate FG', () => {
    expect(subject.FG.SG()).toBeCloseTo(1.009, 3);

    subject.reset();
    subject.fermentables = [syrup, crystal];
    expect(subject.FG.SG()).toBeCloseTo(1.001, 3);

    subject.reset();
    subject.fermentables = [pale, crystal, brown, black, oats];
    expect(subject.FG.SG()).toBeCloseTo(1.011, 3);

    subject.reset();
    subject.fermentables = [pale, crystal, brown, black, oats, lactose];
    expect(subject.FG.SG()).toBeCloseTo(1.018, 3);
  });

  it('should calculate color', () => {
    expect(subject.beerColor.convert(ColorUnit.SRM)).toBeCloseTo(13.1, 1);
    expect(subject.calcBeerColor(BeerColorFormula.Daniels).convert(ColorUnit.SRM)).toBeCloseTo(
      13.2,
      1,
    );

    subject.reset();
    subject.fermentables = [pale, crystal, brown, black, oats];
    expect(subject.beerColor.convert(ColorUnit.SRM)).toBeCloseTo(43.0, 1);

    subject.reset();
    subject.fermentables = [pale, crystal, brown, black, oats, lactose];
    expect(subject.beerColor.convert(ColorUnit.SRM)).toBeCloseTo(43.0, 1);
  });

  it('should calculate IBU', () => {
    expect(subject.IBU).toBeCloseTo(29.5, 1);
    expect(subject.calcIBU(IBUFormula.Rager)).toBeCloseTo(33.1, 1);

    subject.reset();
    subject.fermentables = [syrup, crystal];
    expect(subject.IBU).toBeCloseTo(38.5, 1);

    subject.reset();
    subject.fermentables = [pale, crystal, brown, black, oats];
    expect(subject.IBU).toBeCloseTo(27.0, 1);

    subject.reset();
    subject.postBoilAddition = Volume.liter(6);
    expect(subject.IBU).toBeCloseTo(23.5, 1);

    subject.reset();
    subject.hops = [magnum, cascade, simcoe];
    subject.postBoilAddition = undefined;
    expect(subject.IBU).toBeCloseTo(37.7, 1);
  });

  it('should calculate BU/GU', () => {
    expect(subject.BUGU).toBeCloseTo(0.74, 2);
  });

  it('should calculate ABV/ABW/energy', () => {
    expect(subject.ABV).toBeCloseTo(4.1, 1);
    expect(subject.ABW.g()).toBeCloseTo(3.2, 1);
    expect(subject.energy.kcal()).toBeCloseTo(37, 0);
  });

  it('should calculate DP', () => {
    expect(subject.DP.lintner()).toBeCloseTo(52.9, 1);

    subject.reset();
    subject.fermentables = [syrup, crystal];
    expect(subject.DP.lintner()).toBeCloseTo(0.0, 1);

    subject.reset();
    subject.fermentables = [pale, crystal, brown, black, oats];
    expect(subject.DP.lintner()).toBeCloseTo(39.1, 1);
  });

  it('should calculate water usage', () => {
    expect(subject.waterUsage).toBeInstanceOf(WaterUsage);
    expect(subject.waterUsage.boilVolume.L()).toBeCloseTo(25.3, 1);
    expect(subject.waterUsage.totalVolume.L()).toBeCloseTo(29.7, 1);

    subject.reset();
    subject.postBoilAddition = Volume.liter(6);
    expect(subject.waterUsage.boilVolume.L()).toBeCloseTo(19.1, 1);
    expect(subject.waterUsage.totalVolume.L()).toBeCloseTo(23.5, 1);
  });
});
