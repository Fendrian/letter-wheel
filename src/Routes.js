import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'mobx-react';
import { StackNavigator } from 'react-navigation';

import AppStore from './data/AppStore';
import NewScreen from './containers/NewScreen';
import GameScreen from './containers/GameScreen';
import App from './containers/App';

const navScreens = {
  New: { screen: NewScreen },
  Game: { screen: GameScreen },
};
const navOptions = {
  headerMode: 'none',
  initialRouteName: 'New',
};

class Routes extends React.Component {
  static propTypes = {
    store: PropTypes.instanceOf(AppStore).isRequired,
  };
  render() {
    const { store } = this.props;
    const Nav = StackNavigator(navScreens, navOptions);
    return (
      <Provider appStore={store}>
        <App>
          <Nav ref={(nav) => { store.navigator = nav; }} />
        </App>
      </Provider>
    );
  }
}

export default Routes;
