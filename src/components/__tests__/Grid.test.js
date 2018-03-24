import React from 'react';
import { mount } from 'enzyme';
import { View as AnimatableView } from 'react-native-animatable';
import { Text, TouchableOpacity, Vibration } from 'react-native';

import Grid from '../Grid';

Vibration.vibrate = jest.fn();

describe('Grid component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('matches the snapshot', () => {
    const render = mount((
      <Grid />
    ));
    expect(render).toMatchSnapshot();
    render.setProps({
      gridEntries: [
        { letter: 'a', selected: false },
        { letter: 's', selected: false },
        { letter: 'd', selected: true },
        { letter: 'f', selected: true },
        { letter: 'g', selected: false },
        { letter: 'h', selected: false },
        { letter: 'j', selected: false },
        { letter: 'k', selected: false },
        { letter: 'l', selected: true },
      ],
    });
    expect(render).toMatchSnapshot();
  });

  it('provides submitWord function that triggers animation', () => {
    const render = mount((
      <Grid
        submitWord={jest.fn()}
        triggerAnimation={jest.fn()}
      />
    ));
    render.instance().submitWord();
    expect(render.props().submitWord).toHaveBeenCalledTimes(1);
    expect(render.props().triggerAnimation).toHaveBeenCalledTimes(0);

    // Incorrect word
    jest.clearAllMocks();
    render.props().submitWord.mockReturnValueOnce(false);
    render.instance().submitWord();
    expect(render.props().submitWord).toHaveBeenCalledTimes(1);
    expect(render.props().triggerAnimation).toHaveBeenCalledTimes(1);
    expect(render.props().triggerAnimation).toHaveBeenCalledWith('incorrect');

    // Correct word
    jest.clearAllMocks();
    render.props().submitWord.mockReturnValueOnce(true);
    render.instance().submitWord();
    expect(render.props().submitWord).toHaveBeenCalledTimes(1);
    expect(render.props().triggerAnimation).toHaveBeenCalledTimes(1);
    expect(render.props().triggerAnimation).toHaveBeenCalledWith('correct');
  });

  it('triggers animations when the animationState prop changes', () => {
    const render = mount((
      <Grid
        clearAnimation={jest.fn()}
        submitWord={jest.fn()}
        triggerAnimation={jest.fn()}
      />
    ));

    let animatable = render.find(AnimatableView).at(0);
    expect(animatable.props().animation).toEqual({ 0: {}, 1: {} });
    expect(animatable.props().duration).toEqual(0);
    expect(animatable.props().onAnimationEnd).toEqual(render.props().clearAnimation);

    jest.clearAllMocks();
    render.setProps({ animationState: 'correct' });
    animatable = render.find(AnimatableView).at(0);
    expect(animatable.props().animation).toEqual({
      0.00: { scale: 1 },
      0.05: { scale: 1 },
      0.30: { scale: 1.05 },
      0.70: { scale: 0.95 },
      0.95: { scale: 1 },
      1.00: { scale: 1 },
    });
    expect(animatable.props().duration).toEqual(1000);
    expect(animatable.props().onAnimationEnd).toEqual(render.props().clearAnimation);

    jest.clearAllMocks();
    render.setProps({ animationState: 'incorrect' });
    animatable = render.find(AnimatableView).at(0);
    expect(animatable.props().animation).toEqual({
      0.000: { translateX: 0 },
      0.250: { translateX: -6 },
      0.375: { translateX: 6 },
      0.500: { translateX: -6 },
      0.625: { translateX: 6 },
      0.750: { translateX: -6 },
      1.000: { translateX: 0 },
    });
    expect(animatable.props().duration).toEqual(500);
    expect(animatable.props().onAnimationEnd).toEqual(render.props().clearAnimation);

    jest.clearAllMocks();
    render.setProps({ animationState: '' });
    animatable = render.find(AnimatableView).at(0);
    expect(animatable.props().animation).toEqual({ 0: {}, 1: {} });
    expect(animatable.props().duration).toEqual(0);
    expect(animatable.props().onAnimationEnd).toEqual(render.props().clearAnimation);
  });

  it('toggles selected grid item on touch', () => {
    const render = mount((
      <Grid
        clearAnimation={jest.fn()}
        submitWord={jest.fn()}
        toggleSelected={jest.fn()}
        triggerAnimation={jest.fn()}
      />
    ));

    expect(render.props().toggleSelected).toHaveBeenCalledTimes(0);
    render.find(TouchableOpacity).at(0).props().onPress();
    expect(render.props().toggleSelected).toHaveBeenCalledTimes(1);
    expect(render.props().toggleSelected).toHaveBeenCalledWith('0');

    jest.clearAllMocks();
    render.find(TouchableOpacity).at(0).props().onPress();
    expect(render.props().toggleSelected).toHaveBeenCalledTimes(1);
    expect(render.props().toggleSelected).toHaveBeenCalledWith('0');

    jest.clearAllMocks();
    render.find(TouchableOpacity).at(4).props().onPress();
    expect(render.props().toggleSelected).toHaveBeenCalledTimes(1);
    expect(render.props().toggleSelected).toHaveBeenCalledWith('4');
  });

  it('submits and selects if needed on long press', () => {
    const render = mount((
      <Grid
        clearAnimation={jest.fn()}
        gridEntries={[
          { letter: 'a', selected: false },
          { letter: 's', selected: false },
          { letter: 'd', selected: true },
          { letter: 'f', selected: true },
          { letter: 'g', selected: false },
          { letter: 'h', selected: false },
          { letter: 'j', selected: false },
          { letter: 'k', selected: false },
          { letter: 'l', selected: true },
        ]}
        submitWord={jest.fn()}
        toggleSelected={jest.fn()}
        triggerAnimation={jest.fn()}
      />
    ));

    jest.spyOn(render.instance(), 'submitWord');

    expect(render.props().toggleSelected).toHaveBeenCalledTimes(0);
    expect(Vibration.vibrate).toHaveBeenCalledTimes(0);
    render.find(TouchableOpacity).at(0).props().onLongPress();
    expect(Vibration.vibrate).toHaveBeenCalledTimes(1);
    expect(Vibration.vibrate).toHaveBeenCalledWith(100);
    expect(render.props().toggleSelected).toHaveBeenCalledTimes(1);
    expect(render.props().toggleSelected).toHaveBeenCalledWith('0');
    expect(render.props().submitWord).toHaveBeenCalledTimes(1);

    jest.clearAllMocks();
    expect(render.props().toggleSelected).toHaveBeenCalledTimes(0);
    expect(Vibration.vibrate).toHaveBeenCalledTimes(0);
    render.find(TouchableOpacity).at(2).props().onLongPress();
    expect(Vibration.vibrate).toHaveBeenCalledTimes(1);
    expect(Vibration.vibrate).toHaveBeenCalledWith(100);
    expect(render.props().toggleSelected).toHaveBeenCalledTimes(0);
    expect(render.props().submitWord).toHaveBeenCalledTimes(1);

    jest.clearAllMocks();
    expect(render.props().toggleSelected).toHaveBeenCalledTimes(0);
    expect(Vibration.vibrate).toHaveBeenCalledTimes(0);
    render.find(TouchableOpacity).at(7).props().onLongPress();
    expect(Vibration.vibrate).toHaveBeenCalledTimes(1);
    expect(Vibration.vibrate).toHaveBeenCalledWith(100);
    expect(render.props().toggleSelected).toHaveBeenCalledTimes(1);
    expect(render.props().toggleSelected).toHaveBeenCalledWith('7');
    expect(render.props().submitWord).toHaveBeenCalledTimes(1);
  });

  it('provides a clearOne function', () => {
    const render = mount((
      <Grid
        clearSelected={jest.fn()}
      />
    ));
    expect(render.instance().clearOne).toEqual(expect.any(Function));
    expect(render.instance().clearOne()).toBeUndefined();
    expect(render.props().clearSelected).toHaveBeenCalledTimes(1);
    expect(render.props().clearSelected).toHaveBeenCalledWith(1);
  });

  it('provides a clearAll function', () => {
    const render = mount((
      <Grid
        clearSelected={jest.fn()}
      />
    ));
    expect(render.instance().clearAll).toEqual(expect.any(Function));
    expect(render.instance().clearAll()).toBeUndefined();
    expect(render.props().clearSelected).toHaveBeenCalledTimes(1);
    expect(render.props().clearSelected).toHaveBeenCalledWith(9);
    expect(Vibration.vibrate).toHaveBeenCalledTimes(1);
    expect(Vibration.vibrate).toHaveBeenCalledWith(100);
  });

  it('provides a display of the selected letters', () => {
    const render = mount((
      <Grid
        selectedLetters="fish"
      />
    ));
    expect(render.find(Text).find({ children: 'fish' })).toHaveLength(2);
  });

  it('provides a backspace button with a short and long press action', () => {
    const render = mount((
      <Grid />
    ));
    expect(render.find({
      onPress: render.instance().clearOne,
      onLongPress: render.instance().clearAll,
    })).toHaveLength(1);
  });
});
