import React from 'react';
import PropTypes from 'prop-types';
import { Image, ScrollView, Text, View } from 'react-native';
import { inject, observer } from 'mobx-react';
import { SegmentedControls } from 'react-native-radio-buttons';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import CheckBox from 'react-native-checkbox';
import Button from 'react-native-button';

import WrapperStyle from '../styles/WrapperStyle';
import NewScreenStyle from '../styles/NewScreenStyle';

import background from '../images/Wood-background.jpg';

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

@inject('store')
@observer
export default class NewScreen extends React.Component {
  static propTypes = {
    store: PropTypes.shape({
      openInstructionsModal: PropTypes.func,
      loading: PropTypes.bool.isRequired,
      nav: PropTypes.shape({
        goto: PropTypes.func.isRequired,
      }).isRequired,
      newGame: PropTypes.func.isRequired,
      newGameOptions: PropTypes.shape({
        get: PropTypes.func.isRequired,
      }).isRequired,
      setNewGameOptions: PropTypes.func.isRequired,
      setLoading: PropTypes.func,
      width: PropTypes.number.isRequired,
    }).isRequired,
  }

  onSliderMove = (sliderPosition) => {
    if (Array.isArray(sliderPosition)) {
      this.setSelectedOption({
        min: sliderPosition[0],
        max: sliderPosition[1],
      });
    }
  }

  setSelectedOption = ({ min, max }) => {
    this.props.store.setNewGameOptions('wordRange', {
      min,
      max,
    });
  }

  getSelectedOption = () => {
    const { min, max } = this.props.store.newGameOptions.get('wordRange');
    return options.findIndex(option => (
      min === option.min && max === option.max
    ));
  }

  getSliderWidth = () => {
    const { width } = this.props.store;
    return width < 400 ? (width - 70) : 330;
  }

  toggleTimed = () => {
    this.props.store.setNewGameOptions(
      'timed',
      !this.props.store.newGameOptions.get('timed'),
    );
  }

  start = () => {
    const { store } = this.props;
    const start = new Date().getTime();
    const { min, max } = store.newGameOptions.get('wordRange');
    store.setLoading(true);
    store.newGame({
      wordsMin: min,
      wordsMax: max,
      timed: store.newGameOptions.get('timed'),
    })
      .then(() => {
        // Wait a minimum of 500ms to help the loading screen feel right
        const end = new Date().getTime();
        setTimeout(() => {
          store.nav.goto('Game');
          this.props.store.setLoading(false);
        }, (500 - (end - start)));
      });
  }

  render() {
    const { min, max } = this.props.store.newGameOptions.get('wordRange');
    const { openInstructionsModal } = this.props.store;
    const selected = [min, max];
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
      <Image
        source={background}
        style={container}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          style={{
            width: this.props.store.width,
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
                  onSelection={this.setSelectedOption}
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
                  `${max !== 999 ?
                    `${min} to ${max} words`
                    :
                    `At least ${min} words`}`
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
                  checked={this.props.store.newGameOptions.get('timed')}
                  onChange={this.toggleTimed}
                />
              </View>
            </View>
            <View style={menuRow}>
              <Button
                containerStyle={button}
                style={buttonText}
                onPress={openInstructionsModal}
              >
                Instructions
              </Button>
              <View style={{ flex: 1 }} />
              <Button
                containerStyle={button}
                style={buttonText}
                onPress={this.start}
              >
                Start Game
              </Button>
            </View>
          </View>
        </ScrollView>
      </Image>
    );
  }
}
