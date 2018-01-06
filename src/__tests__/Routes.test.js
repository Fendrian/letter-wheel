import React from 'react';
import renderer from 'react-test-renderer';
import { createRenderer } from 'react-test-renderer/shallow';
import { shallow } from 'enzyme';
import { NavigationActions, StackNavigator } from 'react-navigation';
import { Provider } from 'mobx-react';

import Routes from '../Routes';
import AppStore from '../data/AppStore';
import NewScreen from '../containers/NewScreen';
import GameScreen from '../containers/GameScreen';

const reactShallow = createRenderer();

jest.mock('../data/AppStore', () => (
  class Store {
    words = []
  }
));
jest.mock('../containers/App', () => 'App');
jest.mock('react-navigation', () => {
  // eslint-disable-next-line global-require
  const { Component } = require('react');
  const dispatch = jest.fn();
  const render = jest.fn().mockReturnValue(<div />);
  const getStateForAction = jest.fn((action, state) => ({
    action,
    state,
    id: 'DF51D87EA17F',
  }));
  class Nav extends Component {
    static router = { getStateForAction };
    dispatch = dispatch;
    render = render;
  }
  return {
    StackNavigator: jest.fn().mockReturnValue(Nav),
    NavigationActions: { BACK: 'A6DABFFC' },
  };
});
jest.mock('../containers/NewScreen', () => 'BB167E84-D854-4854-A9A6-6C6D26E8CD1A');
jest.mock('../containers/GameScreen', () => 'E9F8AE3D-EE94-4177-B394-283B824FFD48');

jest.spyOn(Routes, 'navScreens');
jest.spyOn(Routes, 'navOptions');

describe('Main routes file', () => {
  let store;
  beforeEach(() => {
    store = new AppStore();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Exports a MobX provider', () => {
    expect(reactShallow.render(<Routes store={store} />).type).toEqual(Provider);
  });

  it('Provides the AppStore', () => {
    expect(reactShallow.render(<Routes store={store} />).props.appStore).toBeInstanceOf(AppStore);
  });

  it('Matches the snapshot', () => {
    const tree = reactShallow.render(<Routes store={store} />);
    expect(tree).toMatchSnapshot();
  });

  it('Provides a static navScreens function', () => {
    expect(Routes.navScreens).toBeDefined();
    expect(Routes.navScreens({ store })).toEqual({
      Game: { screen: GameScreen },
      New: { screen: NewScreen },
    });
  });

  it('Provides a static navOptions function', () => {
    expect(Routes.navOptions).toBeDefined();
    expect(Routes.navOptions({ store })).toEqual({
      headerMode: 'none',
      initialRouteName: 'New',
    });
    expect(Routes.navOptions({ store: { words: [1, 2, 3] } })).toEqual({
      headerMode: 'none',
      initialRouteName: 'Game',
    });
  });

  it('Creates StackNavigator passing the static navScreens and navOptions', () => {
    renderer.create(<Routes store={store} />);
    expect(Routes.navScreens).toHaveBeenCalledTimes(1);
    expect(Routes.navScreens).toHaveBeenCalledWith({ store });
    expect(Routes.navOptions).toHaveBeenCalledTimes(1);
    expect(Routes.navOptions).toHaveBeenCalledWith({ store });
    expect(StackNavigator).toHaveBeenCalledTimes(1);
    expect(StackNavigator).toHaveBeenCalledWith(
      Routes.navScreens({ store }),
      Routes.navOptions({ store }),
    );
  });

  it('Creates ref to Nav component at store.navigator', () => {
    const Nav = StackNavigator();
    renderer.create(<Routes store={store} />);
    expect(store.navigator).toBeDefined();
    expect(store.navigator.dispatch).toEqual(shallow(<Nav />).instance().dispatch);
    expect(store.navigator.render).toEqual(shallow(<Nav />).instance().render);
  });

  it('Overrides the default router getStateForAction', () => {
    const Nav = StackNavigator();
    const { getStateForAction } = Nav.router;
    renderer.create(<Routes store={store} />);
    expect(getStateForAction(
      { type: NavigationActions.BACK },
      { routes: [{ routeName: 'Game' }], index: 0 },
    )).toEqual(null);
    expect(getStateForAction({}, {})).toEqual({
      action: {},
      id: 'DF51D87EA17F',
      state: {},
    });
  });
});
