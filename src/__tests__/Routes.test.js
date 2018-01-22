import React from 'react';
import { mount, shallow } from 'enzyme';
import { NavigationActions, StackNavigator } from 'react-navigation';
import { Provider } from 'mobx-react';

import Routes from '../Routes';
import AppStore from '../data/store';
import NewScreen from '../containers/NewScreen';
import GameScreen from '../containers/GameScreen';

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

  it('exports a MobX provider', () => {
    expect(shallow(<Routes store={store} />).type()).toEqual(Provider);
  });

  it('provides the store', () => {
    expect(shallow(<Routes store={store} />).props().store).toBeInstanceOf(AppStore);
  });

  it('matches the snapshot', () => {
    const tree = shallow(<Routes store={store} />);
    expect(tree).toMatchSnapshot();
  });

  it('provides a static navScreens function', () => {
    expect(Routes.navScreens).toBeDefined();
    expect(Routes.navScreens({ store })).toEqual({
      Game: { screen: GameScreen },
      New: { screen: NewScreen },
    });
  });

  it('provides a static navOptions function', () => {
    expect(Routes.navOptions).toBeDefined();
    expect(Routes.navOptions({ store })).toEqual({
      headerMode: 'none',
      initialRouteName: 'New',
    });
    store.words.replace({
      asphalt: true,
      turbid: true,
      renegade: true,
    });
    expect(Routes.navOptions({ store })).toEqual({
      headerMode: 'none',
      initialRouteName: 'Game',
    });
  });

  it('creates StackNavigator passing the static navScreens and navOptions', () => {
    mount(<Routes store={store} />);
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

  it('creates ref to Nav component at store.navigator', () => {
    const Nav = StackNavigator();
    mount(<Routes store={store} />);
    expect(store.navigator).toBeDefined();
    expect(store.navigator.dispatch).toEqual(shallow(<Nav />).instance().dispatch);
    expect(store.navigator.render).toEqual(shallow(<Nav />).instance().render);
  });

  it('overrides the default router getStateForAction', () => {
    const Nav = StackNavigator();
    const { getStateForAction } = Nav.router;
    mount(<Routes store={store} />);
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
