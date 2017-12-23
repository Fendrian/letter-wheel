import React from 'react';
import renderer from 'react-test-renderer';
import { createRenderer } from 'react-test-renderer/shallow';
import { Provider } from 'mobx-react';

import Routes from '../Routes';
import AppStore from '../data/AppStore';

const shallow = createRenderer();

jest.mock('../data/AppStore', () => (
  class Store {
    words = []
  }
));
jest.mock('../containers/App', () => 'App');
jest.mock('react-navigation', () => ({
  StackNavigator() {
    // eslint-disable-next-line global-require
    const { Component } = require('react');
    return class Nav extends Component {
      static router = {
        getStateForAction: (action, state) => ({
          action,
          state,
          id: '1600E39B-3152-4FC3-8D03-DF51D87EA17F',
        }),
      };
      dispatch = () => 'F3E4A27EFD094CB8';
      render() {
        return (<div />);
      }
    };
  },
  NavigationActions: { BACK: '0CF1AF16_back' },
}));

describe('Main routes file', () => {
  it('Exports a MobX provider', () => {
    const store = new AppStore();
    expect(shallow.render(<Routes store={store} />).type).toEqual(Provider);
  });

  it('Provides an AppStore', () => {
    const store = new AppStore();
    expect(shallow.render(<Routes store={store} />).props.appStore).toBeInstanceOf(AppStore);
  });

  it('Matches the snapshot', () => {
    const store = new AppStore();
    const tree = shallow.render(<Routes store={store} />);
    expect(tree).toMatchSnapshot();
  });

  it('Creates ref to Nav component at store.navigator', () => {
    const store = new AppStore();
    renderer.create(<Routes store={store} />);
    expect(store.navigator).toBeDefined();
    expect(store.navigator.dispatch()).toEqual('F3E4A27EFD094CB8');
  });

  // it('Overrides the default router getStateForAction', () => {
  //   const action = {
  //     type: '0CF1AF16_back',
  //   };
  //   const state = {
  //     index: 0,
  //     routes: [{ routeName: 'Menu' }],
  //   };
  //   const store = new AppStore();
  //   const tree = renderer.create(<Routes store={store} />);
  //   console.log(tree.getInstance().Nav.router.getStateForAction(action, state));
  // });
});
