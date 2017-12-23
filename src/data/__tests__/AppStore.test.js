import AppStore from '../AppStore';

const random = jest
  .fn()
  .mockReturnValue(0.25)
  .mockName('random');


describe('Mobx Store', () => {
  let store;
  const originalRandom = Math.random;

  beforeEach(() => {
    Math.random = random;
    store = new AppStore();
  });
  afterEach(() => {
    Math.random = originalRandom;
  });

  it('Exports an AppState component', () => {
    expect(store).toBeInstanceOf(AppStore);
  });

  it('Provides a random shuffle function', () => {
    const inputString = 'abcdefghijklmnopqrstuvwxyz';
    random.mockReturnValue(0.11658899463133832);
    expect(store.shuffle(inputString))
      .toEqual('irzefghajklmnopqbstuvwxycd');
    random.mockReturnValue(0.3213743838222347);
    expect(store.shuffle(inputString))
      .toEqual('jsampbvyckldnoeqrftugwxhzi');
    random.mockReturnValue(0.6513050170381487);
    expect(store.shuffle(inputString))
      .toEqual('atbcxdesfgyhivjkrlmunwopzq');
    random.mockReturnValue(0.43231233890752163);
    expect(store.shuffle(inputString))
      .toEqual('uanbzcqsdxemfopgrhtivwjykl');
    random.mockReturnValue(0.7308075349061951);
    expect(store.shuffle(inputString))
      .toEqual('abxcdevfghuijzklmynopwqrst');
  });

  it('Provides a getPermutatedWords function', async () => {
    expect(store.getPermutatedWords).toBeDefined();
    expect(typeof (store.getPermutatedWords)).toEqual('function');
    const raw = jest.fn(() => ([
      { word: '82A06F5E' },
      { word: '83F9' },
      { word: '485E' },
      { word: '8041' },
      { word: '74D1E0E263CE' },
    ]));
    const executeSql = jest.fn((query, list, next) => {
      next(null, { rows: { raw } });
    });
    const transaction = jest.fn((func) => {
      func({ executeSql });
    });
    await expect(store.getPermutatedWords('fisheries', { transaction }))
      .resolves.toEqual([
        '82A06F5E',
        '83F9',
        '485E',
        '8041',
        '74D1E0E263CE',
      ]);
    expect(transaction).toHaveBeenCalledTimes(1);
    expect(executeSql).toHaveBeenCalledTimes(1);
    expect(executeSql).toHaveBeenCalledWith(
      'SELECT word FROM words ' +
      'WHERE ' +
      '(length(word) >= 4) AND ' +
      '(length(word) <= 9) AND ' +
      '(word GLOB \'*[fisher]*\') AND ' +
      '(word NOT LIKE \'%a%\') AND ' +
      '(word NOT LIKE \'%b%\') AND ' +
      '(word NOT LIKE \'%c%\') AND ' +
      '(word NOT LIKE \'%d%\') AND ' +
      '(word NOT LIKE \'%e%e%e%\') AND ' +
      '(word NOT LIKE \'%f%f%\') AND ' +
      '(word NOT LIKE \'%g%\') AND ' +
      '(word NOT LIKE \'%h%h%\') AND ' +
      '(word NOT LIKE \'%i%i%i%\') AND ' +
      '(word NOT LIKE \'%j%\') AND ' +
      '(word NOT LIKE \'%k%\') AND ' +
      '(word NOT LIKE \'%l%\') AND ' +
      '(word NOT LIKE \'%m%\') AND ' +
      '(word NOT LIKE \'%n%\') AND ' +
      '(word NOT LIKE \'%o%\') AND ' +
      '(word NOT LIKE \'%p%\') AND ' +
      '(word NOT LIKE \'%q%\') AND ' +
      '(word NOT LIKE \'%r%r%\') AND ' +
      '(word NOT LIKE \'%s%s%s%\') AND ' +
      '(word NOT LIKE \'%t%\') AND ' +
      '(word NOT LIKE \'%u%\') AND ' +
      '(word NOT LIKE \'%v%\') AND ' +
      '(word NOT LIKE \'%w%\') AND ' +
      '(word NOT LIKE \'%x%\') AND ' +
      '(word NOT LIKE \'%y%\') AND ' +
      '(word NOT LIKE \'%z%\')',
      [],
      expect.any(Function),
    );
  });
});
