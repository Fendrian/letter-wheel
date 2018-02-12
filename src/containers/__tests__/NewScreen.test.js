import React from 'react';
import { mount } from 'enzyme';
import { runInAction } from 'mobx';

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
    expect(render.instance().onSliderMove()).toEqual(undefined);
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
    expect(render.instance().setSelectedOption({ min: 1, max: 645 })).toEqual(undefined);
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
});
