import React from 'react';
import { Image, ListView, Text } from 'react-native';
import { mount } from 'enzyme';
import { observable, isObservableProp } from 'mobx';

import Control from '../Control';
import ControlStyle from '../../styles/ControlStyle';
import Button from '../Button';

import listBody from '../../images/listBody.png';
import starGold from '../../images/starGold.png';
import starActive from '../../images/starActive.png';
import starInactive from '../../images/starInactive.png';

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
      statusText: 'Game scored',
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

  it('provides a listHeight observable', () => {
    const render = mount((
      <Control />
    ));
    const instance = render.instance();
    expect(instance.listHeight).toEqual(1000);
    expect(isObservableProp(instance, 'listHeight')).toBeTruthy();
  });

  it('provides a setListHeightFromEvent function', () => {
    const render = mount((
      <Control />
    ));
    const instance = render.instance();
    expect(instance.setListHeightFromEvent).toEqual(expect.any(Function));
    expect(instance.setListHeightFromEvent({ nativeEvent: { layout: { height: 5 } } }))
      .toBeUndefined();
    expect(instance.listHeight).toEqual(5);
    expect(instance.setListHeightFromEvent({ nativeEvent: { layout: { height: 1518 } } }))
      .toBeUndefined();
    expect(instance.listHeight).toEqual(1518);
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
    expect(instance.feedbackText).toEqual('Perfect!');
    render.setProps({ wordsToNextLevel: 1 });
    expect(instance.feedbackText).toEqual('1 word\nto level up');
    render.setProps({ wordsToNextLevel: 2 });
    expect(instance.feedbackText).toEqual('2 words\nto level up');
    render.setProps({ wordsToNextLevel: 8 });
    expect(instance.feedbackText).toEqual('8 words\nto level up');
    render.setProps({ wordsToNextLevel: 0 });
    expect(instance.feedbackText).toEqual('Perfect!');
  });

  it('provides a getStars function that returns a list of star states', () => {
    const render = mount((
      <Control />
    ));
    const instance = render.instance();
    expect(instance.getStars).toEqual(expect.any(Function));
    expect(instance.getStars(0)).toEqual([starInactive, starInactive, starInactive]);
    expect(instance.getStars(1)).toEqual([starActive, starInactive, starInactive]);
    expect(instance.getStars(2)).toEqual([starActive, starActive, starInactive]);
    expect(instance.getStars(3)).toEqual([starActive, starActive, starActive]);
    expect(instance.getStars(4)).toEqual([null, starGold, null]);
    expect(instance.getStars(5)).toEqual([starInactive, starInactive, starInactive]);
    expect(instance.getStars(1235)).toEqual([starInactive, starInactive, starInactive]);
  });

  it('provides a submit button', () => {
    const render = mount((
      <Control
        onSubmit={jest.fn()}
      />
    ));
    const submit = render.find(Button).find({ content: 'Input word' }).at(0);
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
    const menu = render.find(Button).find({ content: 'Game menu' }).at(0);
    expect(menu.props().onPress).toEqual(expect.any(Function));
    expect(render.props().onMenu).toHaveBeenCalledTimes(0);
    menu.props().onPress();
    expect(render.props().onMenu).toHaveBeenCalledTimes(1);
  });

  it('sets height of tried word list on layout', () => {
    const render = mount((
      <Control />
    ));
    const instance = render.instance();
    const listParent = render.find({ onLayout: instance.setListHeightFromEvent });
    expect(listParent).toHaveLength(1);
    expect(listParent.find(ListView)).toHaveLength(1);
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
    expect(result1.find(Text).at(0).props().style).toEqual(ControlStyle.correct);
    expect(result1.find(Text).at(0).props().children).toEqual('BAIL');

    const result2 = mount(renderRow({ word: 'lafe', style: 'incorrect' }));
    expect(result2.find(Text).at(0).props().style).toEqual(ControlStyle.incorrect);
    expect(result2.find(Text).at(0).props().children).toEqual('LAFE');

    const result3 = mount(renderRow({ word: 'words', style: 'neutral' }));
    expect(result3.find(Text).at(0).props().style).toEqual(ControlStyle.neutral);
    expect(result3.find(Text).at(0).props().children).toEqual('WORDS');
  });

  it('renders a header on the list', () => {
    const render = mount((
      <Control />
    ));
    const list = render.find(ListView).at(0);
    expect(list.props().renderHeader).toEqual(expect.any(Function));
    const header = mount(list.props().renderHeader());

    expect(header.find(Image)).toHaveLength(1);
    expect(header.find(Image).props().source).toEqual(listBody);
    expect(header.find(Image).props().resizeMode).toEqual('stretch');
    expect(header.find(Image).props().fadeDuration).toEqual(0);
  });

  it('renders a footer on the list', () => {
    const render = mount((
      <Control />
    ));
    const list = render.find(ListView).at(0);
    expect(list.props().renderFooter).toEqual(expect.any(Function));
    const footer = mount(list.props().renderFooter());

    expect(footer.find(Image)).toHaveLength(1);
    expect(footer.find(Image).props().source).toEqual(listBody);
    expect(footer.find(Image).props().resizeMode).toEqual('stretch');
    expect(footer.find(Image).props().fadeDuration).toEqual(0);
  });
});
