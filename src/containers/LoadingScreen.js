import React from 'react';
import PropTypes from 'prop-types';
import { ImageBackground, Text, View } from 'react-native';
import { inject, observer } from 'mobx-react';

import WrapperStyle from '../styles/WrapperStyle';
import LoadingScreenStyle from '../styles/LoadingScreenStyle';

import background from '../images/woodBackground.jpg';

export default
@inject('store')
@observer
class LoadingScreen extends React.Component {
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
    const { store } = this.props;
    // Load a game if there is one
    store.loadGame()
      .then((result) => {
        if (!result || store.scored === true) {
          store.nav.goto('New');
        } else {
          store.nav.goto('Game');
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
      <ImageBackground
        source={background}
        style={container}
      >
        <View style={wrapper}>
          <Text style={text}>
            Loading...
          </Text>
        </View>
      </ImageBackground>
    );
  }
}
