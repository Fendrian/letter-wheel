import React from 'react';
import PropTypes from 'prop-types';
import { Image, Text, TouchableWithoutFeedback, View } from 'react-native';
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
    content: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.node,
    ]),
    onPress: PropTypes.func,
  }
  static defaultProps = {
    colour: 'yellow',
    content: '',
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
      <View style={ButtonStyle.wrapper}>
        <Image
          fadeDuration={0}
          resizeMode="stretch"
          source={pressed}
          style={[
            ButtonStyle.image,
            { opacity: this.isPressing ? 1 : 0 },
          ]}
        />
        <Image
          fadeDuration={0}
          resizeMode="stretch"
          source={unpressed}
          style={[
            ButtonStyle.image,
            { opacity: this.isPressing ? 0 : 1 },
          ]}
        />
        <TouchableWithoutFeedback
          onPress={this.props.onPress}
          onPressIn={this.beginPress}
          onPressOut={this.endPress}
        >
          <View style={ButtonStyle.contentWrapper}>
            {typeof (this.props.content) === 'string' ?
              <Text
                style={ButtonStyle.text}
              >
                {this.props.content.toUpperCase()}
              </Text>
              :
              this.props.content
            }
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}
