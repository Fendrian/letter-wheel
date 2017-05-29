import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity } from 'react-native';
import { inject, observer } from 'mobx-react';

import GridStyle from '../styles/GridStyle';

@inject('appStore') @observer
export default class LoadingScreen extends React.Component {
  static propTypes = {
    appStore: PropTypes.shape({
      letters: PropTypes.object.isRequired,
      selected: PropTypes.object.isRequired,
    }).isRequired,
  }
  selectBlock = (i) => {
    const { appStore } = this.props;
    const { all } = appStore.selected;
    const loc = all.indexOf(i);
    if (loc === -1) {
      appStore.selected = { all: [...all, i] };
    } else {
      appStore.selected = { all: all.slice(0, loc).concat(all.slice((loc + 1), all.length)) };
    }
  }
  makeBlock = (i) => {
    const { props, selectBlock } = this;
    const { appStore } = props;
    const { all } = appStore.selected;
    let style = 'block';
    if (i === '5') {
      style = 'centerBlock';
    }
    if (all.indexOf(i) !== -1) {
      style = `${style}Selected`;
    }
    return (
      <TouchableOpacity onPress={() => { selectBlock(i); }} style={GridStyle[style]} key={i}>
        <Text style={GridStyle.letter}>
          {appStore.letters[i].toUpperCase()}
        </Text>
      </TouchableOpacity>
    );
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
