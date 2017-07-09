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
import { inject, observer } from 'mobx-react';
import Icon from 'react-native-vector-icons/Ionicons';

import ControlStyle from '../styles/ControlStyle';

@inject('appStore') @observer
export default class Control extends React.Component {
  static propTypes = {
    appStore: PropTypes.shape({
      dataSource: PropTypes.object.isRequired,
      gameModal: PropTypes.object,
      letters: PropTypes.object.isRequired,
      selected: PropTypes.object.isRequired,
      statusText: PropTypes.string.isRequired,
      submitWord: PropTypes.func.isRequired,
      timer: PropTypes.number.isRequired,
      tried: PropTypes.object.isRequired,
      words: PropTypes.object.isRequired,
    }).isRequired,
  }
  render() {
    const { appStore } = this.props;
    const correct = appStore.tried.filter(tryEntry =>
      (appStore.words.indexOf(tryEntry.word) !== -1),
    ).length;
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
      resultContainer,
      resultText,
      rightColumn,
      row,
      progressContainer,
      progressText,
      timerContainer,
      timerText,
    } = ControlStyle;
    const formattedTimer = appStore.timer / 60 >= 1 ?
      `${Math.floor(appStore.timer / 60)}m ${appStore.timer % 60}s` :
      `${appStore.timer % 60}s`;
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
                appStore.selected.replace([]);
              }}
              style={backspaceTouch}
            >
              <Icon
                name={'md-backspace'}
                size={35}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={columnContainer}>

          <View style={leftColumn}>
            <ListView
              dataSource={appStore.dataSource}
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
                onPress={() => { appStore.submitWord(); }}
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
                  {`${correct}/${appStore.words.length}`}
                </Text>
              </View>
              <View>
                <Text style={progressText}>
                  {`${Math.floor((correct / appStore.words.length) * 100)}%`}
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
