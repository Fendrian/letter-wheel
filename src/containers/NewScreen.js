import React from 'react';
import { Alert, Button, Text, View } from 'react-native';

import WrapperStyle from '../styles/WrapperStyle';
import NewScreenStyle from '../styles/NewScreenStyle';

export default class LoadingScreen extends React.Component {
  start() {
    Alert.alert('Coming soon', 'This feature is still under development.');
    console.log('start game');
  }
  instructions() {
    Alert.alert('Coming soon', 'This feature is still under development.');
  }
  render() {
    const { start, instructions } = this;
    return (
      <View style={WrapperStyle.container}>
        <View style={NewScreenStyle.header}>
          <Text style={NewScreenStyle.headerText}>
            NEW GAME
          </Text>
        </View>
        <View style={NewScreenStyle.body}>
          <View style={NewScreenStyle.words}>
            <Text>
              WORD COUNT
            </Text>
          </View>
          <View style={NewScreenStyle.timer}>
            <Text>
              TIMER?
            </Text>
          </View>
          <View style={NewScreenStyle.buttonWrapper}>
            <View style={NewScreenStyle.buttons}>
              <Button onPress={instructions} title={'Instructions'} />
            </View>
            <View style={NewScreenStyle.buttons}>
              <Button onPress={start} title={'Start Game'} />
            </View>
          </View>
        </View>
      </View>
    );
  }
}
