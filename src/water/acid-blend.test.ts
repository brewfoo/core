import { AcidBlend, AcidBlendType } from './acid-blend';

describe('AcidBlend', () => {
  const crs = new AcidBlend(AcidBlendType.CRS);

  it('should assign a name', () => {
    expect(crs.name).toEqual('CRS');
  });
});
