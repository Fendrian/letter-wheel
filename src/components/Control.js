import React from 'react';
import PropTypes from 'prop-types';
import {
  ListView,
  View,
  Text,
} from 'react-native';
import { observer, PropTypes as MobxPropTypes } from 'mobx-react';
import { computed, observable } from 'mobx';
import Button from './Button';

import ControlStyle from '../styles/ControlStyle';

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
    const triedWords = this.props.tried.keys().sort().map(word => (
      { word, style: this.props.tried.get(word) ? 'correct' : 'incorrect' }
    ));

    // If the game has been scored, display all words
    if (this.props.isScored === true) {
      const notFound = [
        { word: 'Not found:', style: 'neutral' },
        ...this.props.words.keys()
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
      `${this.props.wordsToNextLevel} word${this.props.wordsToNextLevel > 1 ? 's' : ''}\n` +
      'to next level'
      :
      '';
  }

  render() {
    const {
      buttonWrapper,
      columnContainer,
      container,
      leftColumn,
      leftColumnHeader,
      leftColumnHeaderText,
      resultContainer,
      resultText,
      rightColumn,
      row,
      progressContainer,
      progressText,
      progressTextSmall,
      timerContainer,
      timerText,
    } = ControlStyle;

    const correct = this.props.tried.values().filter(v => v).length;

    const triedWordRows = listDataSource.cloneWithRows(this.formattedTriedWords);

    return (
      <View style={container}>
        <View style={columnContainer}>

          <View style={leftColumn}>
            <View style={leftColumnHeader}>
              <Text style={leftColumnHeaderText}>
                {`${correct} / ${this.props.words.size}`}
              </Text>
            </View>
            <ListView
              dataSource={triedWordRows}
              enableEmptySections
              renderRow={singleRow => (
                <Text style={ControlStyle[singleRow.style]}>
                  {singleRow.word}
                </Text>
              )}
              style={row}
            />
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
