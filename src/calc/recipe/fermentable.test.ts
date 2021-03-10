import { Fermentable } from './fermentable';
import { Volume } from '../../quantity/volume';
import { ExtractYield } from '../../quantity/extract-yield';
import { ColorUnit, Color } from '../../quantity/color';
import { Mass } from '../../quantity/mass';

describe('Fermentable', () => {
  const batchVolume = Volume.liter(20);

  const pale = new Fermentable({
    mass: Mass.kg(3),
    color: new Color(ColorUnit.Lovibond, 3),
    extraction: ExtractYield.percent(80),
    isGrain: true,
  });
  const black = new Fermentable({
    mass: Mass.kg(0.4),
    extraction: ExtractYield.percent(60),
    color: new Color(ColorUnit.Lovibond, 500),
    isGrain: true,
  });
  const lactose = new Fermentable({
    mass: Mass.kg(1),
    color: new Color(ColorUnit.Lovibond, 1),
    extraction: ExtractYield.percent(90),
    attenuation: 0,
  });
  const molasses = new Fermentable({
    mass: Mass.kg(1),
    color: new Color(ColorUnit.Lovibond, 80),
    extraction: ExtractYield.percent(80),
    attenuation: 40,
  });
  const syrup = new Fermentable({
    mass: Mass.kg(1),
    color: new Color(ColorUnit.Lovibond, 1),
    extraction: ExtractYield.percent(80),
    attenuation: 100,
    lateAddition: true,
  });

  it('should calculate BG', () => {
    const vol = Volume.liter(24);

    expect(pale.BG(vol, 75).SG()).toBeCloseTo(1.03, 3);
    expect(black.BG(vol, 75).SG()).toBeCloseTo(1.003, 3);
    expect(lactose.BG(vol, 75).SG()).toBeCloseTo(1.015, 3);
    expect(molasses.BG(vol, 75).SG()).toBeCloseTo(1.013, 3);
    expect(syrup.BG(vol, 75).SG()).toBeCloseTo(1.0, 3);
  });

  it('should calculate OG', () => {
    expect(pale.OG(batchVolume, 75).SG()).toBeCloseTo(1.036, 3);
    expect(pale.OG(batchVolume, 85).SG()).toBeCloseTo(1.041, 3);

    expect(black.OG(batchVolume, 75).SG()).toBeCloseTo(1.003, 3);
    expect(black.OG(batchVolume, 85).SG()).toBeCloseTo(1.004, 3);

    expect(lactose.OG(batchVolume, 75).SG()).toBeCloseTo(1.018, 3);
    expect(lactose.OG(batchVolume, 85).SG()).toBeCloseTo(1.018, 3);

    expect(molasses.OG(batchVolume, 75).SG()).toBeCloseTo(1.016, 3);
    expect(molasses.OG(batchVolume, 85).SG()).toBeCloseTo(1.016, 3);

    expect(syrup.OG(batchVolume, 75).SG()).toBeCloseTo(1.016, 3);
    expect(syrup.OG(batchVolume, 85).SG()).toBeCloseTo(1.016, 3);
  });

  it('should calculate FG', () => {
    expect(pale.FG(batchVolume, 75, 78).SG()).toBeCloseTo(1.008, 3);
    expect(pale.FG(batchVolume, 85, 68).SG()).toBeCloseTo(1.013, 3);

    expect(black.FG(batchVolume, 75, 78).SG()).toBeCloseTo(1.0008, 4);
    expect(black.FG(batchVolume, 85, 68).SG()).toBeCloseTo(1.0013, 4);

    expect(lactose.FG(batchVolume, 75, 78).SG()).toBeCloseTo(1.018, 3);
    expect(lactose.FG(batchVolume, 85, 68).SG()).toBeCloseTo(1.018, 3);

    expect(molasses.FG(batchVolume, 75, 78).SG()).toBeCloseTo(1.009, 3);
    expect(molasses.FG(batchVolume, 85, 68).SG()).toBeCloseTo(1.009, 3);

    expect(syrup.FG(batchVolume, 75, 78).SG()).toBeCloseTo(1.0, 3);
    expect(syrup.FG(batchVolume, 85, 68).SG()).toBeCloseTo(1.0, 3);
  });

  it('should calculate MCU', () => {
    expect(pale.MCU(batchVolume)).toBeCloseTo(3.8, 1);
    expect(black.MCU(batchVolume)).toBeCloseTo(83.5, 1);
    expect(lactose.MCU(batchVolume)).toBeCloseTo(0.42, 1);
    expect(molasses.MCU(batchVolume)).toBeCloseTo(33.4, 1);
    expect(syrup.MCU(batchVolume)).toBeCloseTo(0.41, 1);
  });
});
