import GameSavingLoader from '../js/GameSavingLoader';
import read from '../js/reader';

jest.mock('../js/reader.js');

beforeEach(() => {
  jest.resetAllMocks();
});
test('resolve', async () => {
  const resolvePromise = new Promise((resolve) => {
    setTimeout(() => {
      const data = '{"id":9,"created":1546300800,"userInfo":{"id":1,"name":"Hitman","level":10,"points":2000}}';
      return ((input) => {
        const buffer = new ArrayBuffer(input.length * 2);
        const bufferView = new Uint16Array(buffer);
        for (let i = 0; i < input.length; i += 1) {
          bufferView[i] = input.charCodeAt(i);
        }
        resolve(buffer);
      })(data);
    }, 1000);
  });
  read.mockReturnValue(resolvePromise);
  const expecteds = JSON.parse(
    '{"id":9,"created":1546300800,"userInfo":{"id":1,"name":"Hitman","level":10,"points":2000}}',
  );
  const data = await GameSavingLoader.load();
  expect(data).toEqual(expecteds);
});

test('error catch', async () => {
  const rejectPromis = new Promise((resolve, reject) => {
    reject(new Error('SavingError'));
  });
  read.mockReturnValue(rejectPromis);
  expect.assertions(1);
  try {
    await GameSavingLoader.load();
  } catch (e) {
    expect(e).toEqual('SavingError');
  }
});
