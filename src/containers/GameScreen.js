import React from 'react';
import PropTypes from 'prop-types';
import { Button, Text, View } from 'react-native';
import { inject, observer } from 'mobx-react';

import WrapperStyle from '../styles/WrapperStyle';
import GameScreenStyle from '../styles/GameScreenStyle';
import Grid from '../components/Grid';

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
    return (
      <View style={WrapperStyle.container}>
        <View style={GameScreenStyle[orientation]}>
          <View style={GameScreenStyle.gridWrapper}>
            <Grid />
          </View>
          <View style={GameScreenStyle.dataWrapper}>
            <Text>
              {`Words to be found: ${appStore.words.length}.`}
            </Text>
            <Button
              onPress={appStore.submitWord}
              title="Submit"
              color="#999"
            />
          </View>
        </View>
      </View>
    );
  }
}
