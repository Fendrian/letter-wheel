import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { action, computed, observable } from 'mobx';
import { inject, observer, PropTypes as MobxPropTypes } from 'mobx-react';
import nativeTimer from 'react-native-timer';
import KeyEvent from 'react-native-keyevent';

import WrapperStyle from '../styles/WrapperStyle';
import GameScreenStyle from '../styles/GameScreenStyle';
import Grid from '../components/Grid';
import Control from '../components/Control';

@inject('store')
@observer
export default class GameScreen extends React.Component {
  static propTypes = {
    store: PropTypes.shape({
      clearSelected: PropTypes.func.isRequired,
      openMenuModal: PropTypes.func.isRequired,
      letters: PropTypes.string.isRequired,
      navigator: PropTypes.object,
      orientation: PropTypes.number.isRequired,
      scoreGame: PropTypes.func.isRequired,
      selected: PropTypes.object.isRequired,
      setTimer: PropTypes.func.isRequired,
      submitWord: PropTypes.func.isRequired,
      timer: PropTypes.number.isRequired,
      tried: MobxPropTypes.observableMap,
      words: MobxPropTypes.observableMap,
      toggleSelected: PropTypes.func.isRequired,
    }).isRequired,
  }

  componentDidMount = () => {
    const { store } = this.props;

    KeyEvent.onKeyUpListener((keyCode) => {
      const SOFT_LEFT = 1;
      const OPTION_KEY = 82;
      if (
        (keyCode === SOFT_LEFT || keyCode === OPTION_KEY) &&
        !store.isMenuModalOpen.state.isOpen &&
        !store.isAboutModalOpen &&
        !store.isInstructionsModalOpen
      ) {
        store.openMenuModal();
      }
    });

    nativeTimer.setInterval(
      this,
      'gameTimer',
      () => {
        const { nav } = store.navigator.state;

        // Only process the timer if it's active,
        // and the user is focused on the game screen
        if (
          store.timer >= 0 &&
          store.scored !== true &&
          nav.routes[nav.index].routeName === 'Game' &&
          !store.isMenuModalOpen &&
          !store.isAboutModalOpen &&
          !store.isInstructionsModalOpen
        ) {
          if (store.timer > 0) {
            this.props.store.setTimer(store.timer - 1);
          } else {
            this.props.store.setTimer(-1);
            store.scoreGame();
          }
        }
      },
      1000,
    );
  }

  componentWillUnmount = () => {
    nativeTimer.clearInterval(this);
    KeyEvent.removeKeyUpListener();
  }

  @computed get gridEntries() {
    const gridEntries = {};
    Array.from(Array(9)).forEach((x, i) => {
      gridEntries[`${i}`] = {
        letter: this.props.store.letters.substr(i, 1),
        selected: this.props.store.selected.indexOf(`${i}`) !== -1,
      };
    });
    return gridEntries;
  }

  @observable animationState = '';
  @action triggerAnimation = (str) => {
    this.animationState = str;
  }
  @action clearAnimation = () => {
    this.animationState = '';
  }

  render() {
    const { store } = this.props;
    const orientation = store.orientation === 0 ? 'portrait' : 'landscape';
    const { dataWrapper } = GameScreenStyle;
    const { container } = WrapperStyle;
    const { text: scoreText, toNext } = store.getScore();

    let timerString = '';
    if (store.timer >= 0) {
      timerString = store.timer / 60 >= 1 ?
        `${Math.floor(store.timer / 60)}m ${store.timer % 60}s`
        :
        `${store.timer % 60}s`;
    }

    return (
      <View style={container}>
        <View style={GameScreenStyle[orientation]}>
          <Grid
            animationState={this.animationState}
            clearAnimation={this.clearAnimation}
            gridEntries={this.gridEntries}
            submitWord={this.props.store.submitWord}
            toggleSelected={this.props.store.toggleSelected}
            triggerAnimation={this.triggerAnimation}
          />
          <View style={dataWrapper}>
            <Control
              clearSelected={store.clearSelected}
              isScored={store.scored}
              onMenu={store.openMenuModal}
              onSubmit={() => {
                if (store.submitWord() === true) {
                  this.triggerAnimation('correct');
                } else {
                  this.triggerAnimation('incorrect');
                }
              }}
              scoreText={scoreText}
              selectedString={store.selected.map(i => store.letters[i].toUpperCase()).join('')}
              statusText={store.statusText}
              timerString={timerString}
              tried={store.tried}
              words={store.words}
              wordsToNextLevel={toNext}
            />
          </View>
        </View>
      </View>
    );
  }
}
