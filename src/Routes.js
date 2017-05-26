import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'mobx-react';

import AppStore from './data/AppStore';
import NewScreen from './containers/NewScreen';
import GameScreen from './containers/GameScreen';
import App from './containers/App';

class Routes extends React.Component {
  static propTypes = {
    store: PropTypes.instanceOf(AppStore).isRequired,
  };
  navScreens = {
    New: { screen: NewScreen },
    Game: { screen: GameScreen },
  }
  navOptions = {
    headerMode: 'none',
    initialRouteName: 'New',
  }
  render() {
    const { store } = this.props;
    return (
      <Provider appStore={store}>
        <App navScreens={this.navScreens} navOptions={this.navOptions} />
      </Provider>
    );
  }
}

export default Routes;
