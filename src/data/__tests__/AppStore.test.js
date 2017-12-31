import { Alert, Dimensions } from 'react-native';
import SQLite from 'react-native-sqlite-storage';

import AppStore from '../AppStore';

const random = jest.spyOn(Math, 'random')
  .mockReturnValue(0.25)
  .mockName('random');

jest.mock('react-native', () => (
  {
    Alert: {
      alert: jest.fn(),
    },
    Dimensions: {
      addEventListener: jest.fn().mockReturnValue(),
      get: jest.fn().mockReturnValue({ width: 400, height: 800 }),
    },
  }
));
jest.mock('react-native-sqlite-storage', () => {
  const dbMock = { transaction: jest.fn() };
  return {
    openDatabase: jest.fn().mockReturnValue(dbMock),
  };
});

describe('Mobx Store', () => {
  let store;

  beforeEach(() => {
    store = new AppStore();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Adds an event listener to the dimensions', () => {
    expect(Dimensions.addEventListener).toHaveBeenCalledTimes(1);
    expect(Dimensions.addEventListener).toHaveBeenCalledWith('change', expect.any(Function));
    expect(Dimensions.get).toHaveBeenCalledWith('window');
    expect(store.orientation).toEqual(0);
    expect(store.width).toEqual(400);
    Dimensions.addEventListener.mock.calls[0][1]({
      window: {
        width: 800,
        height: 400,
      },
    });
    expect(store.orientation).toEqual(1);
    expect(store.width).toEqual(800);
  });

  it('Opens the \'main.db\' SQLite database', () => {
    expect(SQLite.openDatabase).toHaveBeenCalledWith(
      {
        name: 'main.db',
        createFromLocation: 1,
      },
      expect.any(Function),
      expect.any(Function),
    );
    expect(SQLite.openDatabase).toHaveBeenCalledTimes(1);
    expect(store.db).toEqual(SQLite.openDatabase());
    SQLite.openDatabase.mock.calls[0][2]();
    expect(Alert.alert).toHaveBeenCalledTimes(1);
    expect(Alert.alert).toHaveBeenCalledWith('Word database failed to open. Please re-install the app.');
  });

  it('Specifies score levels', () => {
    expect(store.scores).toEqual(expect.any(Array));
    expect(store.scores[0]).toEqual(expect.any(Object));
  });

  it('Exports an AppState component', () => {
    expect(store).toBeInstanceOf(AppStore);
  });

  it('Provides a toggleSelected action', () => {
    expect(store.toggleSelected).toEqual(expect.any(Function));
    expect(store.selected.peek()).toEqual([]);
    store.toggleSelected('3');
    expect(store.selected.peek()).toEqual(['3']);
    store.toggleSelected('8');
    store.toggleSelected('1');
    expect(store.selected.peek()).toEqual(['3', '8', '1']);
    store.toggleSelected('3');
    store.toggleSelected('9');
    store.toggleSelected('2');
    store.toggleSelected('1');
    expect(store.selected.peek()).toEqual(['8', '9', '2']);
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

  it('Provides a newGame function that can generate a new word', async () => {
    expect(store.newGame).toBeDefined();
    expect(typeof (store.newGame)).toEqual('function');
    store.shuffle = jest.fn(s => s);
    store.getPermutatedWords = jest.fn().mockReturnValue((
      Promise.resolve([
        '6047eeD0',
        '77c2',
        '4726',
        '9b46',
        'bca0ce269095',
        'a95d96bj',
      ])
    ));
    const executeSql = jest.fn((query, list, next) => {
      next(
        null,
        {
          rows: {
            item: jest.fn().mockReturnValue({
              word: 'flapjacks',
              a: 65,
              b: 0,
              c: 41,
              d: 0,
              e: 0,
              f: 14,
              g: 0,
              h: 0,
              i: 0,
              j: 11,
              k: 31,
              l: 48,
              m: 0,
              n: 0,
              o: 0,
              p: 34,
              q: 0,
              r: 0,
              s: 42,
              t: 0,
              u: 0,
              v: 0,
              w: 0,
              x: 0,
              y: 0,
              z: 0,
            }),
          },
        },
      );
    });
    store.db.transaction
      .mockImplementation(((func) => {
        func({ executeSql });
      }));

    // Test default new game
    await expect(store.newGame({
      wordsMin: 1,
      wordsMax: 50,
    }))
      .resolves.toEqual();
    expect(store.db.transaction).toHaveBeenCalledTimes(1);
    expect(executeSql).toHaveBeenCalledTimes(1);
    expect(executeSql).toHaveBeenCalledWith(
      'SELECT * FROM words WHERE ' +
      'length(word)=9 AND' +
      '(a >= 1 AND a <= 50) OR ' +
      '(b >= 1 AND b <= 50) OR ' +
      '(c >= 1 AND c <= 50) OR ' +
      '(d >= 1 AND d <= 50) OR ' +
      '(e >= 1 AND e <= 50) OR ' +
      '(f >= 1 AND f <= 50) OR ' +
      '(g >= 1 AND g <= 50) OR ' +
      '(h >= 1 AND h <= 50) OR ' +
      '(i >= 1 AND i <= 50) OR ' +
      '(j >= 1 AND j <= 50) OR ' +
      '(k >= 1 AND k <= 50) OR ' +
      '(l >= 1 AND l <= 50) OR ' +
      '(m >= 1 AND m <= 50) OR ' +
      '(n >= 1 AND n <= 50) OR ' +
      '(o >= 1 AND o <= 50) OR ' +
      '(p >= 1 AND p <= 50) OR ' +
      '(q >= 1 AND q <= 50) OR ' +
      '(r >= 1 AND r <= 50) OR ' +
      '(s >= 1 AND s <= 50) OR ' +
      '(t >= 1 AND t <= 50) OR ' +
      '(u >= 1 AND u <= 50) OR ' +
      '(v >= 1 AND v <= 50) OR ' +
      '(w >= 1 AND w <= 50) OR ' +
      '(x >= 1 AND x <= 50) OR ' +
      '(y >= 1 AND y <= 50) OR ' +
      '(z >= 1 AND z <= 50)' +
      'ORDER BY RANDOM() ' +
      'LIMIT 1',
      [],
      expect.any(Function),
    );
    expect(store.letters).toEqual('flapcjaks');
    expect(store.words.peek()).toEqual([
      '77c2',
      'bca0ce269095',
    ]);
    expect(store.tried.peek()).toEqual([]);
    expect(store.selected.peek()).toEqual([]);
    expect(store.scored).toEqual(false);
    expect(store.statusText).toEqual('Welcome!');
    expect(store.timer).toEqual(-1);

    // test new game with default timer
    await expect(store.newGame({
      timer: -1,
      wordsMin: 1,
      wordsMax: 50,
    }))
      .resolves.toEqual();
    expect(store.timer).toEqual(4);
  });

  it('Provides a newGame function that can load a provided game', async () => {
    expect(store.newGame).toBeDefined();
    expect(typeof (store.newGame)).toEqual('function');
    store.shuffle = jest.fn(s => s);
    store.getPermutatedWords = jest.fn().mockReturnValue((
      Promise.resolve([
        '6047eeD0',
        '77c2',
        '4726',
        '9b46',
        'bca0ce269095',
        'a95d96bj',
      ])
    ));
    const executeSql = jest.fn();
    store.db = {
      transaction: jest.fn((func) => {
        func({ executeSql });
      }),
    };

    await expect(store.newGame({
      timer: 50,
      letters: 'flapjacks',
      tried: [
        '82d6604e',
        '83d1',
        '494d',
      ],
    }))
      .resolves.toEqual();
    expect(store.letters).toEqual('flapjacks');
    expect(store.words.peek()).toEqual([
      'a95d96bj',
    ]);
    expect(store.tried.peek()).toEqual([
      '82d6604e',
      '83d1',
      '494d',
    ]);
    expect(store.db.transaction).toHaveBeenCalledTimes(0);
    expect(executeSql).toHaveBeenCalledTimes(0);
    expect(store.scored).toEqual(false);
    expect(store.statusText).toEqual('Welcome!');
    expect(store.timer).toEqual(50);
  });

  it('Provides a triedWordList computed with formatting indications', () => {
    store.letters = 'halibut';
    store.words = [
      'alit',
      'bail',
      'built',
      'hail',
      'halt',
      'haul',
      'tail',
    ];
    expect(store.triedWordList).toEqual([
      { word: 'No words', style: 'neutral' },
    ]);

    store.tried = [
      'alit',
      'yrasd',
      'built',
      'bail',
      'asdf',
    ];
    expect(store.triedWordList).toEqual([
      { word: 'alit', style: 'correct' },
      { word: 'asdf', style: 'incorrect' },
      { word: 'bail', style: 'correct' },
      { word: 'built', style: 'correct' },
      { word: 'yrasd', style: 'incorrect' },
    ]);

    store.scored = true;
    expect(store.triedWordList).toEqual([
      { word: 'Not found:', style: 'neutral' },
      { word: 'hail', style: 'neutral' },
      { word: 'halt', style: 'neutral' },
      { word: 'haul', style: 'neutral' },
      { word: 'tail', style: 'neutral' },
      { word: ' ', style: 'neutral' },
      { word: 'Your words:', style: 'neutral' },
      { word: 'alit', style: 'correct' },
      { word: 'asdf', style: 'incorrect' },
      { word: 'bail', style: 'correct' },
      { word: 'built', style: 'correct' },
      { word: 'yrasd', style: 'incorrect' },
    ]);
  });
});
