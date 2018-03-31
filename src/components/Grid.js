import React from 'react';
import PropTypes from 'prop-types';
import {
  ImageBackground,
  Text,
  TouchableOpacity,
  Vibration,
  View,
} from 'react-native';
import { observer } from 'mobx-react';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/Ionicons';

import GridStyle from '../styles/GridStyle';

import background from '../images/gridBackground.png';
import select1 from '../images/select1.png';
import select2 from '../images/select2.png';
import select3 from '../images/select3.png';
import select4 from '../images/select4.png';
import select5 from '../images/select5.png';
import select6 from '../images/select6.png';
import select7 from '../images/select7.png';
import select8 from '../images/select8.png';
import select9 from '../images/select9.png';

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

const selectImages = [
  select1,
  select2,
  select3,
  select4,
  select5,
  select6,
  select7,
  select8,
  select9,
];

@observer
export default class Grid extends React.Component {
  static propTypes = {
    animationState: PropTypes.string,
    clearAnimation: PropTypes.func,
    clearSelected: PropTypes.func,
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
    selectedLetters: PropTypes.string,
    submitWord: PropTypes.func,
    toggleSelected: PropTypes.func,
    triggerAnimation: PropTypes.func,
  }

  static defaultProps = {
    animationState: '',
    clearAnimation() {},
    clearSelected() {},
    gridEntries: Array.from(Array(9)).map(() => ({
      letter: '',
      selected: false,
    })),
    selectedLetters: '',
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

    return (
      <TouchableOpacity
        activeOpacity={0.8}
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
        <ImageBackground
          source={selected ? selectImages[i] : null}
          style={GridStyle.gridSelect}
        >
          <Text style={GridStyle.letter}>
            {letter.toUpperCase()}
          </Text>
        </ImageBackground>
      </TouchableOpacity>
    );
  }

  clearOne = () => {
    this.props.clearSelected(1);
  }

  clearAll = () => {
    Vibration.vibrate(100);
    this.props.clearSelected(9);
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
    const {
      backspaceWrapper,
      backspaceTouch,
      container,
      entryContainer,
      entryText,
      entryWrapper,
      gridBackground,
      gridWrapper,
    } = GridStyle;

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
        style={gridWrapper}
      >
        <ImageBackground
          resizeMode="stretch"
          source={background}
          style={gridBackground}
        >
          <View style={container}>
            {rows}
          </View>
          <View style={entryContainer}>
            <View style={entryWrapper}>
              <Text style={entryText}>
                {this.props.selectedLetters}
              </Text>
            </View>
            <View style={backspaceWrapper}>
              <TouchableOpacity
                onPress={this.clearOne}
                onLongPress={this.clearAll}
                style={backspaceTouch}
              >
                <Icon
                  name="md-backspace"
                  size={35}
                />
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      </Animatable.View>
    );
  }
}
