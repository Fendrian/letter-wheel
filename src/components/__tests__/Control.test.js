import React from 'react';
import { ListView } from 'react-native';
import { mount } from 'enzyme';
import { observable } from 'mobx';

import Control from '../Control';
import ControlStyle from '../../styles/ControlStyle';
import Button from '../Button';

describe('Control component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('matches the snapshot', () => {
    const render = mount((
      <Control />
    ));
    expect(render).toMatchSnapshot();
    render.setProps({
      isScored: true,
      scoreText: 'Nice!',
      wordsToNextLevel: 5,
      selectedLetters: 'akdc',
      statusText: 'Game scored.',
      timerString: '1m 20s',
      tried: observable.map({
        alit: true,
        yrasd: false,
        built: true,
        bail: true,
        asdf: false,
      }),
      words: observable.map({
        alit: true,
        bail: true,
        built: true,
        hail: true,
        halt: true,
        haul: true,
        tail: true,
      }),
    });
    render.update();
    expect(render).toMatchSnapshot();
  });

  it('provides a formattedTriedWords computed with formatting indications', () => {
    const render = mount((
      <Control />
    ));
    const instance = render.instance();
    expect(instance.formattedTriedWords).toEqual([
      { word: 'No words', style: 'neutral' },
    ]);

    render.props().words.replace({
      alit: true,
      bail: true,
      built: true,
      hail: true,
      halt: true,
      haul: true,
      tail: true,
    });
    expect(instance.formattedTriedWords).toEqual([
      { word: 'No words', style: 'neutral' },
    ]);

    render.props().tried.replace({
      alit: true,
      yrasd: false,
      built: true,
      bail: true,
      asdf: false,
    });
    expect(instance.formattedTriedWords).toEqual([
      { word: 'alit', style: 'correct' },
      { word: 'asdf', style: 'incorrect' },
      { word: 'bail', style: 'correct' },
      { word: 'built', style: 'correct' },
      { word: 'yrasd', style: 'incorrect' },
    ]);

    render.setProps({ isScored: true });
    expect(instance.formattedTriedWords).toEqual([
      { word: 'Not found:', style: 'neutral' },
      { word: 'hail', style: 'neutral' },
      { word: 'halt', style: 'neutral' },
      { word: 'haul', style: 'neutral' },
      { word: 'tail', style: 'neutral' },
      { word: ' ', style: 'neutral' },
      { word: 'Your words:', style: 'neutral' },
      { word: 'alit', style: 'correct' },
      { word: 'asdf', style: 'incorrect' },
      { word: 'bail', style: 'correct' },
      { word: 'built', style: 'correct' },
      { word: 'yrasd', style: 'incorrect' },
    ]);

    render.props().tried.replace({
      alit: true,
      asdf: false,
      bail: true,
      built: true,
      hail: true,
      halt: true,
      haul: true,
      tail: true,
      yrasd: false,
    });
    expect(instance.formattedTriedWords).toEqual([
      { word: ' ', style: 'neutral' },
      { word: 'Your words:', style: 'neutral' },
      { word: 'alit', style: 'correct' },
      { word: 'asdf', style: 'incorrect' },
      { word: 'bail', style: 'correct' },
      { word: 'built', style: 'correct' },
      { word: 'hail', style: 'correct' },
      { word: 'halt', style: 'correct' },
      { word: 'haul', style: 'correct' },
      { word: 'tail', style: 'correct' },
      { word: 'yrasd', style: 'incorrect' },
    ]);

    render.props().tried.clear();
    expect(instance.formattedTriedWords).toEqual([
      { word: 'Not found:', style: 'neutral' },
      { word: 'alit', style: 'neutral' },
      { word: 'bail', style: 'neutral' },
      { word: 'built', style: 'neutral' },
      { word: 'hail', style: 'neutral' },
      { word: 'halt', style: 'neutral' },
      { word: 'haul', style: 'neutral' },
      { word: 'tail', style: 'neutral' },
    ]);
  });

  it('provides a feedbackText computed which returns number of words to level up', () => {
    const render = mount((
      <Control />
    ));
    const instance = render.instance();
    expect(instance.feedbackText).toEqual('');
    render.setProps({ wordsToNextLevel: 1 });
    expect(instance.feedbackText).toEqual('1 word to level up');
    render.setProps({ wordsToNextLevel: 2 });
    expect(instance.feedbackText).toEqual('2 words to level up');
    render.setProps({ wordsToNextLevel: 8 });
    expect(instance.feedbackText).toEqual('8 words to level up');
    render.setProps({ wordsToNextLevel: 0 });
    expect(instance.feedbackText).toEqual('');
  });

  it('provides a submit button', () => {
    const render = mount((
      <Control
        onSubmit={jest.fn()}
      />
    ));
    const submit = render.find(Button).find({ title: 'Submit' }).at(0);
    expect(submit.props().onPress).toEqual(expect.any(Function));
    expect(render.props().onSubmit).toHaveBeenCalledTimes(0);
    submit.props().onPress();
    expect(render.props().onSubmit).toHaveBeenCalledTimes(1);
  });

  it('provides a menu button', () => {
    const render = mount((
      <Control
        onMenu={jest.fn()}
      />
    ));
    const menu = render.find(Button).find({ title: 'Menu' }).at(0);
    expect(menu.props().onPress).toEqual(expect.any(Function));
    expect(render.props().onMenu).toHaveBeenCalledTimes(0);
    menu.props().onPress();
    expect(render.props().onMenu).toHaveBeenCalledTimes(1);
  });

  it('provides a list of tried words', () => {
    const render = mount((
      <Control
        onMenu={jest.fn()}
        isScored
        scoreText="Nice!"
        wordsToNextLevel={5}
        selectedLetters="akdc"
        statusText="Welcome!"
        timerString="30s"
        tried={observable.map({
          bail: true,
          asdf: false,
        })}
        words={observable.map({
          bail: true,
          built: true,
        })}
      />
    ));
    const list = render.find(ListView).at(0);
    // eslint-disable-next-line no-underscore-dangle
    expect(list.props().dataSource._dataBlob).toEqual([
      { word: 'Not found:', style: 'neutral' },
      { word: 'built', style: 'neutral' },
      { word: ' ', style: 'neutral' },
      { word: 'Your words:', style: 'neutral' },
      { word: 'asdf', style: 'incorrect' },
      { word: 'bail', style: 'correct' },
    ]);
    const { renderRow } = list.props();
    const result1 = mount(renderRow({ word: 'bail', style: 'correct' }));
    expect(result1.props().style).toEqual(ControlStyle.correct);
    expect(result1.props().children).toEqual('bail');

    const result2 = mount(renderRow({ word: 'lafe', style: 'incorrect' }));
    expect(result2.props().style).toEqual(ControlStyle.incorrect);
    expect(result2.props().children).toEqual('lafe');

    const result3 = mount(renderRow({ word: 'words', style: 'neutral' }));
    expect(result3.props().style).toEqual(ControlStyle.neutral);
    expect(result3.props().children).toEqual('words');
  });
});
