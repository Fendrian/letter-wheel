import React from 'react';
import PropTypes from 'prop-types';
import { Text, View } from 'react-native';
import { inject, observer } from 'mobx-react';

import WrapperStyle from '../styles/WrapperStyle';
import LoadingScreenStyle from '../styles/LoadingScreenStyle';

@inject('store')
@observer
export default class LoadingScreen extends React.Component {
  static propTypes = {
    store: PropTypes.shape({
      loadGame: PropTypes.func.isRequired,
      nav: PropTypes.shape({
        goto: PropTypes.func.isRequired,
      }).isRequired,
      scored: PropTypes.bool.isRequired,
    }).isRequired,
  }
  componentDidMount = () => {
    // Load a game if there is one
    this.props.store.loadGame()
      .then((result) => {
        if (!result || this.props.store.scored === true) {
          this.props.store.nav.goto('New');
        } else {
          this.props.store.nav.goto('Game');
        }
      });
  }
  render() {
    const { container } = WrapperStyle;
    const {
      text,
      wrapper,
    } = LoadingScreenStyle;
    return (
      <View style={container}>
        <View style={wrapper}>
          <Text style={text}>
            Loading...
          </Text>
        </View>
      </View>
    );
  }
}
