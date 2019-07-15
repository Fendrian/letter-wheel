import React from 'react';
import { mount, shallow } from 'enzyme';
import { NavigationActions, StackNavigator } from 'react-navigation';
import { Provider } from 'mobx-react';

import Routes from '../Routes';
import AppStore from '../data/store';
import LoadingScreen from '../containers/LoadingScreen';
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

  it('creates StackNavigator passing the static navScreens and navOptions', () => {
    mount(<Routes store={store} />);
    expect(StackNavigator).toHaveBeenCalledTimes(1);
    expect(StackNavigator).toHaveBeenCalledWith(
      {
        Loading: { screen: LoadingScreen },
        Game: { screen: GameScreen },
        New: { screen: NewScreen },
      },
      {
        headerMode: 'none',
        initialRouteName: 'Loading',
      },
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
      {
        routes: [
          { routeName: 'Loading' },
          { routeName: 'New' },
          { routeName: 'Game' },
        ],
        index: 2,
      },
    )).toEqual(null);
    expect(getStateForAction(
      { type: NavigationActions.BACK },
      {
        routes: [
          { routeName: 'Loading' },
          { routeName: 'New' },
        ],
        index: 1,
      },
    )).toEqual(null);
    expect(getStateForAction(
      { type: NavigationActions.BACK },
      {
        routes: [
          { routeName: 'Loading' },
        ],
        index: 0,
      },
    )).toEqual({
      action: {
        type: 'A6DABFFC',
      },
      id: 'DF51D87EA17F',
      state: {
        index: 0,
        routes: [{ routeName: 'Loading' }],
      },
    });
    expect(getStateForAction({}, {})).toEqual({
      action: {},
      id: 'DF51D87EA17F',
      state: {},
    });
  });
});
