import { observable } from 'mobx';
import { Alert, Dimensions } from 'react-native';
import SQLite from 'react-native-sqlite-storage';

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

export default class AppState {
  @observable navigator = {};
  @observable orientation = 0;
  @observable letters = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };
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
    const ok = () => {
      console.log('Database opened successfully');
    };
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
      this.db.transaction((tx) => {
        tx.executeSql('SELECT word FROM words9 WHERE _ROWID_ >= (abs(random()) % ((SELECT max(_ROWID_) FROM words9) + 1)) LIMIT 1', [], (tx1, randWordResults) => {
          // Define the new random nine-letter word
          const word = randWordResults.rows.item(0).word;

          const wordLengths = ['4', '5', '6', '7', '8', '9'];

          // Make an object with each letter, and how many times that letter is in the word
          const letters = {};
          const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
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
            tx1.executeSql(query, [], (tx2, results2) => {
              const dict = results2.rows.raw().map(row =>
                row.word,
              );
              wordsResolve(dict);
            });
          })
            .then((vals) => {
              const words = vals.reduce((list, dict) =>
                [...list, ...dict],
              []);

              // See how many valid words we'd have for each different middle letter
              const lengths = Object.assign({}, ...word.split('').map(l => ({ [l]: 0 })));
              console.log(lengths);
              const lengthItems = Object.keys(lengths);

              for (let i = 0; i < lengthItems.length; i += 1) {
                const matches = words.filter(w =>
                  (w.indexOf(lengthItems[i]) !== -1),
                );
                lengths[lengthItems[i]] = matches.length;
              }

              // Log the result
              for (let i = 0; i < lengthItems.length; i += 1) {
                console.log(`${lengthItems[i]} has ${lengths[lengthItems[i]]} matches.`);
              }

              // Generate a scrambled nine-letter word:
              Object.assign(this.letters, (typeof (options.letters) === 'object') ? options.letters : (() => {
                const s = shuffle(word).split('');
                return { 1: s[0], 2: s[1], 3: s[2], 4: s[3], 5: s[4], 6: s[5], 7: s[6], 8: s[7], 9: s[8] };
              })());

              const end = new Date().getTime();
              console.log(`Word generation took ${end - start} milliseconds.`);

              // Set the other variables
              this.timer = (typeof (options.timer) === 'number') ? options.timer : -1;
              this.tried = (typeof (options.tried) === 'object') ? { all: options.tried } : { all: [] };
              this.selected = { all: [] };

              resolve();
            });
        });
      });
    });
  }
