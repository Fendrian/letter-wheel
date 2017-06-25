import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'mobx-react';
import { NavigationActions, StackNavigator } from 'react-navigation';

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
  constructor() {
    super();
    const Nav = StackNavigator(navScreens, navOptions);
    const defaultGetStateForAction = Nav.router.getStateForAction;
    Nav.router.getStateForAction = (action, state) => {
      // Until react-navigation implements an officially endorsed method for setting a new 'root'
      // of the nav stack, the code below is effective - if the back button is pressed on the
      // specified routes, exit the app rather than going back
      if (
        state &&
        action.type === NavigationActions.BACK &&
        (
          state.routes[state.index].routeName === 'New' ||
          state.routes[state.index].routeName === 'Game'
        )
      ) {
        return null;
      }

      if (true) {        console.log('==')      }

      return defaultGetStateForAction(action, state);
    };

    this.Nav = Nav;
  }
  render() {
    const { store } = this.props;
    const Nav = this.Nav;
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
