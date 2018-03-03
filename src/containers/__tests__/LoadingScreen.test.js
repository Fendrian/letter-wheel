import React from 'react';
import { mount } from 'enzyme';

import AppStore from '../../data/store';
import LoadingScreen from '../LoadingScreen';

describe('Loading Screen component', () => {
  let store;

  beforeEach(() => {
    store = new AppStore();
  });

  afterEach(() => {
    jest.clearAllMocks();
    store = undefined;
  });

  it('matches the snapshot', () => {
    const render = mount(<LoadingScreen store={store} />);
    expect(render).toMatchSnapshot();
  });

  it('calls loadGame on mount', () => {
    jest.spyOn(store, 'loadGame');
    store.loadGame.mockReturnValue(Promise.resolve(true));
    mount(<LoadingScreen.wrappedComponent store={store} />);
    expect(store.loadGame).toHaveBeenCalledTimes(1);
  });

  it('routes to new screen if no save data found', async () => {
    jest.spyOn(store, 'loadGame');
    jest.spyOn(store.nav, 'goto');

    store.loadGame.mockReturnValue(Promise.resolve(false));
    store.scored = false;
    mount(<LoadingScreen.wrappedComponent store={store} />);
    await Promise.resolve();
    expect(store.loadGame).toHaveBeenCalledTimes(1);
    expect(store.nav.goto).toHaveBeenCalledTimes(1);
    expect(store.nav.goto).toHaveBeenCalledWith('New');
  });

  it('routes to new screen if save data found, but game was scored', async () => {
    jest.spyOn(store, 'loadGame');
    jest.spyOn(store.nav, 'goto');

    store.loadGame.mockReturnValue(Promise.resolve(true));
    store.scored = true;
    mount(<LoadingScreen.wrappedComponent store={store} />);
    await Promise.resolve();
    expect(store.loadGame).toHaveBeenCalledTimes(1);
    expect(store.nav.goto).toHaveBeenCalledTimes(1);
    expect(store.nav.goto).toHaveBeenCalledWith('New');
  });

  it('routes to game screen if unscored save data found', async () => {
    jest.spyOn(store, 'loadGame');
    jest.spyOn(store.nav, 'goto');

    store.loadGame.mockReturnValue(Promise.resolve(true));
    store.scored = false;
    mount(<LoadingScreen.wrappedComponent store={store} />);
    await Promise.resolve();
    expect(store.loadGame).toHaveBeenCalledTimes(1);
    expect(store.nav.goto).toHaveBeenCalledTimes(1);
    expect(store.nav.goto).toHaveBeenCalledWith('Game');
  });
});
