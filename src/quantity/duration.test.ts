import { Duration, DurationUnit } from './duration';

describe('Duration', () => {
  let subject: Duration;

  beforeEach(() => {
    subject = Duration.minutes(180);
  });

  it('should init', () => {
    expect(Duration.minutes(-1).minutes()).toEqual(0.0);
    expect(Duration.minutes(180)).toEqual(subject);
    expect(new Duration(DurationUnit.Second, 10800)).toEqual(subject);
    expect(new Duration(DurationUnit.Hour, 3)).toEqual(subject);
    expect(new Duration(DurationUnit.Day, 0.125)).toEqual(subject);
  });

  it('should convert', () => {
    expect(subject.convert(DurationUnit.Second)).toEqual(10800);
    expect(subject.convert(DurationUnit.Minute)).toEqual(180);
    expect(subject.convert(DurationUnit.Hour)).toEqual(3);
    expect(subject.convert(DurationUnit.Day)).toEqual(0.125);
  });
});
