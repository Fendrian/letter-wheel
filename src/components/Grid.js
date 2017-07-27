import React from 'react';
import PropTypes from 'prop-types';
import {
  Text,
  TouchableOpacity,
  Vibration,
  View,
} from 'react-native';
import { inject, observer } from 'mobx-react';

import GridStyle from '../styles/GridStyle';

@inject('appStore') @observer
export default class Grid extends React.Component {
  static propTypes = {
    appStore: PropTypes.shape({
      letters: PropTypes.object.isRequired,
      selected: PropTypes.object.isRequired,
      submitWord: PropTypes.func.isRequired,
    }).isRequired,
    onCorrect: PropTypes.func,
    onWrong: PropTypes.func,
  }
  static defaultProps = {
    onCorrect() {},
    onWrong() {},
  }
  selectBlock = (i) => {
    const { selected } = this.props.appStore;
    const copy = selected.slice();
    const loc = selected.indexOf(i);
    if (loc === -1) {
      selected.replace([...copy, i]);
    } else {
      selected.replace(
        copy.slice(0, loc).concat(copy.slice((loc + 1), copy.length)),
      );
    }
  }
  makeBlock = (i) => {
    const { props, selectBlock } = this;
    const { letters, selected } = props.appStore;
    let style = 'block';
    if (i === '5') {
      style = 'centerBlock';
    }
    if (selected.indexOf(i) !== -1) {
      style = `${style}Selected`;
    }
    return (
      <TouchableOpacity
        onPress={() => { selectBlock(i); }}
        onLongPress={() => {
          Vibration.vibrate(100);
          if (selected.indexOf(i) === -1) {
            selectBlock(i);
          }
          this.submitWord();
        }}
        style={GridStyle[style]}
        key={`gridItem${i}`}
      >
        <Text style={GridStyle.letter}>
          {letters[i].toUpperCase()}
        </Text>
      </TouchableOpacity>
    );
  }
  submitWord = () => {
    const wordValidity = this.props.appStore.submitWord();
    if (wordValidity === true) {
      this.props.onCorrect();
    } else if (wordValidity === false) {
      this.props.onWrong();
    }
  }
  render() {
    const { makeBlock } = this;
    const rows = [['1', '2', '3'], ['4', '5', '6'], ['7', '8', '9']].map(block => (
      <View style={GridStyle.row} key={block.join('')}>
        {
          block.map(i =>
            makeBlock(i),
          )
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
