import { Acid, AcidType } from './acid';
import { Volume } from '../quantity/volume';
import { Mass } from '../quantity/mass';

describe('Acid', () => {
  const acetic = new Acid(AcidType.Acetic);
  const ascorbic = new Acid(AcidType.Ascorbic);
  const citric = new Acid(AcidType.Citric);
  const lactic = new Acid(AcidType.Lactic);
  const hydrochloric = new Acid(AcidType.Hydrochloric);
  const phosphoric = new Acid(AcidType.Phosphoric);
  const sulfuric = new Acid(AcidType.Sulfuric);
  const tartaric = new Acid(AcidType.Tartaric);

  it('should calculate strength', () => {
    expect(acetic.strength(5.5)).toBeCloseTo(0.846, 3);
    expect(citric.strength(5.5)).toBeCloseTo(1.955, 3);
    expect(lactic.strength(5.5)).toBeCloseTo(0.978, 3);
    expect(hydrochloric.strength(5.5)).toBeCloseTo(1.0, 3);
    expect(sulfuric.strength(5.5)).toBeCloseTo(2.0, 3);
    expect(phosphoric.strength(5.5)).toBeCloseTo(1.019, 3);
  });

  it('should estimate solution mass', () => {
    // 191ml H₂SO₄ ~  @ 40% ~ 100g
    const sol1 = { volume: Volume.liter(0.191), concentration: 40 };
    expect(sulfuric.mass(sol1).g()).toBeCloseTo(100.2, 1);

    // 105ml C₃H₆O₃ @ 80% ~ 100g
    const sol2 = { volume: Volume.liter(0.105), concentration: 80 };
    expect(lactic.mass(sol2).g()).toBeCloseTo(100.1, 1);
  });

  it('should estimate solution normality', () => {
    // 100g H₂SO₄ in 12L ~ 0.17N (https://www.wikihow.com/Calculate-Normality)
    expect(sulfuric.normality(Mass.kg(0.1), Volume.liter(12))).toBeCloseTo(0.17, 2);

    // 100g C₃H₆O₃ in 100L ~ 0.01N
    expect(lactic.normality(Mass.kg(0.1), Volume.liter(100))).toBeCloseTo(0.01, 2);

    // 36.5g HCl in 1L ~ 1.0N
    expect(hydrochloric.normality(Mass.kg(0.0365), Volume.liter(1))).toBeCloseTo(1.0, 2);
  });

  it('should estimate density', () => {
    expect(acetic.density(20).kgPerLiter()).toBeCloseTo(1.01, 3);
    expect(acetic.density(50).kgPerLiter()).toBeCloseTo(1.025, 3);
    expect(acetic.density(100).kgPerLiter()).toBeCloseTo(1.049, 3);

    expect(ascorbic.density(20).kgPerLiter()).toBeCloseTo(1.139, 3);
    expect(ascorbic.density(50).kgPerLiter()).toBeCloseTo(1.347, 3);
    expect(ascorbic.density(100).kgPerLiter()).toBeCloseTo(1.694, 3);

    expect(citric.density(20).kgPerLiter()).toBeCloseTo(1.133, 3);
    expect(citric.density(50).kgPerLiter()).toBeCloseTo(1.333, 3);
    expect(citric.density(100).kgPerLiter()).toBeCloseTo(1.665, 3);

    expect(hydrochloric.density(10).kgPerLiter()).toBeCloseTo(1.05, 3);
    expect(hydrochloric.density(20).kgPerLiter()).toBeCloseTo(1.1, 3);
    expect(hydrochloric.density(30).kgPerLiter()).toBeCloseTo(1.149, 3);
    expect(hydrochloric.density(36).kgPerLiter()).toBeCloseTo(1.179, 3);
    expect(hydrochloric.density(38).kgPerLiter()).toBeCloseTo(1.189, 3);

    expect(lactic.density(80).kgPerLiter()).toBeCloseTo(1.191, 3);
    expect(lactic.density(88).kgPerLiter()).toBeCloseTo(1.21, 3);

    expect(phosphoric.density(10).kgPerLiter()).toBeCloseTo(1.065, 3);
    expect(phosphoric.density(25).kgPerLiter()).toBeCloseTo(1.17, 3);
    expect(phosphoric.density(75).kgPerLiter()).toBeCloseTo(1.575, 3);

    expect(sulfuric.density(10).kgPerLiter()).toBeCloseTo(1.092, 3);
    expect(sulfuric.density(50).kgPerLiter()).toBeCloseTo(1.406, 3);
    expect(sulfuric.density(92).kgPerLiter()).toBeCloseTo(1.863, 3);

    expect(tartaric.density(10).kgPerLiter()).toBeCloseTo(1.049, 3);
    expect(tartaric.density(20).kgPerLiter()).toBeCloseTo(1.098, 3);
    expect(tartaric.density(40).kgPerLiter()).toBeCloseTo(1.196, 3);
  });
});
