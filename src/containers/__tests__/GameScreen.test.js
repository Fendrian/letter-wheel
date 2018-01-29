import React from 'react';
import { mount } from 'enzyme';
import KeyEvent from 'react-native-keyevent';
import { runInAction } from 'mobx';

import AppStore from '../../data/store';
import GameScreen from '../GameScreen';

jest.mock('../../components/Grid', () => {
  require('react'); // eslint-disable-line global-require
  const { View } = require('react-native'); // eslint-disable-line global-require
  return props => (
    <View {...props}>
      {'18E4DC45-B77E-46C2-B7F5-D6AFA39240BB'}
    </View>
  );
});
jest.mock('../../components/Control', () => {
  require('react'); // eslint-disable-line global-require
  const { View } = require('react-native'); // eslint-disable-line global-require
  return props => (
    <View {...props}>
      {'15D067E6-1538-46AD-89A0-8D8729169089'}
    </View>
  );
});
jest.mock('react-native-keyevent', () => ({
  onKeyUpListener: jest.fn(),
}));

describe('Game Screen component', () => {
  let store;

  beforeEach(() => {
    store = new AppStore();
  });

  afterEach(() => {
    jest.clearAllMocks();
    store = undefined;
  });

  it('matches the snapshot', () => {
    const render = mount(<GameScreen store={store} />);
    expect(render).toMatchSnapshot();
  });

  it('exports the GameScreen component', () => {
    const render = mount(<GameScreen store={store} />);
    expect(render.find(GameScreen)).toHaveLength(1);
  });

  it('adds an event listener to the menu button to open the menu', () => {
    expect(KeyEvent.onKeyUpListener).toHaveBeenCalledTimes(0);
    mount(<GameScreen store={store} />);
    jest.spyOn(store, 'openMenuModal');

    expect(KeyEvent.onKeyUpListener).toHaveBeenCalledTimes(1);
    expect(KeyEvent.onKeyUpListener).toHaveBeenCalledWith(expect.any(Function));

    const listener = KeyEvent.onKeyUpListener.mock.calls[0][0];
    expect(store.openMenuModal).toHaveBeenCalledTimes(0);

    for (let i = 0; i < 255; i += 1) {
      if (i !== 1 && i !== 82) {
        listener(i);
        expect(store.openMenuModal).toHaveBeenCalledTimes(0);
      }
    }

    runInAction(() => { store.isMenuModalOpen = true; });
    listener(1);
    listener(82);
    expect(store.openMenuModal).toHaveBeenCalledTimes(0);

    runInAction(() => {
      store.isMenuModalOpen = false;
      store.isAboutModalOpen = true;
    });
    listener(1);
    listener(82);
    expect(store.openMenuModal).toHaveBeenCalledTimes(0);

    runInAction(() => {
      store.isAboutModalOpen = false;
      store.isInstructionsModalOpen = true;
    });
    listener(1);
    listener(82);
    expect(store.openMenuModal).toHaveBeenCalledTimes(0);

    runInAction(() => { store.isInstructionsModalOpen = false; });

    store.openMenuModal.mockClear();
    listener(1);
    expect(store.openMenuModal).toHaveBeenCalledTimes(1);

    store.openMenuModal.mockClear();
    runInAction(() => { store.isMenuModalOpen = false; });
    listener(82);
    expect(store.openMenuModal).toHaveBeenCalledTimes(1);
  });

  it('handles timers correctly', () => {
    store.nav.get = jest.fn();
    mount(<GameScreen.wrappedComponent store={store} />);
    jest.spyOn(store, 'setTimer');
    jest.spyOn(store, 'scoreGame');

    expect(store.timer).toEqual(-1);
    jest.advanceTimersByTime(1000);
    expect(store.timer).toEqual(-1);
    jest.advanceTimersByTime(10000);
    expect(store.timer).toEqual(-1);

    runInAction(() => { store.timer = 550; });
    store.nav.get.mockReturnValue('Menu');
    jest.advanceTimersByTime(5000);
    expect(store.timer).toEqual(550);

    store.nav.get.mockReturnValue('Game');
    jest.advanceTimersByTime(1000);
    expect(store.timer).toEqual(549);
    jest.advanceTimersByTime(1000);
    expect(store.timer).toEqual(548);
    jest.advanceTimersByTime(500000);
    expect(store.timer).toEqual(48);
    jest.advanceTimersByTime(48000);
    expect(store.timer).toEqual(0);
    expect(store.scoreGame).toHaveBeenCalledTimes(0);
    jest.advanceTimersByTime(1000);
    expect(store.timer).toEqual(-1);
    expect(store.scoreGame).toHaveBeenCalledTimes(1);
  });
});
