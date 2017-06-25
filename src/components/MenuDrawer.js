import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableHighlight } from 'react-native';
import { inject, observer } from 'mobx-react';

import MenuDrawerStyle from '../styles/MenuDrawerStyle';

@inject('appStore') @observer
export default class MenuDrawer extends React.Component {
  static propTypes = {
    appStore: PropTypes.shape({
      gameMenu: PropTypes.object,
      nav: PropTypes.object.isRequired,
      scoreGame: PropTypes.func.isRequired,
    }).isRequired,
  }
  render() {
    const {
      gameMenu,
      nav,
      scoreGame,
    } = this.props.appStore;
    return (
      <View style={MenuDrawerStyle.container}>
        <TouchableHighlight
          onPress={() => {
            gameMenu.close();
            scoreGame();
          }}
          style={MenuDrawerStyle.line}
        >
          <Text style={MenuDrawerStyle.text}>
            Score This Game
          </Text>
        </TouchableHighlight>
        <TouchableHighlight
          onPress={() => {
            gameMenu.close();
            nav.goto('New');
          }}
          style={MenuDrawerStyle.line}
        >
          <Text style={MenuDrawerStyle.text}>
            New Game
          </Text>
        </TouchableHighlight>
      </View>
    );
  }
}
