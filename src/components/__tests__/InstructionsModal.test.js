import React from 'react';
import { mount } from 'enzyme';

import InstructionsModal from '../InstructionsModal';

describe('Instructions Modal', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('matches the snapshot', () => {
    const render = mount((
      <InstructionsModal
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
      <InstructionsModal
        isOpen
        onClosed={jest.fn()}
      />
    ));
    render.setProps({ isOpen: false });
    expect(render.props().onClosed).toHaveBeenCalledTimes(0);
    jest.runAllTimers();
    expect(render.props().onClosed).toHaveBeenCalledTimes(1);
    render.setProps({ isOpen: true });
    expect(render.props().onClosed).toHaveBeenCalledTimes(1);
  });
});
