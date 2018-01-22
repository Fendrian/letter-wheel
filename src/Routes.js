import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'mobx-react';
import { NavigationActions, StackNavigator } from 'react-navigation';

import AppStore from './data/store';
import NewScreen from './containers/NewScreen';
import GameScreen from './containers/GameScreen';
import App from './containers/App';

class Routes extends React.Component {
  static propTypes = {
    store: PropTypes.instanceOf(AppStore).isRequired,
  };
  static navScreens = () => ({
    New: { screen: NewScreen },
    Game: { screen: GameScreen },
  });
  static navOptions = props => ({
    headerMode: 'none',
    initialRouteName: props.store.words.size === 0 ? 'New' : 'Game',
  });
  constructor(props) {
    super(props);
    const Nav = StackNavigator(
      this.constructor.navScreens(props),
      this.constructor.navOptions(props),
    );
    const defaultGetStateForAction = Nav.router.getStateForAction;
    Nav.router.getStateForAction = (action, state) => {
      // Until react-navigation implements an officially endorsed method for setting a new 'root'
      // of the nav stack, the code below is effective - if the back button is pressed on the
      // specified routes, exit the app rather than going back
      if (
        state &&
        action.type === NavigationActions.BACK &&
        state.routes[state.index].routeName === 'Game'
      ) {
        return null;
      }

      return defaultGetStateForAction(action, state);
    };

    this.Nav = Nav;
  }
  render() {
    const { Nav, props: { store } } = this;
    return (
      <Provider store={store}>
        <App>
          <Nav ref={(nav) => { store.navigator = nav; }} />
        </App>
      </Provider>
    );
  }
}

export default Routes;
