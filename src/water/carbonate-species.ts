/**
 * Carbonate species is the estimation of molar fractions of
 * carbonate species in water given a certain pH.
 */
export class CarbonateSpecies {
  /**
   * Molar fraction of carbonic acid in solution.
   */
  carbonicAcid: number;

  /**
   * Molar fraction of bicarbonate in solution.
   */
  bicarbonate: number;

  /**
   * Molar fraction of carbonate in solution.
   */
  carbonate: number;

  /**
   * @param pH the water pH value.
   */
  constructor(pH: number) {
    const r1 = Math.pow(10, pH - 6.38);
    const r2 = Math.pow(10, pH - 10.373);
    this.carbonicAcid = 1.0 / (1.0 + r1 + r1 * r2);
    this.bicarbonate = this.carbonicAcid * r1;
    this.carbonate = this.bicarbonate * r2;
  }
}
