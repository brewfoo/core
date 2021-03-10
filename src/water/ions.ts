/**
 * Water Ion.
 */
export interface Ion {
  /**
   * Attribute name.
   */
  name?: 'calcium' | 'magnesium' | 'sodium' | 'sulphate' | 'chloride';

  /**
   * Chemical formula.
   */
  formula: string;

  /**
   * Molar mass (g/mol).
   */
  mm: number;

  /**
   * Equivalent weight.
   */
  eW: number;
}

/**
 * Calcium.
 */
export const Calcium: Ion = {
  name: 'calcium',
  formula: 'Ca²⁺',
  mm: 40.078,
  eW: 20.039,
};

/**
 * Magnesium.
 */
export const Magnesium: Ion = {
  name: 'magnesium',
  formula: 'Mg²⁺',
  mm: 24.305,
  eW: 12.1525,
};

/**
 * Sodium.
 */
export const Sodium: Ion = {
  name: 'sodium',
  formula: 'Na⁺',
  mm: 22.99,
  eW: 22.99,
};

/**
 * Sulphate.
 */
export const Sulphate: Ion = {
  name: 'sulphate',
  formula: 'SO₄²⁻',
  mm: 96.06,
  eW: 48.03,
};

/**
 * Chloride.
 */
export const Chloride: Ion = {
  name: 'chloride',
  formula: 'Cl⁻',
  mm: 35.453,
  eW: 35.453,
};

/**
 * Calcium carbonate.
 */
export const CalciumCarbonate: Ion = {
  formula: 'CaCO₃',
  mm: 100.087,
  eW: 50.0435,
};

/**
 * Bicarbonate.
 */
export const Bicarbonate: Ion = {
  formula: 'HCO₃⁻',
  mm: 61.017,
  eW: 61.017,
};

/**
 * Carbonic acid.
 */
export const CarbonicAcid: Ion = {
  formula: 'H₂CO₃⁻',
  mm: 62.03,
  eW: 62.03,
};

/**
 * Carbonate.
 */
export const Carbonate: Ion = {
  formula: 'CO₃²⁻',
  mm: 60.01,
  eW: 60.01,
};
