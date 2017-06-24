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
      statusText: PropTypes.string.isRequired,
      submitWord: PropTypes.func.isRequired,
      tried: PropTypes.object.isRequired,
    }).isRequired,
  }
  render() {
    const { appStore } = this.props;
    return (
      <View style={ControlStyle.container}>
        <View style={ControlStyle.entryContainer}>
          <View style={ControlStyle.entryWrapper}>
            <Text style={ControlStyle.entryText}>
              {
                appStore.selected.map(i => appStore.letters[i].toUpperCase()).join('')
              }
            </Text>
          </View>
          <View style={ControlStyle.backspaceWrapper}>
            <TouchableOpacity
              onPress={() => { appStore.selected.pop(); }}
              onLongPress={() => { appStore.selected.replace([]); }}
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
              dataSource={appStore.dataSource}
              enableEmptySections
              renderRow={row => (
                <Text style={ControlStyle[row.correct ? 'correct' : 'incorrect']}>
                  {row.word}
                </Text>
              )}
              style={ControlStyle.row}
            />
          </View>
          <View style={ControlStyle.rightColumn}>
            <View style={ControlStyle.resultContainer}>
              <Text style={ControlStyle.resultText}>
                {appStore.statusText}
              </Text>
            </View>
            <View style={ControlStyle.buttonWrapper}>
              <Button
                onPress={() => { appStore.submitWord(); }}
                title="Submit"
                color="#999"
              />
            </View>
          </View>
        </View>
      </View>
    );
  }
}
