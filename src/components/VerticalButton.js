import React from 'react';
import PropTypes from 'prop-types';
import { Image, Text, TouchableWithoutFeedback, View } from 'react-native';
import { observer } from 'mobx-react';
import { action, observable } from 'mobx';

import VerticalButtonStyle from '../styles/VerticalButtonStyle';

import verticalButtonYellowPassive from '../images/verticalButtonYellowPassive.png';
import verticalButtonYellowActive from '../images/verticalButtonYellowActive.png';

@observer
export default class Button extends React.Component {
  static propTypes = {
    content: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.node,
    ]),
    onPress: PropTypes.func,
  }
  static defaultProps = {
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
    const unpressed = verticalButtonYellowPassive;
    const pressed = verticalButtonYellowActive;

    return (
      <View style={VerticalButtonStyle.wrapper}>
        <Image
          fadeDuration={0}
          resizeMode="stretch"
          source={pressed}
          style={[
            VerticalButtonStyle.image,
            { opacity: this.isPressing ? 1 : 0 },
          ]}
        />
        <Image
          fadeDuration={0}
          resizeMode="stretch"
          source={unpressed}
          style={[
            VerticalButtonStyle.image,
            { opacity: this.isPressing ? 0 : 1 },
          ]}
        />
        <TouchableWithoutFeedback
          onPress={this.props.onPress}
          onPressIn={this.beginPress}
          onPressOut={this.endPress}
        >
          <View style={VerticalButtonStyle.contentWrapper}>
            <Text
              style={VerticalButtonStyle.text}
            >
              {this.props.content.toUpperCase()}
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}
