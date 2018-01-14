import { Alert, Dimensions } from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import { NavigationActions } from 'react-navigation';

import AppStore from '../AppStore';

jest.useFakeTimers();

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
jest.mock('react-navigation', () => ({
  NavigationActions: {
    reset: jest.fn().mockReturnValue('F54036181AE4'),
    navigate: jest.fn().mockReturnValue('C6036B1B1E09'),
  },
}));

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
    Dimensions.addEventListener.mock.calls[0][1]({
      window: {
        width: 200,
        height: 300,
      },
    });
    expect(store.orientation).toEqual(0);
    expect(store.width).toEqual(200);

    jest.clearAllMocks();
    Dimensions.get.mockReturnValue({ width: 500, height: 300 });
    const store2 = new AppStore();
    expect(store2.orientation).toEqual(1);
    expect(store2.width).toEqual(500);
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

  it('Provides a loadAboutModal function that updates the aboutModal variable', () => {
    expect(store.loadAboutModal).toEqual(expect.any(Function));
    expect(store.aboutModal).toEqual({});
    store.loadAboutModal({ fish: '4DF0A4293A9C' });
    expect(store.aboutModal.fish).toEqual('4DF0A4293A9C');
    store.loadAboutModal({});
    expect(store.aboutModal).toEqual({});
  });

  it('Provides a loadGameModal function that updates the gameModal variable', () => {
    expect(store.loadGameModal).toEqual(expect.any(Function));
    expect(store.gameModal).toEqual({});
    store.loadGameModal({ fish: '4DF0A4293A9C' });
    expect(store.gameModal.fish).toEqual('4DF0A4293A9C');
    store.loadGameModal({});
    expect(store.gameModal).toEqual({});
  });

  it('Provides a loadInstructionsModal function that updates the instructionsModal variable', () => {
    expect(store.loadInstructionsModal).toEqual(expect.any(Function));
    expect(store.instructionsModal).toEqual({});
    store.loadInstructionsModal({ fish: '4DF0A4293A9C' });
    expect(store.instructionsModal.fish).toEqual('4DF0A4293A9C');
    store.loadInstructionsModal({});
    expect(store.instructionsModal).toEqual({});
  });

  it('Provides a setLoading function that updates the loading variable', () => {
    expect(store.setLoading).toEqual(expect.any(Function));
    expect(store.loading).toEqual(false);
    store.setLoading(true);
    expect(store.loading).toEqual(true);
    store.setLoading(null);
    expect(store.loading).toEqual(false);
  });

  it('Provides a setNewGameOptions function that updates the newGameOptions variable', () => {
    expect(store.setNewGameOptions).toEqual(expect.any(Function));
    expect(store.newGameOptions.get('asdf')).toEqual(undefined);
    store.setNewGameOptions('asdf', true);
    expect(store.newGameOptions.get('asdf')).toEqual(true);
    store.setNewGameOptions('asdf', false);
    expect(store.newGameOptions.get('asdf')).toEqual(false);
    store.setNewGameOptions('7CFD8854AD3E', '644C70F7');
    expect(store.newGameOptions.get('7CFD8854AD3E')).toEqual('644C70F7');
  });

  it('Provides a setTimer function that updates the timer variable', () => {
    expect(store.setTimer).toEqual(expect.any(Function));
    expect(store.timer).toEqual(-1);
    store.setTimer(582);
    expect(store.timer).toEqual(582);
    store.setTimer(0);
    expect(store.timer).toEqual(0);
    store.setTimer(-1);
    expect(store.timer).toEqual(-1);
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

    store.tried.replace([
      'alit',
      'yrasd',
      'built',
      'bail',
      'asdf',
    ]);
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

    store.tried.clear();
    expect(store.triedWordList).toEqual([
      { word: 'Not found:', style: 'neutral' },
      { word: 'alit', style: 'neutral' },
      { word: 'bail', style: 'neutral' },
      { word: 'built', style: 'neutral' },
      { word: 'hail', style: 'neutral' },
      { word: 'halt', style: 'neutral' },
      { word: 'haul', style: 'neutral' },
      { word: 'tail', style: 'neutral' },
    ]);
  });

  it('Provides a \'nav\' key with navigation functions on it', () => {
    expect(store.nav).toEqual(expect.any(Object));
    expect(store.nav.goto).toEqual(expect.any(Function));
    expect(store.nav.resetto).toEqual(expect.any(Function));

    store.navigator = {};
    expect(store.nav.goto()).toEqual(false);
    expect(store.nav.resetto()).toEqual(false);

    store.navigator.dispatch = jest.fn().mockReturnValue('EC18A79B1E3B');
    expect(store.nav.goto('5913349A')).toEqual('EC18A79B1E3B');
    expect(store.navigator.dispatch).toHaveBeenCalledTimes(1);
    expect(store.navigator.dispatch).toHaveBeenCalledWith({
      type: 'Navigation/NAVIGATE',
      routeName: '5913349A',
    });

    store.navigator.dispatch.mockClear();
    store.navigator.dispatch = jest.fn().mockReturnValue('FE765CEFB8E0');
    expect(store.nav.resetto('ED5E7583')).toEqual('FE765CEFB8E0');
    expect(store.navigator.dispatch).toHaveBeenCalledTimes(1);
    expect(store.navigator.dispatch).toHaveBeenCalledWith('F54036181AE4');
    expect(NavigationActions.reset).toHaveBeenCalledTimes(1);
    expect(NavigationActions.reset).toHaveBeenCalledWith({
      index: 0,
      actions: [
        'C6036B1B1E09',
      ],
    });
    expect(NavigationActions.navigate).toHaveBeenCalledTimes(1);
    expect(NavigationActions.navigate).toHaveBeenCalledWith({
      routeName: 'ED5E7583',
    });
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
    const item = jest.fn().mockReturnValue({
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
    });
    const executeSql = jest.fn((query, list, next) => {
      next(
        null,
        {
          rows: {
            item,
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

    // test new game with no matching word
    item.mockReturnValue();
    store.letters = 'unchanged';
    store.words.replace([
      'fish',
      'food',
    ]);
    store.tried.replace(['nope']);
    store.selected.replace(['1']);
    await expect(store.newGame({
      wordsMin: 1000000,
      wordsMax: 1000001,
    }))
      .resolves.toEqual();
    expect(Alert.alert).toHaveBeenCalledTimes(1);
    expect(Alert.alert).toHaveBeenCalledWith('No suitable words found. Please expand search parameters.');
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

  it('Provides a submitWord function with validation and user feedback', () => {
    expect(store.submitWord).toEqual(expect.any(Function));

    store.setStatus('');
    store.letters = 'abcdefghe';
    store.scored = true;
    store.timer = 50;
    store.tried.replace(['aade']);
    store.words.replace([
      'ache',
      'cafe',
    ]);
    expect(store.submitWord()).toEqual(false);
    expect(store.tried.peek()).toEqual(['aade']);
    expect(store.statusText).toEqual('Game already scored');

    store.scored = false;
    store.selected.replace(['1', '2', '3']);
    expect(store.submitWord()).toEqual(false);
    expect(store.tried.peek()).toEqual(['aade']);
    expect(store.statusText).toEqual('Too short');

    store.selected.replace(['0', '1', '2', '3']);
    expect(store.submitWord()).toEqual(false);
    expect(store.tried.peek()).toEqual(['aade']);
    expect(store.statusText).toEqual('Missing middle letter');

    store.selected.replace(['0', '0', '3', '4']);
    expect(store.submitWord()).toEqual(null);
    expect(store.tried.peek()).toEqual(['aade']);
    expect(store.statusText).toEqual('Already tried');

    store.selected.replace(['0', '2', '7', '4']);
    expect(store.submitWord()).toEqual(true);
    expect(store.tried.peek()).toEqual([
      'aade',
      'ache',
    ]);
    expect(store.selected.peek()).toEqual([]);
    expect(store.timer).toEqual(70);
    expect(store.statusText).toEqual('Nice! +20 seconds.');

    store.timer = -1;
    store.selected.replace(['2', '0', '5', '4']);
    store.tried.replace(['asdf']);
    expect(store.submitWord()).toEqual(true);
    expect(store.tried.peek()).toEqual([
      'asdf',
      'cafe',
    ]);
    expect(store.selected.peek()).toEqual([]);
    expect(store.timer).toEqual(-1);
    expect(store.statusText).toEqual('Nice!');

    store.selected.replace(['4', '4', '4', '4']);
    store.tried.replace([]);
    expect(store.submitWord()).toEqual(false);
    expect(store.tried.peek()).toEqual(['eeee']);
    expect(store.selected.peek()).toEqual([]);
    expect(store.statusText).toEqual('Unrecognized word.');
  });

  it('Provides a setStatus action that updates statusText', () => {
    jest.spyOn(store, 'getScore').mockReturnValue('FF413678');

    expect(store.setStatus).toEqual(expect.any(Function));
    store.statusText = '';

    // Basic usage
    store.setStatus('50D412D324A8');
    expect(store.statusText).toEqual('50D412D324A8');
    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 3000);

    // If status text is same and game is not scored, clear after timer
    setTimeout.mock.calls[0][0]();
    expect(store.statusText).toEqual('');

    // If status text is same and game is scored, set to score after timer
    store.scored = true;
    setTimeout.mockClear();
    store.setStatus('0B2B0E79');
    expect(store.statusText).toEqual('0B2B0E79');
    setTimeout.mock.calls[0][0]();
    expect(store.statusText).toEqual('FF413678');

    // If status text is not the same, do nothing.
    store.scored = false;
    setTimeout.mockClear();
    store.setStatus('E6EE45B6');
    store.statusText = 'asdf';
    setTimeout.mock.calls[0][0]();
    expect(store.statusText).toEqual('asdf');
  });

  it('Provides a getScore function returning current score and distance to next level', () => {
    expect(store.getScore).toEqual(expect.any(Function));

    store.words.replace([
      'been',
      'bend',
      'bended',
      'bender',
      'blend',
      'blended',
      'blender',
      'blunder',
      'blundered',
      'bundle',
    ]);
    store.tried.replace([]);
    store.scores = [
      { percent: 0, text: '548E' },
      { percent: 40, text: '9F81' },
      { percent: 80, text: '7DA2' },
      { percent: 100, text: '4683' },
    ];

    expect(store.getScore()).toEqual({ text: '548E', toNext: 4 });

    store.tried.replace([
      'blend',
      'blended',
      'blender',
    ]);
    expect(store.getScore()).toEqual({ text: '548E', toNext: 1 });

    store.tried.replace([
      'blend',
      'blended',
      'blender',
      'asdf',
      'rscvd',
      'asdfsdfd',
    ]);
    expect(store.getScore()).toEqual({ text: '548E', toNext: 1 });

    store.tried.replace([
      'blend',
      'blended',
      'blender',
      'asdf',
      'rscvd',
      'asdfsdfd',
      'blunder',
      'blundered',
      'bundle',
    ]);
    expect(store.getScore()).toEqual({ text: '9F81', toNext: 2 });

    store.tried.replace([
      'blend',
      'blended',
      'blender',
      'asdf',
      'rscvd',
      'asdfsdfd',
      'blunder',
      'blundered',
      'bundle',
      'been',
      'bend',
    ]);
    expect(store.getScore()).toEqual({ text: '7DA2', toNext: 2 });

    store.tried.replace([
      'blend',
      'blended',
      'blender',
      'asdf',
      'rscvd',
      'asdfsdfd',
      'blunder',
      'blundered',
      'bundle',
      'been',
      'bend',
      'bended',
      'bender',
    ]);
    expect(store.getScore()).toEqual({ text: '4683', toNext: 0 });
  });

  it('Provides a scoreGame function that sets a scored state', () => {
    expect(store.scoreGame).toEqual(expect.any(Function));
    store.scoreGame();
    expect(store.scored).toEqual(true);
    expect(store.statusText).toEqual('Game scored');
  });
});
