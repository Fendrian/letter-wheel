import React from 'react';
import { StyleSheet } from 'react-native';
import { mount } from 'enzyme';
import nativeTimer from 'react-native-timer';
import KeyEvent from 'react-native-keyevent';
import { runInAction } from 'mobx';

import AppStore from '../../data/store';
import GameScreen from '../GameScreen';
import Grid from '../../components/Grid';
import Control from '../../components/Control';
import GameScreenStyle from '../../styles/GameScreenStyle';

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
  removeKeyUpListener: jest.fn(),
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

  it('unmounts gracefully', () => {
    jest.spyOn(nativeTimer, 'clearInterval');
    const render = mount(<GameScreen.wrappedComponent store={store} />);
    const instance = render.instance();
    expect(nativeTimer.clearInterval).toHaveBeenCalledTimes(0);
    expect(KeyEvent.removeKeyUpListener).toHaveBeenCalledTimes(0);
    render.unmount();
    expect(nativeTimer.clearInterval).toHaveBeenCalledTimes(1);
    expect(nativeTimer.clearInterval).toHaveBeenCalledWith(instance);
    expect(KeyEvent.removeKeyUpListener).toHaveBeenCalledTimes(1);
  });

  it('provides a computed for grid letters', () => {
    const render = mount(<GameScreen.wrappedComponent store={store} />);
    expect(render.instance().gridEntries).toEqual({
      0: { letter: ' ', selected: false },
      1: { letter: ' ', selected: false },
      2: { letter: ' ', selected: false },
      3: { letter: ' ', selected: false },
      4: { letter: ' ', selected: false },
      5: { letter: ' ', selected: false },
      6: { letter: ' ', selected: false },
      7: { letter: ' ', selected: false },
      8: { letter: ' ', selected: false },
    });

    runInAction(() => { store.letters = 'fefbbcbdf'; });
    expect(render.instance().gridEntries).toEqual({
      0: { letter: 'f', selected: false },
      1: { letter: 'e', selected: false },
      2: { letter: 'f', selected: false },
      3: { letter: 'b', selected: false },
      4: { letter: 'b', selected: false },
      5: { letter: 'c', selected: false },
      6: { letter: 'b', selected: false },
      7: { letter: 'd', selected: false },
      8: { letter: 'f', selected: false },
    });

    runInAction(() => { store.letters = 'dfbecfbfb'; });
    runInAction(() => { store.selected.replace(['1', '4', '8']); });
    expect(render.instance().gridEntries).toEqual({
      0: { letter: 'd', selected: false },
      1: { letter: 'f', selected: true },
      2: { letter: 'b', selected: false },
      3: { letter: 'e', selected: false },
      4: { letter: 'c', selected: true },
      5: { letter: 'f', selected: false },
      6: { letter: 'b', selected: false },
      7: { letter: 'f', selected: false },
      8: { letter: 'b', selected: true },
    });
  });

  it('provides animationState with actions to update it', () => {
    const render = mount(<GameScreen.wrappedComponent store={store} />);

    expect(render.instance().animationState).toEqual('');
    expect(render.instance().triggerAnimation).toEqual(expect.any(Function));
    expect(render.instance().clearAnimation).toEqual(expect.any(Function));

    render.instance().triggerAnimation('933ADD04285C');
    expect(render.instance().animationState).toEqual('933ADD04285C');
    render.instance().triggerAnimation('06DAD913982E');
    expect(render.instance().animationState).toEqual('06DAD913982E');

    render.instance().clearAnimation();
    expect(render.instance().animationState).toEqual('');
    render.instance().triggerAnimation('06DAD913982E');
    render.instance().clearAnimation();
    expect(render.instance().animationState).toEqual('');
  });

  it('renders a Grid element', () => {
    const render = mount(<GameScreen.wrappedComponent store={store} />);

    const grid = render.find(Grid).at(0);
    expect(grid.props().animationState).toEqual('');
    expect(grid.props().clearAnimation).toEqual(render.instance().clearAnimation);
    expect(grid.props().toggleSelected).toEqual(store.toggleSelected);
    expect(grid.props().gridEntries).toEqual(render.instance().gridEntries);
    expect(grid.props().submitWord).toEqual(store.submitWord);
    expect(grid.props().triggerAnimation).toEqual(render.instance().triggerAnimation);
  });

  it('renders a Control element', () => {
    runInAction(() => { store.letters = 'dfbecfbfb'; });
    runInAction(() => { store.selected.replace(['1', '4', '8']); });
    const render = mount(<GameScreen.wrappedComponent store={store} />);
    jest.spyOn(store, 'submitWord');
    jest.spyOn(render.instance(), 'triggerAnimation');

    const control = render.find(Control).at(0);
    expect(control.props().clearSelected).toEqual(store.clearSelected);
    expect(control.props().isScored).toEqual(store.scored);
    expect(control.props().onMenu).toEqual(store.openMenuModal);
    expect(control.props().onSubmit).toEqual(expect.any(Function));
    expect(control.props().scoreText).toEqual(store.getScore().text);
    expect(control.props().selectedString).toEqual('FCB');
    expect(control.props().statusText).toEqual(store.statusText);
    expect(control.props().statusText).toEqual('');
    expect(control.props().tried).toEqual(store.tried);
    expect(control.props().words).toEqual(store.words);

    store.submitWord.mockReturnValueOnce(true);
    control.props().onSubmit();
    expect(render.instance().triggerAnimation).toHaveBeenCalledTimes(1);
    expect(render.instance().triggerAnimation).toHaveBeenCalledWith('correct');

    jest.clearAllMocks();
    store.submitWord.mockReturnValueOnce(false);
    control.props().onSubmit();
    expect(render.instance().triggerAnimation).toHaveBeenCalledTimes(1);
    expect(render.instance().triggerAnimation).toHaveBeenCalledWith('incorrect');
  });

  it('responds to screen orientation', () => {
    const render = mount(<GameScreen.wrappedComponent store={store} />);
    let orientationWrapper;

    orientationWrapper = render.find({ style: GameScreenStyle.portrait }).at(0);
    expect(orientationWrapper).toHaveLength(1);
    expect(orientationWrapper.props().style).toEqual(StyleSheet.flatten(GameScreenStyle).portrait);

    runInAction(() => { store.orientation = 1; });
    render.update();
    orientationWrapper = render.find({ style: GameScreenStyle.landscape }).at(0);
    expect(orientationWrapper).toHaveLength(1);
    expect(orientationWrapper.props().style).toEqual(StyleSheet.flatten(GameScreenStyle).landscape);
  });
});
