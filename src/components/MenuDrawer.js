import React from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';
import { inject, observer } from 'mobx-react';

import MenuDrawerStyle from '../styles/MenuDrawerStyle';

@inject('appStore') @observer
export default class Grid extends React.Component {
  static propTypes = {
    appStore: PropTypes.shape({
      letters: PropTypes.object.isRequired,
      selected: PropTypes.object.isRequired,
      submitWord: PropTypes.func.isRequired,
    }).isRequired,
  }
  render() {
    return (
      <View style={MenuDrawerStyle.container}>
        <Text>
          asdfsfgjnsdfilgsfdligbsfdlhbsfdljbksnfdkjn
        </Text>
      </View>
    );
  }
}
