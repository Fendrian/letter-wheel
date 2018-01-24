import React from 'react';
import PropTypes from 'prop-types';
import {
  Text,
  TouchableOpacity,
  Vibration,
  View,
} from 'react-native';
import { observer } from 'mobx-react';
import * as Animatable from 'react-native-animatable';

import GridStyle from '../styles/GridStyle';

const customPulseAnimation = {
  0.00: { scale: 1 },
  0.05: { scale: 1 },
  0.30: { scale: 1.05 },
  0.70: { scale: 0.95 },
  0.95: { scale: 1 },
  1.00: { scale: 1 },
};

const customShakeAnimation = {
  0.000: { translateX: 0 },
  0.250: { translateX: -6 },
  0.375: { translateX: 6 },
  0.500: { translateX: -6 },
  0.625: { translateX: 6 },
  0.750: { translateX: -6 },
  1.000: { translateX: 0 },
};

@observer
export default class Grid extends React.Component {
  static propTypes = {
    animationState: PropTypes.string,
    clearAnimation: PropTypes.func,
    gridEntries: PropTypes.oneOfType([
      PropTypes.objectOf(PropTypes.shape({
        letter: PropTypes.string,
        selected: PropTypes.bool,
      })),
      PropTypes.arrayOf(PropTypes.shape({
        letter: PropTypes.string,
        selected: PropTypes.bool,
      })),
    ]),
    submitWord: PropTypes.func,
    toggleSelected: PropTypes.func,
    triggerAnimation: PropTypes.func,
  }

  static defaultProps = {
    animationState: '',
    clearAnimation() {},
    gridEntries: Array.from(Array(9)).map(() => ({
      letter: '',
      selected: false,
    })),
    submitWord() {},
    toggleSelected() {},
    triggerAnimation() {},
  }

  makeBlock = (i) => {
    const { letter, selected } = this.props.gridEntries[i];
    let style = 'block';
    if (i === '4') {
      style = 'centerBlock';
    }

    if (selected) {
      style = `${style}Selected`;
    }

    return (
      <TouchableOpacity
        onPress={() => { this.props.toggleSelected(i); }}
        onLongPress={() => {
          Vibration.vibrate(100);
          if (!selected) {
            this.props.toggleSelected(i);
          }
          this.submitWord();
        }}
        style={GridStyle[style]}
        key={`gridItem${i}`}
      >
        <Text style={GridStyle.letter}>
          {letter.toUpperCase()}
        </Text>
      </TouchableOpacity>
    );
  }

  submitWord = () => {
    const wordValidity = this.props.submitWord();
    if (wordValidity === true) {
      this.props.triggerAnimation('correct');
    } else if (wordValidity === false) {
      this.props.triggerAnimation('incorrect');
    }
  }

  render() {
    const rows = [['0', '1', '2'], ['3', '4', '5'], ['6', '7', '8']].map(block => (
      <View style={GridStyle.row} key={block.join('')}>
        {
          block.map(i => (
            this.makeBlock(i)
          ))
        }
      </View>
    ));

    const animationType = {};
    switch (this.props.animationState) {
      case 'correct':
        animationType.animation = customPulseAnimation;
        animationType.duration = 1000;
        break;
      case 'incorrect':
        animationType.animation = customShakeAnimation;
        animationType.duration = 500;
        break;
      default:
        animationType.animation = { 0: {}, 1: {} };
        animationType.duration = 0;
        break;
    }

    return (
      <Animatable.View
        animation={animationType.animation}
        duration={animationType.duration}
        iterationCount={1}
        onAnimationEnd={this.props.clearAnimation}
        style={GridStyle.gridWrapper}
      >
        <View style={GridStyle.container}>
          {rows}
        </View>
      </Animatable.View>
    );
  }
}
