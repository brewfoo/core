# Brewfoo Core

The aim of this project is to be the **most comprehensive** and **most accurate**
and **fully free** collection of core brewing formulae, calculations and conversions
written specifically for the web in [TypeScript](https://www.typescriptlang.org/).

## Features

- Basic quantity and unit conversions.
- Collection of formulae and calculations.
- Full recipe planning tool.
- Water profile and treatment calculations.

Please see [TypeDoc](http://brewfoo.github.io/core) for API documentation.

## Examples

Simple quantities & conversions:

```ts
import { Mass, MassUnit, Temperature, TemperatureUnit, Volume, VolumeUnit } from '@brewfoo/core';

const mass = new Mass(MassUnit.Kilogram, 3.5);
mass.convert(MassUnit.Gram); // => 3500
mass.convert(MassUnit.USPound); // => ~7.7
mass.convert(MassUnit.USOunce); // => ~123.5

const vol = new Volume(VolumeUnit.Liter, 20);
vol.convert(VolumeUnit.USGallon); // => 5.3

const temp = new Temperature(TemperatureUnit.Celsius, 19);
temp.convert(TemperatureUnit.Fahrenheit); // => 66.2
```

Fermentation calculation:

```ts
const calc = new FermentationCalc(
  new Gravity(GravityUnit.SG, 1.07),
  new Gravity(GravityUnit.SG, 1.015),
);
calc.AA; // => ~77.6%
calc.RA; // => ~62.7%
calc.ABV; // => ~7.24%
calc.ABW.g(); // => ~5.67
calc.energy.kcal(); // => ~65.07
```

IBU calculations:

```ts
const util = new UtilizationCalc({
  wortGravity: Gravity.points(60),
  batchVolume: Volume.liter(20),
  boilTime: Duration.minutes(50),
  standTime: Duration.minutes(10),
});
util.rager(); // => ~28.9
util.tinseth(); // => ~20.8

const calc = new IBUCalc({
  mass: Mass.kg(0.06),
  alpha: 10.0,
  batchVolume: Volume.liter(20),
  utilization: 10,
});
calc.alphaMass.g(); // => ~6.0
calc.IBU; // => ~30.0
```

Simple recipe:

```ts
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

const magnum = new Hop({
  boilTime: Duration.minutes(60),
  mass: new Mass(MassUnit.Gram, 10),
  alpha: 13.8,
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

const recipe = new RecipeCalc({
  attenuation: 78,
  fermentables: [pale, crystal],
  hops: [magnum, simcoe, citra],
});

recipe.BG.SG(); // => ~1.031
recipe.OG.SG(); // => ~1.040
recipe.FG.SG(); // => ~1.009
recipe.beerColor.convert(ColorUnit.SRM); // => ~13.1
recipe.IBU; // => ~29.5
recipe.BUGU; // => ~0.74
recipe.ABV; // => ~4.1
recipe.ABW.g(); // => ~3.2
recipe.energy.kcal(); // => ~37
recipe.DP.lintner(); // => ~52.9

recipe.waterUsage.boilVolume.L(); // => ~25.3
recipe.waterUsage.totalVolume.L(); // => ~29.7
recipe.postBoilAddition = Volume.liter(6);
recipe.waterUsage.boilVolume.L(); // => ~19.1
recipe.waterUsage.totalVolume.L(); // => ~23.5
```

Water profiles and treatment:

```ts
// Create profile
const london = new WaterProfile({
  calcium: 100,
  magnesium: 5,
  sodium: 30,
  sulphate: 50,
  chloride: 50,
  bicarbonate: 245,
  alkalinity: 200,
  pH: 7.7,
});
london.hardness(); // => 270
london.RA(); // => 126
london.ratio(); // => 1.0
london.cation(); // => 6.7
london.anion(); // => 6.5

// Apply treatments
const treated = london.treat(Volume.liter(20), [
  new DilutionTreatment(10),
  new SaltTreatment(Salt.CalciumChloride, new Mass(MassUnit.Gram, 3)),
  new SaltTreatment(Salt.CalciumSulphate, new Mass(MassUnit.Gram, 3)),
  new AcidTreatment(Acid.Lactic, {
    volume: new Volume(VolumeUnit.Milliliter, 2),
    concentration: 88,
  }),
]); // => { alkalinity: 122, bicarbonate: 150, calcium: 166, chloride: 117, magnesium: 5, pH: 7.7, sodium: 27, sulphate: 129 }
treated.RA(); // => ~0.0
```

## Licence

Licensed under [LGPLv3](./COPYING)
