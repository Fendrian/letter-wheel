import React from 'react';
import { Text, View } from 'react-native';

import WrapperStyle from '../styles/WrapperStyle';
import NewScreenStyle from '../styles/NewScreenStyle';

export default class LoadingScreen extends React.Component {
  render() {
    return (
      <View style={WrapperStyle.container}>
        <View style={NewScreenStyle.wrapper}>
          <Text>
            WELCOME!
          </Text>
        </View>
      </View>
    );
  }
}
