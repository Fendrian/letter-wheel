import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  ListView,
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
      gameMenu: PropTypes.object,
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
    const {
      dataSource,
      gameMenu,
      letters,
      selected,
      statusText,
      submitWord,
      timer,
      tried,
      words,
    } = this.props.appStore;
    const correct = tried.filter(tryEntry =>
      (words.indexOf(tryEntry.word) !== -1),
    ).length;
    return (
      <View style={ControlStyle.container}>
        <View style={ControlStyle.entryContainer}>
          <View style={ControlStyle.entryWrapper}>
            <Text style={ControlStyle.entryText}>
              {
                selected.map(i => letters[i].toUpperCase()).join('')
              }
            </Text>
          </View>
          <View style={ControlStyle.backspaceWrapper}>
            <TouchableOpacity
              onPress={() => { selected.pop(); }}
              onLongPress={() => { selected.replace([]); }}
              style={ControlStyle.backspaceTouch}
            >
              <Icon
                name={'md-backspace'}
                size={35}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={ControlStyle.columnContainer}>
          <View style={ControlStyle.leftColumn}>
            <ListView
              dataSource={dataSource}
              enableEmptySections
              renderRow={row => (
                <Text style={ControlStyle[row.style]}>
                  {row.word}
                </Text>
              )}
              style={ControlStyle.row}
            />
          </View>
          <View style={ControlStyle.rightColumn}>
            <View style={ControlStyle.resultContainer}>
              <Text style={ControlStyle.resultText}>
                {statusText}
              </Text>
            </View>
            <View style={ControlStyle.buttonWrapper}>
              <Button
                onPress={() => { submitWord(); }}
                title="Submit"
                color="#999"
              />
            </View>
            <View style={ControlStyle.timerContainer}>
              <Text style={ControlStyle.timerText}>
                {timer !== -1 ? `${timer} seconds` : ' '}
              </Text>
            </View>
            <View style={ControlStyle.progressContainer}>
              <View>
                <Text style={ControlStyle.progressText}>
                  {`${correct}/${words.length}`}
                </Text>
              </View>
              <View>
                <Text style={ControlStyle.progressText}>
                  {`${Math.floor((correct / words.length) * 100)}%`}
                </Text>
              </View>
            </View>
            <View style={ControlStyle.buttonWrapper}>
              <Button
                onPress={() => { gameMenu.open(); }}
                title="Menu"
                color="#999"
              />
            </View>
          </View>
        </View>
      </View>
    );
  }
}
