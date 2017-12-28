import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { computed } from 'mobx';
import { inject, observer } from 'mobx-react';
import nativeTimer from 'react-native-timer';
import * as Animatable from 'react-native-animatable';
import KeyEvent from 'react-native-keyevent';

import WrapperStyle from '../styles/WrapperStyle';
import GameScreenStyle from '../styles/GameScreenStyle';
import Grid from '../components/Grid';
import Control from '../components/Control';

const customPulse = {
  0: {
    scale: 1,
  },
  0.05: {
    scale: 1,
  },
  0.3: {
    scale: 1.05,
  },
  0.7: {
    scale: 0.95,
  },
  0.95: {
    scale: 1,
  },
  1: {
    scale: 1,
  },
};

const customShake = {
  0: {
    translateX: 0,
  },
  0.25: {
    translateX: -6,
  },
  0.375: {
    translateX: 6,
  },
  0.5: {
    translateX: -6,
  },
  0.625: {
    translateX: 6,
  },
  0.75: {
    translateX: -6,
  },
  1: {
    translateX: 0,
  },
};

@inject('appStore') @observer
export default class GameScreen extends React.Component {
  static propTypes = {
    appStore: PropTypes.shape({
      aboutModal: PropTypes.object,
      letters: PropTypes.string.isRequired,
      navigator: PropTypes.object,
      gameModal: PropTypes.object,
      instructionsModal: PropTypes.object,
      orientation: PropTypes.number.isRequired,
      selected: PropTypes.object.isRequired,
      scoreGame: PropTypes.func.isRequired,
      submitWord: PropTypes.func.isRequired,
      timer: PropTypes.number.isRequired,
      toggleSelected: PropTypes.func.isRequired,
    }).isRequired,
  }

  constructor() {
    super();
    this.state = {
      submitState: '',
    };
  }

  componentDidMount = () => {
    const { appStore } = this.props;

    KeyEvent.onKeyUpListener((keyCode) => {
      if (
        (keyCode === 1 || keyCode === 82) &&
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
            this.props.appStore.timer = (appStore.timer - 1);
          } else {
            this.props.appStore.timer = -1;
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
    this.setState({ submitState: 'correct' });
  }

  onWrong = () => {
    this.setState({ submitState: 'incorrect' });
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

  renderGrid = () => {
    const { gridWrapper } = GameScreenStyle;
    if (this.state.submitState === 'incorrect') {
      return (
        <Animatable.View
          animation={customShake}
          duration={500}
          iterationCount={1}
          onAnimationEnd={() => { this.setState({ submitState: '' }); }}
          style={gridWrapper}
        >
          <Grid
            submitWord={this.props.appStore.submitWord}
            grid={this.grid}
            onCorrect={this.onCorrect}
            onWrong={this.onWrong}
            toggleSelected={this.props.appStore.toggleSelected}
          />
        </Animatable.View>
      );
    } else if (this.state.submitState === 'correct') {
      return (
        <Animatable.View
          animation={customPulse}
          duration={1000}
          iterationCount={1}
          onAnimationEnd={() => { this.setState({ submitState: '' }); }}
          style={gridWrapper}
        >
          <Grid
            submitWord={this.props.appStore.submitWord}
            grid={this.grid}
            onCorrect={this.onCorrect}
            onWrong={this.onWrong}
            toggleSelected={this.props.appStore.toggleSelected}
          />
        </Animatable.View>
      );
    }
    return (
      <View style={gridWrapper}>
        <Grid
          submitWord={this.props.appStore.submitWord}
          grid={this.grid}
          onCorrect={this.onCorrect}
          onWrong={this.onWrong}
          toggleSelected={this.props.appStore.toggleSelected}
        />
      </View>
    );
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
