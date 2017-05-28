import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { inject, observer } from 'mobx-react';

import GridStyle from '../styles/GridStyle';

@inject('appStore') @observer
export default class LoadingScreen extends React.Component {
  static propTypes = {
    appStore: PropTypes.shape({
      letters: React.PropTypes.object.isRequired,
    }).isRequired,
  }
  render() {
    return (
      <View style={GridStyle.container} />
    );
  }
}
