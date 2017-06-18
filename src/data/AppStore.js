import { observable } from 'mobx';
import { Alert, Dimensions } from 'react-native';
import SQLite from 'react-native-sqlite-storage';

// Given a string, this function will randomly rearrange the string then return it.
const shuffle = (string) => {
  const a = string.split('');
  const n = a.length;

  for (let i = n - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = a[i];
    a[i] = a[j];
    a[j] = tmp;
  }
  console.log('String has been shuffled!');
  console.log(`Input string was ${string}`);
  console.log(`Output string is ${a.join('')}`);
  return a.join('');
};

// Given a word and the SQLite database containing dictionary words, this will return
// all words which can be made via permutations or sub-permutations of the starting word.
const getPermutatedWords = (word, db) =>
  new Promise((resolve) => {
    db.transaction((tx) => {
      const wordLengths = ['4', '5', '6', '7', '8', '9'];

      // Make an object with each letter, and how many times that letter is in the word
      const letters = {};
      const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
      for (let i = 0; i < word.length; i += 1) {
        if (typeof (letters[word[i]]) === 'undefined') {
          letters[word[i]] = 0;
        }
        letters[word[i]] += 1;
      }

      // Construct a LIKE query string checking for the presence of ANY letters in the word
      const matchString = Object.keys(letters).map(letter =>
        `'%${letter}%'`,
      ).join(' OR ');

      // Construct a NOT LIKE query string excluding too many of any one letter
      const excludeString = alphabet.map(letter =>
        `'%${typeof (letters[letter]) !== 'undefined' ? Array.from(Array(letters[letter] + 1)).map(() => letter).join('%') : letter}%'`,
      ).join(') AND (word NOT LIKE ');

      // Construct the actual SQL query
      const query = wordLengths.map(num =>
        `SELECT * FROM words${num} WHERE (word LIKE ${matchString}) AND (word NOT LIKE ${excludeString})`,
      ).join(' UNION ALL ');

      new Promise((wordsResolve) => {
        tx.executeSql(query, [], (tx1, results2) => {
          const dict = results2.rows.raw().map(row =>
            row.word,
          );
          wordsResolve(dict);
        });
      })
        .then(resolve);
    });
  });

const onlyWordsContaining = ((letter, words) =>
  words.filter(w =>
    (w.indexOf(letter) !== -1),
  ));

export default class AppState {
  @observable navigator = {};
  @observable orientation = 0;
  @observable letters = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };
  @observable words = [];
  @observable timer = -1;
  @observable tried = { all: [] };
  @observable selected = { all: [] };
  constructor() {
    const { width, height } = Dimensions.get('window');
    Dimensions.addEventListener('change', (data) => {
      this.orientation = (data.window.width < data.window.height) ? 0 : 1;
    });
    this.orientation = (width < height) ? 0 : 1;

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
  }
  newGame = options =>
    new Promise((resolve) => {
      const start = new Date().getTime();
      // If we've been passed letters explicitly, only process middle letter
      if (typeof (options.letters) === 'object') {
        const word = Object.values(options.letters).join();
        getPermutatedWords(word, this.db)
          .then((words) => {
            resolve({
              letters: options.letters,
              options,
              start,
              words: onlyWordsContaining(options.letters['5'], words),
            });
          });

      // Otherwise iterate until we find a suitable middle letter
      } else {
        const getNewWord = () => {
          this.db.transaction((tx) => {
            tx.executeSql('SELECT word FROM words9 WHERE _ROWID_ >= (abs(random()) % ((SELECT max(_ROWID_) FROM words9) + 1)) LIMIT 1', [], (tx1, randWordResults) => {
              const scrambled = (() =>
                Object.assign({}, ...shuffle(randWordResults.rows.item(0).word).split('').map((w, i) => ({ [String(i + 1)]: w })))
              )();
              const word = Object.values(scrambled).join();
              getPermutatedWords(word, this.db)
                .then((words) => {
                  // Specify the target word length
                  let minwords;
                  let maxwords;
                  switch (options.wordLen) {
                    case 1:
                      minwords = 31;
                      maxwords = 75;
                      break;
                    case 2:
                      minwords = 76;
                      maxwords = 1000;
                      break;
                    default:
                      minwords = 1;
                      maxwords = 30;
                      break;
                  }

                  // See how many valid words we'd have for each different middle letter
                  const lengths = Object.assign({}, ...word.split('').map(l => ({ [l]: 0 }))); // remove duplicate letters
                  const lengthItems = Object.keys(lengths);
                  let centerLetter = '';

                  for (let i = 0; i < lengthItems.length; i += 1) {
                    const matches = words.filter(w =>
                      (w.indexOf(lengthItems[i]) !== -1),
                    );
                    if (matches.length >= minwords && matches.length <= maxwords) {
                      centerLetter = lengthItems[i];
                    }
                  }

                  // If we haven't found a suitable word range, then iterate again.
                  if (centerLetter === '') {
                    getNewWord();

                  // Otherwise resolve the promise
                  } else {
                    // Swap the selected letter into the center position
                    if (centerLetter !== scrambled['5']) {
                      const i = (String(Object.values(scrambled).indexOf(centerLetter) + 1));
                      const swapLetter = scrambled[i];
                      scrambled[i] = scrambled['5'];
                      scrambled['5'] = swapLetter;
                    }

                    resolve({
                      letters: scrambled,
                      options,
                      start,
                      words: onlyWordsContaining(centerLetter, words),
                    });
                  }
                });
            });
          });
        };
        getNewWord();
      }
    })
      .then((result) => {
        console.log(`Word generation took ${new Date().getTime() - result.start} milliseconds.`);

        // Load up the data store with the results
        Object.assign(this.letters, result.letters);
        this.words.replace(result.words);
        this.timer = (typeof (options.timer) === 'number') ? options.timer : -1;
        this.tried = (typeof (options.tried) === 'object') ? { all: options.tried } : { all: [] };
        this.selected = { all: [] };
      });
  }
