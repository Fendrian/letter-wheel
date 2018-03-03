import React from 'react';
import { mount } from 'enzyme';
import { runInAction } from 'mobx';
import MockDate from 'mockdate';
import { SegmentedControls } from 'react-native-radio-buttons';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import CheckBox from 'react-native-checkbox';
import Button from 'react-native-button';

import AppStore from '../../data/store';
import NewScreen from '../NewScreen';

describe('New Screen component', () => {
  let store;

  beforeEach(() => {
    store = new AppStore();
  });

  afterEach(() => {
    jest.clearAllMocks();
    store = undefined;
  });

  it('matches the snapshot', () => {
    const render = mount(<NewScreen store={store} />);
    expect(render).toMatchSnapshot();
  });

  it('provides a callback for slider movement', () => {
    const render = mount(<NewScreen.wrappedComponent store={store} />);
    jest.spyOn(render.instance(), 'setSelectedOption');

    expect(render.instance().onSliderMove).toEqual(expect.any(Function));
    expect(render.instance().onSliderMove()).toBeUndefined();
    expect(render.instance().setSelectedOption).toHaveBeenCalledTimes(0);

    render.instance().onSliderMove('test');
    expect(render.instance().setSelectedOption).toHaveBeenCalledTimes(0);

    render.instance().onSliderMove([1244, 6519]);
    expect(render.instance().setSelectedOption).toHaveBeenCalledTimes(1);
    expect(render.instance().setSelectedOption).toHaveBeenCalledWith({
      min: 1244,
      max: 6519,
    });

    jest.clearAllMocks();
    render.instance().onSliderMove([9152, 7627]);
    expect(render.instance().setSelectedOption).toHaveBeenCalledTimes(1);
    expect(render.instance().setSelectedOption).toHaveBeenCalledWith({
      min: 9152,
      max: 7627,
    });
  });

  it('provides a function to set range', () => {
    jest.spyOn(store, 'setNewGameOptions');

    const render = mount(<NewScreen.wrappedComponent store={store} />);

    expect(render.instance().setSelectedOption).toEqual(expect.any(Function));
    expect(render.instance().setSelectedOption({ min: 1, max: 645 })).toBeUndefined();
    expect(store.setNewGameOptions).toHaveBeenCalledTimes(1);
    expect(store.setNewGameOptions).toHaveBeenCalledWith(
      'wordRange',
      {
        min: 1,
        max: 645,
      },
    );

    jest.clearAllMocks();
    render.instance().setSelectedOption({ min: 521, max: 1469 });
    expect(store.setNewGameOptions).toHaveBeenCalledTimes(1);
    expect(store.setNewGameOptions).toHaveBeenCalledWith(
      'wordRange',
      {
        min: 521,
        max: 1469,
      },
    );
  });

  it('provides a function to find whether the range matches a preset', () => {
    const render = mount(<NewScreen.wrappedComponent store={store} />);

    expect(render.instance().getSelectedOption).toEqual(expect.any(Function));
    expect(render.instance().getSelectedOption()).toEqual(0);

    runInAction(() => { store.setNewGameOptions('wordRange', { min: 0, max: 10 }); });
    expect(render.instance().getSelectedOption()).toEqual(-1);

    runInAction(() => { store.setNewGameOptions('wordRange', { min: 10, max: 49 }); });
    expect(render.instance().getSelectedOption()).toEqual(0);

    runInAction(() => { store.setNewGameOptions('wordRange', { min: 11, max: 49 }); });
    expect(render.instance().getSelectedOption()).toEqual(-1);

    runInAction(() => { store.setNewGameOptions('wordRange', { min: 50, max: 99 }); });
    expect(render.instance().getSelectedOption()).toEqual(1);

    runInAction(() => { store.setNewGameOptions('wordRange', { min: 50, max: 98 }); });
    expect(render.instance().getSelectedOption()).toEqual(-1);

    runInAction(() => { store.setNewGameOptions('wordRange', { min: 100, max: 999 }); });
    expect(render.instance().getSelectedOption()).toEqual(2);

    runInAction(() => { store.setNewGameOptions('wordRange', { min: 99, max: 999 }); });
    expect(render.instance().getSelectedOption()).toEqual(-1);
  });

  it('provides a function to get current screen width', () => {
    const render = mount(<NewScreen.wrappedComponent store={store} />);

    expect(render.instance().getSliderWidth).toEqual(expect.any(Function));
    expect(render.instance().getSliderWidth()).toEqual(330);

    runInAction(() => { store.width = 400; });
    expect(render.instance().getSliderWidth()).toEqual(330);
    runInAction(() => { store.width = 399; });
    expect(render.instance().getSliderWidth()).toEqual(329);
    runInAction(() => { store.width = 3333; });
    expect(render.instance().getSliderWidth()).toEqual(330);
    runInAction(() => { store.width = 250; });
    expect(render.instance().getSliderWidth()).toEqual(180);
  });

  it('provides a function to toggle timed state', () => {
    jest.spyOn(store, 'setNewGameOptions');

    const render = mount(<NewScreen.wrappedComponent store={store} />);

    expect(store.newGameOptions.get('timed')).toBeFalsy();
    expect(store.setNewGameOptions).toHaveBeenCalledTimes(0);
    render.instance().toggleTimed();
    expect(store.setNewGameOptions).toHaveBeenCalledTimes(1);
    expect(store.setNewGameOptions).toHaveBeenCalledWith('timed', true);
    expect(store.newGameOptions.get('timed')).toBeTruthy();
    render.instance().toggleTimed();
    expect(store.setNewGameOptions).toHaveBeenCalledTimes(2);
    expect(store.setNewGameOptions).toHaveBeenCalledWith('timed', false);
    expect(store.newGameOptions.get('timed')).toBeFalsy();
  });

  it('provides a start function to initiate a game', async () => {
    jest.spyOn(store, 'setLoading');
    jest.spyOn(store, 'newGame');
    jest.spyOn(store.nav, 'goto');

    MockDate.set(new Date('2017-01-01T08:00:00.000'));

    let resolvePromise;
    store.newGame.mockReturnValue(new Promise((resolve) => {
      resolvePromise = resolve;
    }));

    const render = mount(<NewScreen.wrappedComponent store={store} />);

    expect(render.instance().start).toEqual(expect.any(Function));
    runInAction(() => { store.setNewGameOptions('wordRange', { min: 0, max: 10 }); });
    runInAction(() => { store.setNewGameOptions('timed', true); });

    expect(render.instance().start()).toBeUndefined();
    expect(store.setLoading).toHaveBeenCalledTimes(1);
    expect(store.setLoading).toHaveBeenCalledWith(true);
    expect(store.newGame).toHaveBeenCalledTimes(1);
    expect(store.newGame).toHaveBeenCalledWith({
      wordsMin: 0,
      wordsMax: 10,
      timed: true,
    });
    await resolvePromise('');
    jest.advanceTimersByTime(600);

    jest.clearAllMocks();
    runInAction(() => { store.setNewGameOptions('wordRange', { min: 10, max: 49 }); });
    runInAction(() => { store.setNewGameOptions('timed', false); });

    expect(render.instance().start()).toBeUndefined();
    expect(store.setLoading).toHaveBeenCalledTimes(1);
    expect(store.setLoading).toHaveBeenCalledWith(true);
    expect(store.newGame).toHaveBeenCalledTimes(1);
    expect(store.newGame).toHaveBeenCalledWith({
      wordsMin: 10,
      wordsMax: 49,
      timed: false,
    });

    // Shouldn't ever stop loading if the promise doesn't resolve
    jest.clearAllMocks();
    jest.advanceTimersByTime(2000);
    expect(store.setLoading).toHaveBeenCalledTimes(0);
    expect(setTimeout).toHaveBeenCalledTimes(0);
    await resolvePromise('');
    expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 500);
    expect(store.setLoading).toHaveBeenCalledTimes(0);
    expect(store.nav.goto).toHaveBeenCalledTimes(0);

    jest.advanceTimersByTime(500);

    expect(store.setLoading).toHaveBeenCalledTimes(1);
    expect(store.setLoading).toHaveBeenCalledWith(false);
    expect(store.nav.goto).toHaveBeenCalledTimes(1);
    expect(store.nav.goto).toHaveBeenCalledWith('Game');

    // Check timeout math
    jest.clearAllMocks();
    MockDate.set(new Date('2017-01-01T08:00:00.000'));
    render.instance().start();
    expect(setTimeout).toHaveBeenCalledTimes(0);
    MockDate.set(new Date('2017-01-01T08:00:00.398'));
    await resolvePromise('');
    expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 102);

    jest.clearAllMocks();
    MockDate.set(new Date('2017-01-01T08:00:00.000'));
    render.instance().start();
    expect(setTimeout).toHaveBeenCalledTimes(0);
    MockDate.set(new Date('2017-01-01T08:00:00.100'));
    await resolvePromise('');
    expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 400);

    jest.clearAllMocks();
    MockDate.set(new Date('2017-01-01T08:00:00.000'));
    render.instance().start();
    expect(setTimeout).toHaveBeenCalledTimes(0);
    MockDate.set(new Date('2017-01-01T08:01:00.000'));
    await resolvePromise('');
    expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), -59500);
  });

  it('provides a set of segmented controls for selecting word number', async () => {
    const render = mount(<NewScreen.wrappedComponent store={store} />);

    expect(render.find(SegmentedControls)).toHaveLength(1);
    expect(render.find(SegmentedControls).at(0).props().onSelection)
      .toEqual(render.instance().setSelectedOption);
    expect(render.find(SegmentedControls).at(0).props().selectedIndex)
      .toEqual(render.instance().getSelectedOption());
    expect(render.find(SegmentedControls).at(0).props().options).toEqual([
      {
        label: '10-49',
        min: 10,
        max: 49,
      },
      {
        label: '50-99',
        min: 50,
        max: 99,
      },
      {
        label: '100+',
        min: 100,
        max: 999,
      },
    ]);

    expect(render.find({ children: '10 to 49 words' })).toHaveLength(2);

    runInAction(() => { store.newGameOptions.set('wordRange', { min: 30, max: 99 }); });
    render.update();
    expect(render.find({ children: '30 to 99 words' })).toHaveLength(2);

    runInAction(() => { store.newGameOptions.set('wordRange', { min: 20, max: 999 }); });
    render.update();
    expect(render.find({ children: 'At least 20 words' })).toHaveLength(2);
  });

  it('provides a mutli-slider component to set word range', async () => {
    const render = mount(<NewScreen.wrappedComponent store={store} />);

    const optionsArray = [
      10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29,
      30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49,
      50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69,
      70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89,
      90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 999,
    ];


    expect(render.find(MultiSlider)).toHaveLength(1);
    expect(render.find(MultiSlider).at(0).props().onValuesChange)
      .toEqual(render.instance().onSliderMove);
    expect(render.find(MultiSlider).at(0).props().optionsArray).toEqual(optionsArray);
    expect(render.find(MultiSlider).at(0).props().sliderLength)
      .toEqual(render.instance().getSliderWidth());
    expect(render.find(MultiSlider).at(0).props().values).toEqual([10, 49]);
  });

  it('provides a checkbox controlling timed state', async () => {
    const render = mount(<NewScreen.wrappedComponent store={store} />);

    expect(render.find(CheckBox)).toHaveLength(1);
    expect(render.find(CheckBox).at(0).props().label).toEqual('Timed Game:');
    expect(render.find(CheckBox).at(0).props().labelBefore).toBeTruthy();

    expect(render.find(CheckBox).at(0).props().checked).toBeFalsy();
    runInAction(() => { store.newGameOptions.set('timed', true); });
    render.update();
    expect(render.find(CheckBox).at(0).props().checked).toBeTruthy();

    expect(render.find(CheckBox).at(0).props().onChange).toEqual(render.instance().toggleTimed);
  });

  it('provides buttons to open the instructions, and to start the game', async () => {
    const render = mount(<NewScreen.wrappedComponent store={store} />);

    expect(render.find(Button)).toHaveLength(2);
    expect(render.find({ onPress: store.openInstructionsModal })).toHaveLength(2);
    expect(render.find({ onPress: render.instance().start })).toHaveLength(2);
  });
});
