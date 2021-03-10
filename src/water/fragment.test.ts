import { WaterFragment } from './fragment';
import * as Fixture from './profile.fixtures';
import { WaterProfile } from './profile';

describe('WaterFragment', () => {
  let subject: WaterFragment;
  let attrs: WaterProfile;

  beforeEach(() => {
    attrs = Object.assign({}, Fixture.MuswellHill.clone());
  });

  it('should calculate missing data', () => {
    subject = new WaterFragment(attrs as never);
    expect(subject).toEqual({
      alkalinity: 200,
      bicarbonate: 245,
      calcium: 100,
      chloride: 50,
      hardness: 270,
      magnesium: 5,
      pH: 7.7,
      sodium: 30,
      sulphate: 50,
    });
  });

  it('should calculate calcium (from hardness)', () => {
    subject = new WaterFragment(Object.assign({}, attrs, { hardness: 270, calcium: undefined }));
    expect(subject.calcium).toEqual(100);
  });

  it('should calculate magnesium (from hardness)', () => {
    subject = new WaterFragment(Object.assign({}, attrs, { hardness: 270, magnesium: undefined }));
    expect(subject.magnesium).toEqual(5);
  });

  it('should estimate alkalinity from bicarbonate', () => {
    const clean = Object.assign({}, attrs, { alkalinity: undefined });

    subject = new WaterFragment(Object.assign({}, clean, { pH: undefined }) as never);
    expect(subject.alkalinity).toEqual(202);

    subject = new WaterFragment(Object.assign({}, clean, { pH: 6.5 }) as never);
    expect(subject.alkalinity).toEqual(201);

    subject = new WaterFragment(Object.assign({}, clean, { pH: 7.5 }) as never);
    expect(subject.alkalinity).toEqual(201);

    subject = new WaterFragment(Object.assign({}, clean, { pH: 8.5 }) as never);
    expect(subject.alkalinity).toEqual(206);
  });

  it('should estimate bicarbonate from alkalinity', () => {
    const clean = Object.assign({}, attrs, { bicarbonate: undefined });

    subject = new WaterFragment(Object.assign({}, clean, { pH: undefined }) as never);
    expect(subject.bicarbonate).toEqual(242);

    subject = new WaterFragment(Object.assign({}, clean, { pH: 6.5 }) as never);
    expect(subject.bicarbonate).toEqual(246);

    subject = new WaterFragment(Object.assign({}, clean, { pH: 7.5 }) as never);
    expect(subject.bicarbonate).toEqual(244);

    subject = new WaterFragment(Object.assign({}, clean, { pH: 8.0 }) as never);
    expect(subject.bicarbonate).toEqual(242);

    subject = new WaterFragment(Object.assign({}, clean, { pH: 8.5 }) as never);
    expect(subject.bicarbonate).toEqual(238);
  });

  it('should estimate pH from alkalinity & bicarbonate', () => {
    expect(Fixture.Dublin.pH).toEqual(7.4);
    expect(Fixture.London.pH).toEqual(6.6);
    expect(Fixture.Munich.pH).toEqual(7.6);
    expect(Fixture.Vienna.pH).toEqual(6.8);
  });
});
