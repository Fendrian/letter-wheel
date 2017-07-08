import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { inject, observer } from 'mobx-react';
import nativeTimer from 'react-native-timer';

import WrapperStyle from '../styles/WrapperStyle';
import GameScreenStyle from '../styles/GameScreenStyle';
import Grid from '../components/Grid';
import Control from '../components/Control';

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
  render() {
    const { appStore } = this.props;
    const orientation = appStore.orientation === 0 ? 'portrait' : 'landscape';
    const {
      dataWrapper,
      gridWrapper,
    } = GameScreenStyle;
    const { container } = WrapperStyle;
    return (
      <View style={container}>
        <View style={GameScreenStyle[orientation]}>
          <View style={gridWrapper}>
            <Grid />
          </View>
          <View style={dataWrapper}>
            <Control />
          </View>
        </View>
      </View>
    );
  }
}
