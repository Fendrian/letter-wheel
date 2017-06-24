import { computed, observable } from 'mobx';
import { Alert, Dimensions, ListView } from 'react-native';
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
  return a.join('');
};

// Given a word and the SQLite database containing dictionary words, this will return
// all words which can be made via permutations or sub-permutations of the starting word.
const getPermutatedWords = (word, db) =>
  new Promise((resolve) => {
    db.transaction((tx) => {
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
      ).join(') OR (WORD LIKE ');

      // Construct a NOT LIKE query string excluding any words with too many of each letter
      const excludeString = alphabet.map(letter =>
        `'%${typeof (letters[letter]) !== 'undefined' ? Array.from(Array(letters[letter] + 1)).map(() => letter).join('%') : letter}%'`,
      ).join(') AND (word NOT LIKE ');

      // Construct the actual SQL query
      const query = `SELECT word FROM words WHERE length(word)>=4 AND length(word)<=9 AND ((word LIKE ${matchString})) AND (word NOT LIKE ${excludeString})`;

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
  @observable letters = { 1: '', 2: '', 3: '', 4: '', 5: '', 6: '', 7: '', 8: '', 9: '' };
  @observable words = [];
  @observable timer = -1;
  @observable tried = [];
  @observable selected = [];
  @observable statusText = '';
  @observable loading = false;
  ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
  @computed get dataSource() {
    return this.ds.cloneWithRows(this.tried.sort((a, b) => {
      if (a.word < b.word) { return -1; }
      if (a.word > b.word) { return 1; }
      return 0;
    }).slice());
  }
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
        const word = Object.values(options.letters).join('');
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
            tx.executeSql('SELECT word FROM words WHERE _ROWID_ >= (abs(random()) % ((SELECT max(_ROWID_) FROM words) + 1)) AND length(word)=9 LIMIT 1', [], (tx1, randWordResults) => {
              const scrambled = (() =>
                Object.assign({}, ...shuffle(randWordResults.rows.item(0).word).split('').map((w, i) => ({ [String(i + 1)]: w })))
              )();
              const word = Object.values(scrambled).join('');
              getPermutatedWords(word, this.db)
                .then((words) => {
                  // See how many valid words we'd have for each different middle letter
                  const wordLetters = [...new Set(word.split(''))]; // make letters unique to save time
                  let centerLetter = '';

                  for (let i = 0; i < wordLetters.length; i += 1) {
                    const matches = words.filter(w =>
                      (w.indexOf(wordLetters[i]) !== -1),
                    );
                    if (matches.length >= options.wordsMin && matches.length <= options.wordsMax) {
                      centerLetter = wordLetters[i];
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

                    console.log(words);

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
        this.tried.replace((typeof (options.tried) === 'object') ? options.tried : []);
        this.selected.replace([]);
      });

  submitWord = () => {
    // If word too short, fail.
    if (this.selected.length < 4) {
      this.setStatus('Too short');
      return false;
    }

    // If the middle letter isn't selected, fail.
    if (this.selected.indexOf('5') === -1) {
      this.setStatus('Missing middle letter');
      return false;
    }

    const word = this.selected.map(i =>
      this.letters[i],
    ).join('');

    // If word already guessed, fail
    if (this.tried.indexOf(word) !== -1) {
      this.setStatus('Already tried');
      return false;
    }

    // If the word is correct, say so
    if (this.words.indexOf(word) !== -1) {
      this.tried.push({ word, correct: true });
      this.selected.replace([]);
      this.setStatus('Nice!');
      return true;
    }

    // Finally, just fail
    this.tried.push({ word, correct: false });
    this.selected.replace([]);
    this.setStatus('Please try again.');
    return false;
  }

  setStatus = (message) => {
    this.statusText = message;
    setTimeout(() => {
      if (this.statusText === message) {
        this.statusText = '';
      }
    }, 3000);
  }
}
