import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  ListView,
  Vibration,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { computed } from 'mobx';
import { inject, observer } from 'mobx-react';
import Icon from 'react-native-vector-icons/Ionicons';

import ControlStyle from '../styles/ControlStyle';

const listDataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

@inject('appStore') @observer
export default class Control extends React.Component {
  static propTypes = {
    appStore: PropTypes.shape({
      triedWordList: PropTypes.array.isRequired,
      gameModal: PropTypes.object,
      getScore: PropTypes.func.isRequired,
      letters: PropTypes.string.isRequired,
      scores: PropTypes.array.isRequired,
      selected: PropTypes.object.isRequired,
      statusText: PropTypes.string.isRequired,
      submitWord: PropTypes.func.isRequired,
      timer: PropTypes.number.isRequired,
      tried: PropTypes.object.isRequired,
      words: PropTypes.object.isRequired,
    }).isRequired,
    onCorrect: PropTypes.func,
    onWrong: PropTypes.func,
  }
  static defaultProps = {
    onCorrect() {},
    onWrong() {},
  }
  @computed get dataSource() {
    return listDataSource.cloneWithRows(this.props.appStore.triedWordList);
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
    const { appStore } = this.props;
    const correct = appStore.tried.filter(tryEntry => (
      appStore.words.indexOf(tryEntry) !== -1
    )).length;
    const {
      backspaceTouch,
      backspaceWrapper,
      buttonWrapper,
      columnContainer,
      container,
      entryContainer,
      entryWrapper,
      entryText,
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
    const formattedTimer = appStore.timer / 60 >= 1 ?
      `${Math.floor(appStore.timer / 60)}m ${appStore.timer % 60}s` :
      `${appStore.timer % 60}s`;
    const score = appStore.getScore();
    const feedbackText = (() => {
      const { toNext } = score;
      if (toNext > 0) {
        return `${toNext} word${toNext > 1 ? 's' : ''}\n to next level`;
      }
      return '';
    })();
    return (
      <View style={container}>
        <View style={entryContainer}>
          <View style={entryWrapper}>
            <Text style={entryText}>
              {
                appStore.selected.map(i => appStore.letters[i].toUpperCase()).join('')
              }
            </Text>
          </View>
          <View style={backspaceWrapper}>
            <TouchableOpacity
              onPress={() => { appStore.selected.pop(); }}
              onLongPress={() => {
                Vibration.vibrate(100);
                appStore.selected.clear();
              }}
              style={backspaceTouch}
            >
              <Icon
                name="md-backspace"
                size={35}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={columnContainer}>

          <View style={leftColumn}>
            <View style={leftColumnHeader}>
              <Text style={leftColumnHeaderText}>
                {`${correct} / ${appStore.words.length}`}
              </Text>
            </View>
            <ListView
              dataSource={this.dataSource}
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
                {appStore.statusText}
              </Text>
            </View>
            <View style={buttonWrapper}>
              <Button
                color="#999"
                onPress={this.submitWord}
                title="Submit"
              />
            </View>
            {appStore.timer !== -1 ?
              <View style={timerContainer}>
                <Text style={timerText}>
                  {formattedTimer}
                </Text>
              </View>
              :
              <View />
            }
            <View style={progressContainer}>
              <View>
                <Text style={progressText}>
                  {score.text !== '' ? `${score.text}!` : ' '}
                </Text>
              </View>
              <View>
                <Text style={progressTextSmall}>
                  {feedbackText}
                </Text>
              </View>
            </View>
            <View style={buttonWrapper}>
              <Button
                color="#999"
                onPress={() => {
                  appStore.gameModal.close();
                  appStore.gameModal.open();
                }}
                title="Menu"
              />
            </View>
          </View>

        </View>
      </View>
    );
  }
}
