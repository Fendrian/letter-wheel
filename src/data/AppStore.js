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
    Object.assign(this.letters, (typeof (options.letters) === 'object') ? options.letters : (() => {
      const words = Object.keys(dict9);
      const word = words[Math.floor(Math.random() * words.length)];
      const s = shuffle(word).split('');
      return { 1: s[0], 2: s[1], 3: s[2], 4: s[3], 5: s[4], 6: s[5], 7: s[6], 8: s[7], 9: s[8] };
    })());
    this.timer = (typeof (options.timer) === 'number') ? options.timer : -1;
    this.tried = (typeof (options.tried) === 'object') ? { all: options.tried } : { all: [] };
    this.selected = { all: [] };
  }
}
