import React from 'react';
import { ImageBackground, TouchableWithoutFeedback } from 'react-native';
import { mount } from 'enzyme';
import { isAction, isObservableProp, runInAction } from 'mobx';

import Button from '../Button';

describe('Button component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('matches the snapshot', () => {
    const render = mount((
      <Button />
    ));
    expect(render).toMatchSnapshot();
  });

  it('provides an \'isPressing\' observable', () => {
    const render = mount((
      <Button />
    ));
    expect(render.instance().isPressing).toEqual(false);
    expect(isObservableProp(render.instance(), 'isPressing')).toBeTruthy();
  });

  it('provides a \'beginPress\' action method', () => {
    const render = mount((
      <Button />
    ));
    expect(render.instance().beginPress).toEqual(expect.any(Function));
    expect(isAction(render.instance().beginPress)).toBeTruthy();
    expect(render.instance().isPressing).toEqual(false);
    expect(render.instance().beginPress()).toBeUndefined();
    expect(render.instance().isPressing).toEqual(true);
  });

  it('provides a \'endPress\' action method', () => {
    const render = mount((
      <Button />
    ));
    runInAction(() => { render.instance().isPressing = true; });
    expect(render.instance().endPress).toEqual(expect.any(Function));
    expect(isAction(render.instance().endPress)).toBeTruthy();
    expect(render.instance().isPressing).toEqual(true);
    expect(render.instance().endPress()).toBeUndefined();
    expect(render.instance().isPressing).toEqual(false);
  });

  it('renders a touchable that manages isPressing state and triggers onPress', () => {
    const onPress = jest.fn();
    const render = mount((
      <Button
        onPress={onPress}
      />
    ));
    const touchable = render.find(TouchableWithoutFeedback).at(0);
    expect(touchable.props().onPressIn).toEqual(render.instance().beginPress);
    expect(touchable.props().onPressOut).toEqual(render.instance().endPress);
    expect(touchable.props().onPress).toEqual(onPress);
  });

  it('renders correct images based on colour prop and press state', () => {
    const render = mount((
      <Button />
    ));
    let image = render.find(ImageBackground).at(0);
    expect(image.props().source.testUri).toEqual('src/images/buttonYellowPassive.png');

    runInAction(() => { render.instance().isPressing = true; });
    render.update();
    image = render.find(ImageBackground).at(0);
    expect(image.props().source.testUri).toEqual('src/images/buttonYellowActive.png');

    runInAction(() => { render.instance().isPressing = false; });
    render.setProps({ colour: 'blue' });
    render.update();
    image = render.find(ImageBackground).at(0);
    expect(image.props().source.testUri).toEqual('src/images/buttonBluePassive.png');

    runInAction(() => { render.instance().isPressing = true; });
    render.update();
    image = render.find(ImageBackground).at(0);
    expect(image.props().source.testUri).toEqual('src/images/buttonBlueActive.png');
  });
});
