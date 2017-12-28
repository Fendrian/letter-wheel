import React from 'react';
import PropTypes from 'prop-types';
import {
  Text,
  TouchableOpacity,
  Vibration,
  View,
} from 'react-native';

import GridStyle from '../styles/GridStyle';

export default class Grid extends React.Component {
  static propTypes = {
    grid: PropTypes.objectOf(PropTypes.object).isRequired,
    onCorrect: PropTypes.func,
    onWrong: PropTypes.func,
    submitWord: PropTypes.func.isRequired,
    toggleSelected: PropTypes.func.isRequired,
  }
  static defaultProps = {
    onCorrect() {},
    onWrong() {},
  }
  makeBlock = (i) => {
    const { letter, selected } = this.props.grid[i];
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
      this.props.onCorrect();
    } else if (wordValidity === false) {
      this.props.onWrong();
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
    return (
      <View style={GridStyle.container}>
        {rows}
      </View>
    );
  }
}
