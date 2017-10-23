import React from 'react';
import PropTypes from 'prop-types';
import { ScrollView, Text, View } from 'react-native';
import { inject, observer } from 'mobx-react';
import { SegmentedControls } from 'react-native-radio-buttons';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import CheckBox from 'react-native-checkbox';
import Button from 'react-native-button';

import WrapperStyle from '../styles/WrapperStyle';
import NewScreenStyle from '../styles/NewScreenStyle';

const options = [
  {
    label: '10-49',
    min: 10,
    max: 49,
  },
  {
    label: '50-99',
    min: 50,
    max: 99,
  },
  {
    label: '100+',
    min: 100,
    max: 999,
  },
];

@inject('appStore') @observer
export default class NewScreen extends React.Component {
  static propTypes = {
    appStore: PropTypes.shape({
      instructionsModal: PropTypes.object,
      loading: PropTypes.bool.isRequired,
      nav: PropTypes.shape({
        goto: PropTypes.func.isRequired,
      }).isRequired,
      newGame: PropTypes.func.isRequired,
      newGameOptions: PropTypes.shape({
        timed: PropTypes.bool.isRequired,
        wordRange: PropTypes.shape({
          min: PropTypes.number,
          max: PropTypes.number,
        }).isRequired,
      }).isRequired,
      width: PropTypes.number.isRequired,
    }).isRequired,
  }
  constructor() {
    super();
    this.state = {
      min: 0,
      max: 0,
    };
  }
  componentDidMount = () => {
    this.setState(this.props.appStore.newGameOptions.wordRange);
  }
  onSliderMove = (sliderPosition) => {
    if (Array.isArray(sliderPosition)) {
      const { newGameOptions } = this.props.appStore;
      Object.assign(newGameOptions, {
        wordRange: {
          min: sliderPosition[0],
          max: sliderPosition[1],
        },
      });
    }
  }
  setSelectedOption = ({ min, max }) => {
    const { newGameOptions } = this.props.appStore;
    const wordRange = { min, max };
    Object.assign(newGameOptions, {
      wordRange,
    });
    this.setState(wordRange);
  }
  getSelectedOption = () => {
    const { min, max } = this.props.appStore.newGameOptions.wordRange;
    return options.indexOf(options.find(option => (
      min === option.min && max === option.max
    )));
  }
  getSliderWidth = () => {
    const { width } = this.props.appStore;
    return width < 400 ? (width - 70) : 330;
  }
  toggleTimed = () => {
    const { newGameOptions } = this.props.appStore;
    Object.assign(newGameOptions, {
      timed: !newGameOptions.timed,
    });
  }
  start = () => {
    const { appStore } = this.props;
    const start = new Date().getTime();
    this.props.appStore.loading = true;
    appStore.newGame({
      wordsMin: appStore.newGameOptions.wordRange.min,
      wordsMax: appStore.newGameOptions.wordRange.max,
      timer: appStore.newGameOptions.timed ? -1 : undefined,
    })
      .then(() => {
        // Wait a minimum of 500ms to help the loading screen feel right
        const end = new Date().getTime();
        setTimeout(() => {
          appStore.nav.goto('Game');
          this.props.appStore.loading = false;
        }, (500 - (end - start)));
      });
  }
  render() {
    const {
      start,
      setSelectedOption,
      toggleTimed,
    } = this;
    const {
      timed,
      wordRange,
    } = this.props.appStore.newGameOptions;
    const { instructionsModal } = this.props.appStore;
    const selected = [this.state.min, this.state.max];
    const optionsArray = [...Array.from(Array(91)).map((a, i) => i + 10), 999];
    const { container } = WrapperStyle;
    const {
      button,
      buttonText,
      header,
      headerText,
      menuRow,
      segmented,
      sliderStyle,
      timer,
      timerLabel,
      wordItems,
      words,
      wordsGenerated,
      wrapper,
    } = NewScreenStyle;
    const tint = '#555';
    return (
      <View style={container}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          style={{
            width: this.props.appStore.width,
          }}
        >
          <View style={wrapper}>
            <View style={header}>
              <Text style={headerText}>
                NEW GAME
              </Text>
            </View>
            <View style={menuRow}>
              <View style={words}>
                <SegmentedControls
                  containerBorderTint={tint}
                  extractText={option => option.label}
                  onSelection={setSelectedOption}
                  options={options}
                  optionStyle={wordItems}
                  selectedIndex={this.getSelectedOption()}
                  separatorTint={tint}
                  style={segmented}
                  tint={tint}
                />
              </View>
            </View>
            <View style={menuRow}>
              <Text style={wordsGenerated}>
                {
                  wordRange.max !== 999 ?
                  `${wordRange.min} to ${wordRange.max} words` :
                  `At least ${wordRange.min} words`
                }
              </Text>
            </View>
            <View style={menuRow}>
              <MultiSlider
                containerStyle={sliderStyle}
                markerStyle={{
                  height: 30,
                  width: 30,
                  borderRadius: 15,
                  backgroundColor: '#fff',
                  borderWidth: 2,
                  borderColor: '#555',
                }}
                onValuesChange={this.onSliderMove}
                optionsArray={optionsArray}
                selectedStyle={{
                  backgroundColor: '#444',
                }}
                sliderLength={this.getSliderWidth()}
                trackStyle={{
                  alignSelf: 'center',
                  height: 10,
                  borderRadius: 10,
                }}
                unselectedStyle={{
                  backgroundColor: '#999',
                }}
                values={selected}
              />
            </View>
            <View style={menuRow}>
              <View style={timer}>
                <CheckBox
                  label="Timed Game:"
                  labelBefore
                  labelStyle={timerLabel}
                  checked={timed}
                  onChange={toggleTimed}
                />
              </View>
            </View>
            <View style={menuRow}>
              <Button
                containerStyle={button}
                style={buttonText}
                onPress={() => {
                  instructionsModal.close();
                  instructionsModal.open();
                }}
              >
                Instructions
              </Button>
              <View style={{ flex: 1 }} />
              <Button
                containerStyle={button}
                style={buttonText}
                onPress={start}
              >
                Start Game
              </Button>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}
