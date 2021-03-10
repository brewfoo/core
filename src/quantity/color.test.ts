import { Color, ColorUnit } from './color';

const EBC = ColorUnit.EBC;
const SRM = ColorUnit.SRM;
const LVB = ColorUnit.Lovibond;

describe('Color', () => {
  let subject: Color;

  beforeEach(() => {
    subject = new Color(EBC, 16);
  });

  it('should init', () => {
    expect(new Color(EBC, -1).EBC()).toEqual(0.0);
    expect(new Color(LVB, 60).EBC()).toBeCloseTo(158.5, 1);
    expect(new Color(SRM, 26).EBC()).toBeCloseTo(51.2, 1);
    expect(new Color(SRM, 36).EBC()).toBeCloseTo(70.9, 1);
  });

  it('should convert', () => {
    expect(subject.convert(LVB)).toBeCloseTo(6.6, 1);
    expect(subject.convert(SRM)).toBeCloseTo(8.1, 1);

    expect(new Color(EBC, 20).convert(LVB)).toBeCloseTo(8.1, 1);
    expect(new Color(EBC, 160).convert(LVB)).toBeCloseTo(60.6, 1);
    expect(new Color(EBC, 500).convert(LVB)).toBeCloseTo(188.1, 1);
    expect(new Color(EBC, 40).convert(SRM)).toBeCloseTo(20.3, 1);
    expect(new Color(EBC, 60).convert(SRM)).toBeCloseTo(30.5, 1);
  });

  it('should belong to a group', () => {
    expect(new Color(EBC, 2).group().ebc).toEqual(4);
    expect(new Color(EBC, 5).group().ebc).toEqual(6);
    expect(new Color(EBC, 30).group().ebc).toEqual(30);
    expect(new Color(EBC, 50).group().ebc).toEqual(48);
    expect(new Color(EBC, 56).group().ebc).toEqual(60);
    expect(new Color(EBC, 72).group().ebc).toEqual(80);
    expect(new Color(EBC, 120).group().ebc).toEqual(100);
  });
});
