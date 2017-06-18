import React from 'react';
import PropTypes from 'prop-types';
import {
  Alert,
  Text,
  View,
} from 'react-native';
import { inject, observer } from 'mobx-react';
import { SegmentedControls } from 'react-native-radio-buttons';
import CheckBox from 'react-native-checkbox';
import Button from 'react-native-button';

import WrapperStyle from '../styles/WrapperStyle';
import NewScreenStyle from '../styles/NewScreenStyle';

const options = [
  {
    label: '1-30\nWords',
    min: 1,
    max: 30,
    value: 0,
  },
  {
    label: '31-75\nWords',
    min: 31,
    max: 75,
    value: 1,
  },
  {
    label: '76+\nWords',
    min: 76,
    max: 999,
    value: 2,
  },
];

@inject('appStore') @observer
export default class LoadingScreen extends React.Component {
  static propTypes = {
    appStore: PropTypes.shape({
      nav: PropTypes.shape({
        goto: PropTypes.func.isRequired,
      }).isRequired,
    }).isRequired,
  }
  constructor(props) {
    super(props);
    this.state = {
      wordSelection: 0,
      timed: false,
    };
  }
  setSelectedOption = (wordSelection) => {
    this.setState({ wordSelection: wordSelection.value });
  }
  setTimed = (timed) => {
    this.setState({ timed: !timed });
  }
  instructions() { // eslint-disable-line class-methods-use-this
    Alert.alert('Coming soon', 'Instructions are still under development and will be implemented soon.');
  }
  start = () => {
    const { appStore } = this.props;
    const start = new Date().getTime();
    appStore.loading = true;
    appStore.newGame({
      wordsMin: options[this.state.wordSelection].min,
      wordsMax: options[this.state.wordSelection].max,
      timer: this.state.timed ? 60 : -1,
    })
      .then(() => {
        // Wait a minimum of 500ms to help the loading screen feel right
        const end = new Date().getTime();
        setTimeout(() => {
          appStore.nav.goto('Game');
          appStore.loading = false;
        }, (500 - (end - start)));
      });
  }
  render() {
    const {
      start,
      instructions,
      setSelectedOption,
      setTimed,
    } = this;
    const { timed } = this.state;
    const tint = '#555';
    return (
      <View style={WrapperStyle.container}>
        <View style={NewScreenStyle.header}>
          <Text style={NewScreenStyle.headerText}>
            NEW GAME
          </Text>
        </View>
        <View style={NewScreenStyle.body}>
          <View style={NewScreenStyle.words}>
            <SegmentedControls
              containerBorderTint={tint}
              containerStyle={NewScreenStyle.wordContainer}
              separatorTint={tint}
              tint={tint}
              options={options}
              onSelection={setSelectedOption}
              selectedIndex={this.state.wordSelection}
              optionStyle={NewScreenStyle.wordItems}
              extractText={option => option.label}
            />
          </View>
          <View style={NewScreenStyle.timer}>
            <CheckBox
              label={'Timed Game:'}
              labelBefore
              labelStyle={NewScreenStyle.timerLabel}
              checked={timed}
              onChange={setTimed}
            />
          </View>
          <View style={NewScreenStyle.buttonWrapper}>
            <Button
              style={NewScreenStyle.buttons}
              onPress={instructions}
            >
              Instructions
            </Button>
            <Button
              style={NewScreenStyle.buttons}
              onPress={start}
            >
              Start Game
            </Button>
          </View>
        </View>
      </View>
    );
  }
}
