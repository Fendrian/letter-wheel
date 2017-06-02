import { observable } from 'mobx';
import { Dimensions } from 'react-native';
import dict4 from './dictionary_4';
import dict5 from './dictionary_5';
import dict6 from './dictionary_6';
import dict7 from './dictionary_7';
import dict8 from './dictionary_8';
import dict9 from './dictionary_9';

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
    // Generate a scrambled nine-letter word:
    Object.assign(this.letters, (typeof (options.letters) === 'object') ? options.letters : (() => {
      const word = dict9[Math.floor(Math.random() * dict9.length)];
      const s = shuffle(word).split('');
      return { 1: s[0], 2: s[1], 3: s[2], 4: s[3], 5: s[4], 6: s[5], 7: s[6], 8: s[7], 9: s[8] };
    })());

    const letters = {};

    // Iterate over letters of nine-letter word in this.letters
    for (let i = 1; i < 10; i += 1) {
      if (typeof (letters[this.letters[i]]) === 'undefined') {
        letters[this.letters[i]] = 0;
      }
      letters[this.letters[i]] += 1;
    }

    console.log(`Letters are ${Object.keys(letters)}`);

    // Filter dictionary to only words that contain the center letter
    const words = [];
    const dicts = [dict4];

    // Iterate over dictionary objects on dict[i]
    for (let i = 0; i < dicts.length; i += 1) {
      // Iterate over words in each dictionary on dicts[i][j]
      for (let j = 1; j < dicts[i].length; j += 1) {
        // Break the word apart into letters
        const l = dicts[i][j].split('');
        const matches = {};
        // Iterate over the letters of our word on l[k]
        for (let k = 0; k < l.length; k += 1) {
          if (typeof (letters[l[k]]) !== 'undefined') {
            if (typeof (matches[l[k]]) === 'undefined') {
              matches[l[k]] = 0;
            }
            if (matches[l[k]] < letters[l[k]]) {
              matches[l[k]] += 1;
            }
          }
        }
        // Only proceed if the word contains the center letter
        if (typeof (matches[this.letters[5]]) !== 'undefined') {
          if (Object.values(matches).reduce((a, b) => a + b) === dicts[i][j].length) {
            words.push(dicts[i][j]);
          }
        }
      }
    }

    console.log(`List of words contains ${words.length} items.`);

    // Set the other variables
    this.timer = (typeof (options.timer) === 'number') ? options.timer : -1;
    this.tried = (typeof (options.tried) === 'object') ? { all: options.tried } : { all: [] };
    this.selected = { all: [] };
  }
}
