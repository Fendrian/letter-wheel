import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { action, computed, observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import nativeTimer from 'react-native-timer';
import * as Animatable from 'react-native-animatable';
import KeyEvent from 'react-native-keyevent';

import WrapperStyle from '../styles/WrapperStyle';
import GameScreenStyle from '../styles/GameScreenStyle';
import Grid from '../components/Grid';
import Control from '../components/Control';

@inject('appStore')
@observer
export default class GameScreen extends React.Component {
  static propTypes = {
    appStore: PropTypes.shape({
      aboutModal: PropTypes.object,
      gameModal: PropTypes.object,
      instructionsModal: PropTypes.object,
      letters: PropTypes.string.isRequired,
      navigator: PropTypes.object,
      orientation: PropTypes.number.isRequired,
      scoreGame: PropTypes.func.isRequired,
      selected: PropTypes.object.isRequired,
      setTimer: PropTypes.func.isRequired,
      submitWord: PropTypes.func.isRequired,
      timer: PropTypes.number.isRequired,
      toggleSelected: PropTypes.func.isRequired,
    }).isRequired,
  }

  static customPulseAnimation = {
    0.00: { scale: 1 },
    0.05: { scale: 1 },
    0.30: { scale: 1.05 },
    0.70: { scale: 0.95 },
    0.95: { scale: 1 },
    1.00: { scale: 1 },
  };

  static customShakeAnimation = {
    0.000: { translateX: 0 },
    0.250: { translateX: -6 },
    0.375: { translateX: 6 },
    0.500: { translateX: -6 },
    0.625: { translateX: 6 },
    0.750: { translateX: -6 },
    1.000: { translateX: 0 },
  };

  componentDidMount = () => {
    const { appStore } = this.props;

    KeyEvent.onKeyUpListener((keyCode) => {
      const SOFT_LEFT = 1;
      const OPTION_KEY = 82;
      if (
        (keyCode === SOFT_LEFT || keyCode === OPTION_KEY) &&
        appStore.gameModal.state.isOpen !== true &&
        appStore.aboutModal.state.isOpen !== true &&
        appStore.instructionsModal.state.isOpen !== true
      ) {
        appStore.gameModal.close();
        appStore.gameModal.open();
      }
    });

    nativeTimer.setInterval(
      this,
      'gameTimer',
      () => {
        const { nav } = appStore.navigator.state;

        // Only process the timer if it's active,
        // and the user is focused on the game screen
        if (
          appStore.timer >= 0 &&
          appStore.scored !== true &&
          nav.routes[nav.index].routeName === 'Game' &&
          appStore.gameModal.state.isOpen !== true &&
          appStore.aboutModal.state.isOpen !== true &&
          appStore.instructionsModal.state.isOpen !== true
        ) {
          if (appStore.timer > 0) {
            this.props.appStore.setTimer(appStore.timer - 1);
          } else {
            this.props.appStore.setTimer(-1);
            appStore.scoreGame();
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

  onCorrect = () => {
    this.triggerAnimation('correct');
  }

  onWrong = () => {
    this.triggerAnimation('incorrect');
  }

  @computed get grid() {
    const grid = {};
    Array.from(Array(9)).forEach((x, i) => {
      grid[`${i}`] = {
        letter: this.props.appStore.letters.substr(i, 1),
        selected: this.props.appStore.selected.indexOf(`${i}`) !== -1,
      };
    });
    return grid;
  }

  @observable animationState = '';
  @action triggerAnimation = (str) => {
    this.animationState = str;
  }
  @action clearAnimation = () => {
    this.animationState = '';
  }

  renderGrid = () => {
    const { gridWrapper } = GameScreenStyle;
    const GridComponent = (
      <Grid
        submitWord={this.props.appStore.submitWord}
        grid={this.grid}
        onCorrect={this.onCorrect}
        onWrong={this.onWrong}
        toggleSelected={this.props.appStore.toggleSelected}
      />
    );
    switch (this.animationState) {
      case 'correct':
        return (
          <Animatable.View
            animation={this.constructor.customPulseAnimation}
            duration={1000}
            iterationCount={1}
            onAnimationEnd={this.clearAnimation}
            style={gridWrapper}
          >
            {GridComponent}
          </Animatable.View>
        );
      case 'incorrect':
        return (
          <Animatable.View
            animation={this.constructor.customShakeAnimation}
            duration={500}
            iterationCount={1}
            onAnimationEnd={this.clearAnimation}
            style={gridWrapper}
          >
            {GridComponent}
          </Animatable.View>
        );
      default:
        return (
          <View style={gridWrapper}>
            {GridComponent}
          </View>
        );
    }
  }
  render() {
    const { appStore } = this.props;
    const orientation = appStore.orientation === 0 ? 'portrait' : 'landscape';
    const { dataWrapper } = GameScreenStyle;
    const { container } = WrapperStyle;
    return (
      <View style={container}>
        <View style={GameScreenStyle[orientation]}>
          {this.renderGrid()}
          <View style={dataWrapper}>
            <Control
              onCorrect={this.onCorrect}
              onWrong={this.onWrong}
            />
          </View>
        </View>
      </View>
    );
  }
}
