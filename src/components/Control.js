import React from 'react';
import PropTypes from 'prop-types';
import {
  Image,
  ImageBackground,
  ListView,
  View,
  Text,
} from 'react-native';
import { observer, PropTypes as MobxPropTypes } from 'mobx-react';
import { action, computed, observable } from 'mobx';
import Button from './Button';

import ControlStyle from '../styles/ControlStyle';

import bluePaper from '../images/bluePaper.png';
import leftPapers from '../images/leftPapers.png';
import listBody from '../images/listBody.png';

const listDataSource = new ListView.DataSource({ rowHasChanged() {} });

@observer
export default class Control extends React.Component {
  static propTypes = {
    isScored: PropTypes.bool,
    onMenu: PropTypes.func,
    onSubmit: PropTypes.func,
    scoreText: PropTypes.string,
    wordsToNextLevel: PropTypes.number,
    statusText: PropTypes.string,
    timerString: PropTypes.string,
    tried: MobxPropTypes.observableMap,
    words: MobxPropTypes.observableMap,
  }

  static defaultProps = {
    isScored: false,
    onSubmit() {},
    onMenu() {},
    scoreText: '',
    wordsToNextLevel: 0,
    statusText: '',
    timerString: '',
    tried: observable.map(),
    words: observable.map(),
  }

  @computed get formattedTriedWords() {
    if (this.props.tried.size === 0 && !this.props.isScored) {
      return [{ word: 'No words', style: 'neutral' }];
    }
    const triedWords = [...this.props.tried].sort().map(([word]) => (
      { word, style: this.props.tried.get(word) ? 'correct' : 'incorrect' }
    ));

    // If the game has been scored, display all words
    if (this.props.isScored === true) {
      const notFound = [
        { word: 'Not found:', style: 'neutral' },
        ...[...this.props.words].map(([key]) => key)
          .sort()
          .filter(word => !this.props.tried.get(word))
          .map(word => ({ word, style: 'neutral' })),
      ];
      const yourWords = [
        { word: ' ', style: 'neutral' },
        { word: 'Your words:', style: 'neutral' },
        ...triedWords,
      ];
      return [
        ...(notFound.length > 1 ? notFound : []),
        ...(this.props.tried.size > 0 ? yourWords : []),
      ];
    }

    // ...Otherwise just show words that have been tried
    return triedWords;
  }

  @computed get feedbackText() {
    return this.props.wordsToNextLevel > 0 ?
      `${this.props.wordsToNextLevel} word${this.props.wordsToNextLevel > 1 ? 's' : ''}` +
      ' to level up'
      :
      '';
  }

  @action setListHeightFromEvent = (event) => {
    this.listHeight = event.nativeEvent.layout.height;
  }
  @observable listHeight = 1000;

  render() {
    const {
      bluePaper: bluePaperStyle,
      buttonWrapper,
      columnContainer,
      container,
      leftColumn,
      leftPapers: leftPapersStyle,
      listContainer,
      resultContainer,
      resultText,
      rightColumn,
      progressContainer,
      progressText,
      progressTextSmall,
      timerContainer,
      timerText,
      wordCount,
      wordCountText,
      wordWrapper,
    } = ControlStyle;

    const correct = [...this.props.tried].filter(([, t]) => t).length;

    const triedWordRows = listDataSource.cloneWithRows(this.formattedTriedWords);

    const leftListBottomPadding = Math.max(
      this.listHeight - (25 * this.formattedTriedWords.length) - 50,
      20,
    );

    return (
      <View style={container}>
        <View style={columnContainer}>

          <View style={leftColumn}>
            <Image
              source={leftPapers}
              style={leftPapersStyle}
            />
            <View
              onLayout={this.setListHeightFromEvent}
              style={wordWrapper}
            >
              <ListView
                contentContainerStyle={[
                  listContainer,
                  { paddingBottom: leftListBottomPadding },
                ]}
                dataSource={triedWordRows}
                enableEmptySections
                overScrollMode="never"
                renderFooter={() => (
                  <View
                    style={ControlStyle.rowWrapper}
                  >
                    <Image
                      fadeDuration={0}
                      resizeMode="stretch"
                      style={ControlStyle.rowEndImage}
                      source={listBody}
                    />
                  </View>
                )}
                renderHeader={() => (
                  <Image
                    fadeDuration={0}
                    resizeMode="stretch"
                    style={ControlStyle.rowStartImage}
                    source={listBody}
                  />
                )}
                renderRow={singleRow => (
                  <View style={ControlStyle.rowWrapper}>
                    <ImageBackground
                      fadeDuration={0}
                      resizeMode="stretch"
                      style={ControlStyle.rowWrapperImage}
                      source={listBody}
                    >
                      <Text style={ControlStyle[singleRow.style]}>
                        {singleRow.word}
                      </Text>
                    </ImageBackground>
                  </View>
                )}
                scrollRenderAheadDistance={500}
                showsVerticalScrollIndicator={false}
              />
            </View>
            <Image
              source={bluePaper}
              style={bluePaperStyle}
            />
            <View style={wordCount}>
              <Text style={wordCountText}>
                {`${correct} / ${this.props.words.size}`}
              </Text>
            </View>
          </View>

          <View style={rightColumn}>
            <View style={resultContainer}>
              <Text style={resultText}>
                {this.props.statusText}
              </Text>
            </View>
            <View style={buttonWrapper}>
              <Button
                colour="blue"
                onPress={this.props.onSubmit}
                title="Submit"
              />
            </View>
            {this.props.timerString ?
              <View style={timerContainer}>
                <Text style={timerText}>
                  {this.props.timerString}
                </Text>
              </View>
              :
              null
            }
            <View style={progressContainer}>
              <View>
                <Text style={progressText}>
                  {(this.props.scoreText || ' ')}
                </Text>
              </View>
              <View>
                <Text style={progressTextSmall}>
                  {this.feedbackText}
                </Text>
              </View>
            </View>
            <View style={buttonWrapper}>
              <Button
                onPress={this.props.onMenu}
                title="Menu"
              />
            </View>
          </View>

        </View>
      </View>
    );
  }
}
