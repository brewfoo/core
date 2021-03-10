import { WaterProfile } from '../profile';
import { Volume } from '../../quantity/volume';

/**
 * Abstract treatment class
 */
export abstract class WaterTreatment {
  /**
   * Transform transforms the profile inline.
   */
  abstract transform(profile: WaterProfile, volume: Volume): void;
}
