import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { inject, observer } from 'mobx-react';

import WrapperStyle from '../styles/WrapperStyle';
import GameScreenStyle from '../styles/GameScreenStyle';
import Grid from '../components/Grid';
import Control from '../components/Control';

@inject('appStore') @observer
export default class LoadingScreen extends React.Component {
  static propTypes = {
    appStore: PropTypes.shape({
      orientation: React.PropTypes.number.isRequired,
    }).isRequired,
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
