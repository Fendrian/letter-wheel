import React from 'react';
import PropTypes from 'prop-types';
import { ImageBackground, Text, TouchableWithoutFeedback, View } from 'react-native';
import { observer } from 'mobx-react';
import { action, observable } from 'mobx';

import ButtonStyle from '../styles/ButtonStyle';

import buttonYellowPassive from '../images/buttonYellowPassive.png';
import buttonYellowActive from '../images/buttonYellowActive.png';
import buttonBluePassive from '../images/buttonBluePassive.png';
import buttonBlueActive from '../images/buttonBlueActive.png';

@observer
export default class Button extends React.Component {
  static propTypes = {
    colour: PropTypes.oneOf(['yellow', 'blue']),
    title: PropTypes.string,
    onPress: PropTypes.func,
  }
  static defaultProps = {
    colour: 'yellow',
    title: '',
    onPress() {},
  }

  @action beginPress = () => {
    this.isPressing = true;
  }
  @action endPress = () => {
    this.isPressing = false;
  }
  @observable isPressing = false;

  render() {
    let unpressed;
    let pressed;

    if (this.props.colour === 'yellow') {
      unpressed = buttonYellowPassive;
      pressed = buttonYellowActive;
    }
    if (this.props.colour === 'blue') {
      unpressed = buttonBluePassive;
      pressed = buttonBlueActive;
    }

    return (
      <TouchableWithoutFeedback
        onPress={this.props.onPress}
        onPressIn={this.beginPress}
        onPressOut={this.endPress}
        style={ButtonStyle.wrapper}
      >
        <ImageBackground
          source={this.isPressing ? pressed : unpressed}
          style={ButtonStyle.image}
        >
          <View pointerEvents="none">
            <Text
              style={ButtonStyle.text}
            >
              {this.props.title}
            </Text>
          </View>
        </ImageBackground>
      </TouchableWithoutFeedback>
    );
  }
}
