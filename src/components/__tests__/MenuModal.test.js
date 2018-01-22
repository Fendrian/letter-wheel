import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { mount } from 'enzyme';

import MenuModal from '../MenuModal';
import AppStore from '../../data/store';

describe('Menu Modal', () => {
  let store;

  beforeEach(() => {
    store = new AppStore();
    Object.getOwnPropertyNames(store).forEach((key) => {
      if (typeof (store[key]) === 'function') {
        jest.spyOn(store, key);
      }
    });
  });
  afterEach(() => {
    store = undefined;
    jest.clearAllMocks();
  });

  it('matches the snapshot', () => {
    const render = mount((
      <MenuModal
        isOpen={false}
        onClosed={jest.fn()}
        store={store}
      />
    ));
    expect(render).toMatchSnapshot();
    render.setProps({ isOpen: true });
    expect(render).toMatchSnapshot();
  });

  it('calls onClosed when closed once all animation has finished', () => {
    const render = mount((
      <MenuModal
        isOpen
        onClosed={jest.fn()}
        store={store}
      />
    ));
    render.setProps({ isOpen: false });
    expect(render.props().onClosed).toHaveBeenCalledTimes(0);
    jest.runAllTimers();
    expect(render.props().onClosed).toHaveBeenCalledTimes(1);
    render.setProps({ isOpen: true });
    expect(render.props().onClosed).toHaveBeenCalledTimes(1);
  });

  it('starts a new game when the first button is pressed', () => {
    jest.spyOn(store.nav, 'resetto');
    const render = mount((
      <MenuModal
        isOpen
        onClosed={jest.fn()}
        store={store}
      />
    ));

    const links = render.find(TouchableOpacity);

    const button = links.at(0);
    jest.clearAllMocks();
    expect(button.props().onPress).toEqual(expect.any(Function));
    expect(button.find(Text).props().children).toEqual('New Game');
    button.props().onPress();
    expect(store.closeMenuModal).toHaveBeenCalledTimes(1);
    expect(store.nav.resetto).toHaveBeenCalledTimes(1);
    expect(store.nav.resetto).toHaveBeenCalledWith('New');
  });

  it('scores the game when the second button is pressed', () => {
    jest.spyOn(store.nav, 'resetto');
    const render = mount((
      <MenuModal
        isOpen
        onClosed={jest.fn()}
        store={store}
      />
    ));

    const links = render.find(TouchableOpacity);

    const button = links.at(1);
    jest.clearAllMocks();
    expect(button.props().onPress).toEqual(expect.any(Function));
    expect(button.find(Text).props().children).toEqual('Score This Game');
    button.props().onPress();
    expect(store.closeMenuModal).toHaveBeenCalledTimes(1);
    expect(store.scoreGame).toHaveBeenCalledTimes(1);
  });

  it('opens the instructions modal when the third button is pressed', () => {
    jest.spyOn(store.nav, 'resetto');
    const render = mount((
      <MenuModal
        isOpen
        onClosed={jest.fn()}
        store={store}
      />
    ));

    const links = render.find(TouchableOpacity);

    const button = links.at(2);
    jest.clearAllMocks();
    expect(button.props().onPress).toEqual(expect.any(Function));
    expect(button.find(Text).props().children).toEqual('Instructions');
    button.props().onPress();
    expect(store.openInstructionsModal).toHaveBeenCalledTimes(1);
  });

  it('opens the about modal when the fourth button is pressed', () => {
    jest.spyOn(store.nav, 'resetto');
    const render = mount((
      <MenuModal
        isOpen
        onClosed={jest.fn()}
        store={store}
      />
    ));

    const links = render.find(TouchableOpacity);

    const button = links.at(3);
    jest.clearAllMocks();
    expect(button.props().onPress).toEqual(expect.any(Function));
    expect(button.find(Text).props().children).toEqual('About Target Words');
    button.props().onPress();
    expect(store.openAboutModal).toHaveBeenCalledTimes(1);
  });
});
