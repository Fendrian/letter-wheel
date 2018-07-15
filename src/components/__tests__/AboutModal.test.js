import React from 'react';
import { mount } from 'enzyme';
import { Linking } from 'react-native';
import Hyperlink from 'react-native-hyperlink';

import AboutModal from '../AboutModal';

jest.spyOn(Linking, 'openURL');

describe('About Modal', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('matches the snapshot', () => {
    const render = mount((
      <AboutModal
        isOpen={false}
        onClosed={jest.fn()}
      />
    ));
    expect(render).toMatchSnapshot();
    render.setProps({ isOpen: true });
    expect(render).toMatchSnapshot();
  });

  it('calls onClosed when closed once all animation has finished', () => {
    const render = mount((
      <AboutModal
        isOpen
        onClosed={jest.fn()}
      />
    ));
    render.setProps({ isOpen: false });
    expect(render.props().onClosed).toHaveBeenCalledTimes(0);
    jest.advanceTimersByTime(1000);
    expect(render.props().onClosed).toHaveBeenCalledTimes(1);
    render.setProps({ isOpen: true });
    expect(render.props().onClosed).toHaveBeenCalledTimes(1);
  });

  it('links to the Target game GitHub repository', () => {
    const render = mount((
      <AboutModal
        isOpen
        onClosed={jest.fn()}
      />
    ));
    const link = render.find(Hyperlink).at(0);
    expect(link.props().onPress).toEqual(expect.any(Function));
    link.props().onPress();
    expect(Linking.openURL).toHaveBeenCalledTimes(1);
    expect(Linking.openURL).toHaveBeenCalledWith('https://github.com/buxtronix/target');
  });

  it('links to the GitHub repository', () => {
    const render = mount((
      <AboutModal
        isOpen
        onClosed={jest.fn()}
      />
    ));
    const link = render.find(Hyperlink).at(1);
    expect(link.props().onPress).toEqual(expect.any(Function));
    link.props().onPress();
    expect(Linking.openURL).toHaveBeenCalledTimes(1);
    expect(Linking.openURL).toHaveBeenCalledWith('https://www.github.com/Fendrian/letter-wheel/');
  });
});
