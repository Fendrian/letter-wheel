import { computed, observable } from 'mobx';
import { Alert, Dimensions, ListView } from 'react-native';
import { NavigationActions } from 'react-navigation';
import SQLite from 'react-native-sqlite-storage';

const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
export default class AppState {
  @observable aboutModal = {};
  @observable gameModal = {};
  @observable instructionsModal = {};
  @observable letters = {
    1: '', 2: '', 3: '', 4: '', 5: '', 6: '', 7: '', 8: '', 9: '',
  };
  @observable loading = false;
  @observable navigator = {};
  @observable newGameOptions = {
    timed: false,
    wordRange: {
      min: 10,
      max: 49,
    },
  };
  @observable orientation = 0;
  @observable scored = false;
  @observable selected = [];
  @observable statusText = '';
  @observable timer = -1;
  @observable tried = [];
  @observable width = 0;
  @observable words = [];

  // Given a string, this function will randomly rearrange the string then return it.
  shuffle = (string) => {
    const a = string.split('');
    const n = a.length;

    for (let i = n - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = a[i];
      a[i] = a[j];
      a[j] = tmp;
    }
    return a.join('');
  };

  // Given a word and the SQLite database containing dictionary words, this will return
  // all words which can be made via permutations or sub-permutations of the starting word.
  getPermutatedWords = (word, db) =>
    new Promise((resolve) => {
      db.transaction((tx) => {
        const uniqueLettersInWord = Array.from(new Set(word.split(''))).join('');

        const sqlQuery = `SELECT word FROM words WHERE ${[
          '(length(word) >= 4)',
          '(length(word) <= 9)',
          `(word GLOB '*[${uniqueLettersInWord}]*')`, // INCLUDE words with any of our letters
          ...alphabet.map((letter) => { // EXCLUDE words containing too many of any letter
            const occurrencesInWord = word.split(letter).length - 1;
            return `(word NOT LIKE '${(`%${letter}`).repeat(occurrencesInWord + 1)}%')`;
          }),
        ].join(' AND ')}`;

        new Promise((wordsResolve) => {
          tx.executeSql(sqlQuery, [], (tx1, results2) => {
            wordsResolve(results2.rows.raw().map(row => row.word));
          });
        })
          .then(resolve);
      });
    });

  // Data source logic for the game word list display
  ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
  @computed get dataSource() {
    if (this.tried.length === 0 && this.scored !== true) {
      return this.ds.cloneWithRows([{ word: 'No words', style: 'neutral' }]);
    }
    const sorted = this.tried.sort((a, b) => {
      if (a.word < b.word) { return -1; }
      if (a.word > b.word) { return 1; }
      return 0;
    }).slice();

    // If the game has been scored, display all words
    if (this.scored === true) {
      const notFound = this.words.sort().filter(word => (
        (typeof (this.tried.find(w => (w.word === word))) === 'undefined')
      )).map(word => (
        ({ word, style: 'neutral' })
      ));
      const yourWords = this.tried.length !== 0 ?
        [
          { word: ' ', style: 'neutral' },
          { word: 'Your words:', style: 'neutral' },
          ...sorted,
        ]
        :
        [];
      return this.ds.cloneWithRows([
        { word: 'Not found:', style: 'neutral' },
        ...notFound,
        ...yourWords,
      ]);
    }

    // ...Otherwise just show words that have been tried
    return this.ds.cloneWithRows(sorted);
  }

  constructor() {
    const { width, height } = Dimensions.get('window');
    Dimensions.addEventListener('change', (data) => {
      this.orientation = (data.window.width < data.window.height) ? 0 : 1;
      this.width = Dimensions.get('window').width;
    });
    this.orientation = (width < height) ? 0 : 1;
    this.width = Dimensions.get('window').width;

    // Add game score levels
    this.scores = [
      { percent: 0, text: '' },
      { percent: 40, text: 'Good' },
      { percent: 65, text: 'Very Good' },
      { percent: 85, text: 'Excellent' },
      { percent: 100, text: 'Exceptional' },
    ];

    // Open the word database
    const ok = () => {};
    const err = () => {
      Alert.alert('Word database failed to open. Please re-install the app.');
    };
    this.db = SQLite.openDatabase({ name: 'main.db', createFromLocation: 1 }, ok, err);
  }

  nav = {
    goto: (screen) => {
      if (typeof (this.navigator.dispatch) === 'undefined') {
        return false;
      }
      return this.navigator.dispatch({ type: 'Navigation/NAVIGATE', routeName: screen });
    },
    resetto: (screen) => {
      if (typeof (this.navigator.dispatch) === 'undefined') {
        return false;
      }
      return this.navigator.dispatch(NavigationActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({ routeName: screen }),
        ],
      }));
    },
  }

  newGame = options =>
    new Promise((resolve) => {
      const onlyWordsContaining = ((letter, words) =>
        words.filter(w => w.indexOf(letter) !== -1)
      );

      const start = new Date().getTime();
      // If we've been passed letters explicitly,
      // use the provided letters and just get word list
      if (typeof (options.letters) === 'object') {
        const word = Object.values(options.letters).join('');
        this.getPermutatedWords(word, this.db)
          .then((words) => {
            resolve({
              letters: options.letters,
              options,
              start,
              words: onlyWordsContaining(options.letters['5'], words),
            });
          });

      // If no letters are provided, find a new word that
      // is suitable for the selected word match range
      } else {
        this.db.transaction((tx) => {
          tx.executeSql(
            'SELECT * FROM words WHERE ' +
            'length(word)=9 AND' +
            `${
              alphabet.map((
                char => `(${char} >= ${options.wordsMin} AND ${char} <= ${options.wordsMax})`
              ))
                .join(' OR ')
              }` +
            'ORDER BY RANDOM() ' +
            'LIMIT 1',
            [],
            (tx1, randWordResults) => {
              if (!randWordResults.rows.item(0)) {
                // TODO: Handle no word matching the specified range
              } else {
                // Randomly shuffle the letters of the word to make the word grid
                const word = this.shuffle(randWordResults.rows.item(0).word);

                // Select a middle letter, shuffling first to maximize randomness
                const centerLetter = this.shuffle(alphabet.join(''))
                  .split('').find(key => (
                    randWordResults.rows.item(0)[key] >= options.wordsMin &&
                    randWordResults.rows.item(0)[key] <= options.wordsMax
                  ));

                this.getPermutatedWords(word, this.db)
                  .then((words) => {
                    const letters = Object.assign(
                      {},
                      ...word.split('').map((w, i) => ({ [`${i + 1}`]: w })),
                    );

                    // Swap the selected letter into the center position
                    if (centerLetter !== letters['5']) {
                      const i = (String(Object.values(letters).indexOf(centerLetter) + 1));
                      const swapLetter = letters[i];
                      letters[i] = letters['5'];
                      letters['5'] = swapLetter;
                    }

                    console.log(onlyWordsContaining(centerLetter, words));

                    resolve({
                      letters,
                      options,
                      start,
                      words: onlyWordsContaining(centerLetter, words),
                    });
                  });
              }
            },
          );
        });
      }
    })
      .then((result) => {
        // Load up the data store with the results
        Object.assign(this.letters, result.letters);
        this.words.replace(result.words);
        this.tried.replace((typeof (options.tried) === 'object') ? options.tried : []);
        this.selected.replace([]);
        this.scored = false;
        this.statusText = 'Welcome!';

        if (typeof (options.timer) === 'number') {
          this.timer = ((result.words.length - 1) * 4);
        } else {
          this.timer = -1;
        }
      });

  submitWord = () => {
    // If game has already been scored, fail
    if (this.scored === true) {
      this.setStatus('Game already scored');
      return false;
    }

    // If word too short, fail
    if (this.selected.length < 4) {
      this.setStatus('Too short');
      return false;
    }

    const word = this.selected.map(i => (
      this.letters[i]
    )).join('');

    // If the middle letter isn't selected, fail
    if (word.indexOf(this.letters[5]) === -1) {
      this.setStatus('Missing middle letter');
      return false;
    }

    // If word already guessed, fail
    if (this.tried.find(w => (w.word === word))) {
      this.setStatus('Already tried');
      return null;
    }

    // If the word is correct, report to user and add time if relevant
    if (this.words.indexOf(word) !== -1) {
      this.tried.push({ word, style: 'correct' });
      this.selected.replace([]);
      if (this.timer > -1) {
        const addTime = (word.length * 5);
        this.setStatus(`Nice! +${addTime} seconds.`);
        this.timer += addTime;
      } else {
        this.setStatus('Nice!');
      }
      return true;
    }

    // Finally, just fail
    this.tried.push({ word, style: 'incorrect' });
    this.selected.replace([]);
    this.setStatus('Unrecognized word.');
    return false;
  }

  setStatus = (message) => {
    this.statusText = message;
    setTimeout(() => {
      if (this.statusText === message) {
        if (this.scored === false) {
          this.statusText = '';
        } else {
          this.statusText = this.getScore();
        }
      }
    }, 3000);
  }

  getScore = () => {
    const correct = this.tried.filter(tryEntry => (
      this.words.indexOf(tryEntry.word) !== -1
    )).length;
    const adjustedScores = this.scores.map(scoreObj => (
      {
        ...scoreObj,
        numWords: (Math.floor((scoreObj.percent / 100) * this.words.length)),
      }
    ));
    const currentScore = adjustedScores
      .filter(a => (a.numWords <= correct))
      .sort((a, b) => b.numWords - a.numWords)[0];
    const nextScore = adjustedScores
      .filter(a => (a.numWords > correct))
      .sort((a, b) => a.numWords - b.numWords)[0];
    return ({
      text: currentScore.text,
      toNext: (typeof (nextScore) !== 'undefined') ?
        (nextScore.numWords - correct) :
        0,
    });
  }

  scoreGame = () => {
    this.scored = true;
    this.statusText = 'Game scored';
  }
}
