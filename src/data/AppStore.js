import { observable } from 'mobx';
import { Dimensions } from 'react-native';

export default class AppState {
  @observable navigator = {};
  @observable orientation = 0;
  @observable letters = [];
  constructor() {
    const { width, height } = Dimensions.get('window');
    Dimensions.addEventListener('change', (data) => {
      if (data.window.width < data.window.height) {
        this.orientation = 0;
      } else {
        this.orientation = 1;
      }
    });
    if (width < height) {
      this.orientation = 0;
    } else {
      this.orientation = 1;
    }
  }
  nav = {
    goto: (screen) => {
      if (typeof (this.navigator.dispatch) === 'undefined') {
        return false;
      }
      return this.navigator.dispatch({ type: 'Navigation/NAVIGATE', routeName: screen });
    },
  }
}
