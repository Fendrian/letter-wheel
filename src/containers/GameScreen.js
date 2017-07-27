import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { inject, observer } from 'mobx-react';
import nativeTimer from 'react-native-timer';
import * as Animatable from 'react-native-animatable';

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
      navigator: PropTypes.object,
      gameModal: PropTypes.object,
      instructionsModal: PropTypes.object,
      orientation: PropTypes.number.isRequired,
      scoreGame: PropTypes.func.isRequired,
      timer: PropTypes.number.isRequired,
    }).isRequired,
  }
  constructor() {
    super();
    this.state = {
      submitState: '',
    };
  }
  componentDidMount = () => {
    nativeTimer.setInterval(
      this,
      'gameTimer',
      () => {
        const { appStore } = this.props;
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
  }
  onCorrect = () => {
    this.setState({ submitState: 'correct' });
  }
  onWrong = () => {
    this.setState({ submitState: 'incorrect' });
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
            onCorrect={this.onCorrect}
            onWrong={this.onWrong}
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
            onCorrect={this.onCorrect}
            onWrong={this.onWrong}
          />
        </Animatable.View>
      );
    }
    return (
      <View style={gridWrapper}>
        <Grid
          onCorrect={this.onCorrect}
          onWrong={this.onWrong}
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
