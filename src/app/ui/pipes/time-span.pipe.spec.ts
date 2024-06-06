import { TimeSpanPipe } from './time-span.pipe';

describe('TimeSpanPipe', (): void => {
  let pipe: TimeSpanPipe;

  const testingDataSet: Array<{
    timeInMillis: number;
    formattedResult: string;
  }> = [
    { timeInMillis: 0, formattedResult: '0ms' },
    { timeInMillis: 123, formattedResult: '123ms' },
    { timeInMillis: 1000, formattedResult: '1s' },
    { timeInMillis: 13 * 1000, formattedResult: '13s' },
    { timeInMillis: 59 * 1000, formattedResult: '59s' },
    { timeInMillis: 60 * 1000 + 13 * 1000, formattedResult: '1m 13s' },
    { timeInMillis: 10 * 60 * 1000 + 13 * 1000, formattedResult: '10m 13s' },
    { timeInMillis: 59 * 60 * 1000 + 13 * 1000, formattedResult: '59m 13s' },
    { timeInMillis: 60 * 60 * 1000 + 13 * 1000, formattedResult: '1h 13s' },
    { timeInMillis: 2 * 60 * 60 * 1000, formattedResult: '2h' },
    { timeInMillis: 2 * 60 * 60 * 1000 + 3 * 1000, formattedResult: '2h 3s' },
    { timeInMillis: 2 * 60 * 60 * 1000 + 13 * 1000, formattedResult: '2h 13s' },
    {
      timeInMillis: 2 * 60 * 60 * 1000 + 3 * 60 * 1000 + 13 * 1000,
      formattedResult: '2h 3m 13s',
    },
    {
      timeInMillis: 2 * 60 * 60 * 1000 + 23 * 60 * 1000 + 13 * 1000,
      formattedResult: '2h 23m 13s',
    },
  ];

  beforeEach((): void => {
    pipe = new TimeSpanPipe();
  });

  it('create an instance', (): void => {
    expect(pipe).toBeTruthy();
  });

  testingDataSet.forEach(testData =>
    it(`should format ${testData.timeInMillis} to "${testData.formattedResult}"`, () => {
      expect(pipe.transform(testData.timeInMillis)).toEqual(
        testData.formattedResult
      );
    })
  );
});
