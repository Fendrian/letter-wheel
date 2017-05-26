import React from 'react';
import { Text, View } from 'react-native';

import WrapperStyle from '../styles/WrapperStyle';
import GameScreenStyle from '../styles/GameScreenStyle';

export default class LoadingScreen extends React.Component {
  render() {
    return (
      <View style={WrapperStyle.container}>
        <View style={GameScreenStyle.wrapper}>
          <Text>
            WELCOME!
          </Text>
        </View>
      </View>
    );
  }
}
