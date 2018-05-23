import React from 'react';
import PropTypes from 'prop-types';
import { Image, ImageBackground, Text, View } from 'react-native';
import { inject, observer } from 'mobx-react';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import CheckBox from 'react-native-checkbox';

import WrapperStyle from '../styles/WrapperStyle';
import NewScreenStyle from '../styles/NewScreenStyle';
import Button from '../components/Button';
import VerticalButton from '../components/VerticalButton';

import background from '../images/woodBackground.jpg';
import newPanelBody from '../images/newPanelBody.png';
import newPanelBottom from '../images/newPanelBottom.png';
import ticked from '../images/ticked.png';
import unticked from '../images/unticked.png';
import yellowSquare1 from '../images/yellowSquare1.png';
import yellowSquare2 from '../images/yellowSquare2.png';

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
    const selected = [min, max];
    const optionsArray = [...Array.from(Array(91)).map((a, i) => i + 10), 999];
    const { container } = WrapperStyle;
    const {
      buttonWrapper,
      checkBoxWrapper,
      customMarker,
      header,
      headerBackgroundBottom,
      headerBackgroundBody,
      headerText,
      menuRow,
      sliderStyle,
      timer,
      timerLabel,
      verticalButtonWrapper,
      wordsGenerated,
      wordsGeneratedWrapper,
      wrapper,
    } = NewScreenStyle;
    return (
      <ImageBackground
        source={background}
        style={container}
      >
        <View
          style={[
            wrapper,
            { width: this.props.store.width },
          ]}
        >
          <View style={wrapper}>
            <View style={header}>
              <Image
                source={newPanelBody}
                style={headerBackgroundBody}
                resizeMode="stretch"
              />
              <Image
                source={newPanelBottom}
                style={headerBackgroundBottom}
                resizeMode="stretch"
              />
              <View style={menuRow}>
                <Text style={headerText}>
                  TARGET WORDS
                </Text>
              </View>
              <View style={menuRow}>
                <View style={{ flex: 1 }} />
                <View style={verticalButtonWrapper}>
                  <VerticalButton
                    onPress={() => { this.setSelectedOption(options[0]); }}
                    content={options[0].label}
                  />
                </View>
                <View style={{ flex: 1 }} />
                <View style={verticalButtonWrapper}>
                  <VerticalButton
                    onPress={() => { this.setSelectedOption(options[1]); }}
                    content={options[1].label}
                  />
                </View>
                <View style={{ flex: 1 }} />
                <View style={verticalButtonWrapper}>
                  <VerticalButton
                    onPress={() => { this.setSelectedOption(options[2]); }}
                    content={options[2].label}
                  />
                </View>
                <View style={{ flex: 1 }} />
              </View>
              <View style={menuRow}>
                <MultiSlider
                  containerStyle={sliderStyle}
                  isMarkersSeparated
                  customMarkerLeft={() => (
                    <Image
                      source={yellowSquare1}
                      style={customMarker}
                      resizeMode="cover"
                    />
                  )}
                  customMarkerRight={() => (
                    <Image
                      source={yellowSquare2}
                      style={customMarker}
                      resizeMode="cover"
                    />
                  )}
                  onValuesChange={this.onSliderMove}
                  optionsArray={optionsArray}
                  selectedStyle={{
                    backgroundColor: '#444',
                  }}
                  sliderLength={this.getSliderWidth()}
                  trackStyle={{
                    alignSelf: 'center',
                    height: 4,
                    borderRadius: 1,
                  }}
                  unselectedStyle={{
                    backgroundColor: '#ddd',
                  }}
                  values={selected}
                />
              </View>
              <View style={menuRow}>
                <View style={wordsGeneratedWrapper}>
                  <Text style={wordsGenerated}>
                    {
                      `${max !== 999 ?
                        `${min}-${max} words to find`
                        :
                        `over ${min} words to find`}`
                    }
                  </Text>
                </View>
                <View style={timer}>
                  <Button
                    onPress={this.toggleTimed}
                    content={
                      <View
                        style={checkBoxWrapper}
                        pointerEvents="none"
                      >
                        <CheckBox
                          label="Timed Game:"
                          labelBefore
                          labelStyle={timerLabel}
                          checked={this.props.store.newGameOptions.get('timed')}
                          checkedImage={ticked}
                          uncheckedImage={unticked}
                        />
                      </View>
                    }
                  />
                </View>
              </View>
            </View>
            <View style={menuRow}>
              <View style={buttonWrapper}>
                <Button
                  onPress={this.props.store.openInstructionsModal}
                  content="Instructions"
                />
              </View>
              <View style={{ flex: 1 }} />
              <View style={buttonWrapper}>
                <Button
                  colour="blue"
                  onPress={this.start}
                  content="Start Game"
                />
              </View>
            </View>
          </View>
        </View>
      </ImageBackground>
    );
  }
}
