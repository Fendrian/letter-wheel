import { observable } from 'mobx';
import { Alert, Dimensions } from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import dict4 from './dictionary_4.json';
import dict5 from './dictionary_5.json';
import dict6 from './dictionary_6.json';
import dict7 from './dictionary_7.json';
import dict8 from './dictionary_8.json';
import dict9 from './dictionary_9.json';

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

    // Open he word database
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
  newGame = (options) => {
    // Find the new nine-letter word
    const word = dict9[Math.floor(Math.random() * dict9.length)];

    const letters = {};

    // Iterate over letters of nine-letter word
    for (let i = 0; i < 9; i += 1) {
      if (typeof (letters[word[i]]) === 'undefined') {
        letters[word[i]] = 0;
      }
      letters[word[i]] += 1;
    }

    const start = new Date().getTime();
    console.log(`Letters are ${Object.keys(letters)}`);

    // Filter dictionary to only words that contain the center letter
    const words = [];
    const dicts = [dict4, dict5, dict6, dict7, dict8, dict9];

    // Iterate over dictionary objects on dict[i]
    for (let i = 0; i < dicts.length; i += 1) {
      // Iterate over words in each dictionary on dicts[i][j]
      for (let j = 1; j < dicts[i].length; j += 1) {
        // Break the word apart into letters
        const l = dicts[i][j].split('').sort();

        // Match helps deal with repeat letters
        let match = ['', 0];
        let total = 0;
        // Iterate over the letters of our word on l[k]
        for (let k = 0; k < l.length; k += 1) {
          if (typeof (letters[l[k]]) !== 'undefined') {
            if (match[0] === l[k]) { // This match is a repeated letter
              if (match[1] < letters[l[k]]) { // Only match if this many letters are in the word
                total += 1;
                match[1] += 1;
              }
            } else { // This match is not repeated (yet)
              total += 1;
              match = [l[k], 1];
            }
          }
        }
        // Only proceed if all letters are present
        if (total === dicts[i][j].length) {
          words.push(dicts[i][j]);
        }
      }
    }

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
  }
}
