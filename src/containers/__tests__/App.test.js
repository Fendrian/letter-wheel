import React from 'react';
import { Text } from 'react-native';
import { mount } from 'enzyme';
import Spinner from 'react-native-loading-spinner-overlay';
import { runInAction } from 'mobx';

import AppStore from '../../data/store';
import App from '../App';
import MenuModal from '../../components/MenuModal';
import AboutModal from '../../components/AboutModal';
import InstructionsModal from '../../components/InstructionsModal';

jest.mock('react-native-loading-spinner-overlay', () => {
  require('react'); // eslint-disable-line global-require
  const { View } = require('react-native'); // eslint-disable-line global-require
  return props => (
    <View {...props} visible={undefined}>
      {'7A9FEEAE-7F90-4135-B5B2-356DB9E822CB'}
    </View>
  );
});
jest.mock('../../components/MenuModal', () => {
  require('react'); // eslint-disable-line global-require
  const { View } = require('react-native'); // eslint-disable-line global-require
  return props => (
    <View {...props}>
      {'D6BA4E9F-2C03-43BE-A2CB-9005355CE3C0'}
    </View>
  );
});
jest.mock('../../components/AboutModal', () => {
  require('react'); // eslint-disable-line global-require
  const { View } = require('react-native'); // eslint-disable-line global-require
  return props => (
    <View {...props}>
      {'2B8A071D-EAE0-4755-B3DC-1DD7AA0B4725'}
    </View>
  );
});
jest.mock('../../components/InstructionsModal', () => {
  require('react'); // eslint-disable-line global-require
  const { View } = require('react-native'); // eslint-disable-line global-require
  return props => (
    <View {...props}>
      {'8E4CFDDB-A054-462D-B718-C182E846D653'}
    </View>
  );
});

describe('Main App component', () => {
  let store;

  beforeEach(() => {
    store = new AppStore();
  });

  afterEach(() => {
    jest.clearAllMocks();
    store = undefined;
  });

  it('matches the snapshot', () => {
    const render = mount((
      <App store={store}>
        <Text>
          C3D066C6-EFB0-4E46-AC72-6E2558B34F1B
        </Text>
      </App>
    ));
    expect(render).toMatchSnapshot();
  });

  it('exports the App component', () => {
    const render = mount((
      <App store={store}>
        <Text>
          616DC9D6-CC2B-4D7A-8B54-B610A2422593
        </Text>
      </App>
    ));
    expect(render.find(App)).toHaveLength(1);
  });

  it('renders a loading spinner', () => {
    const render = mount((
      <App store={store}>
        <Text>
          5F82BC43-6BF3-41F2-A215-CB9F44F208F1
        </Text>
      </App>
    ));
    expect(render.find(Spinner)).toHaveLength(1);
  });

  it('renders the Menu modal', () => {
    const render = mount((
      <App store={store}>
        <Text>
          289FAD8B-45FB-496A-9FEB-AD8DEDD75F25
        </Text>
      </App>
    ));
    expect(render.find(MenuModal)).toHaveLength(1);
    expect(render.find(MenuModal).props().onClosed).toEqual(store.closeMenuModal);
    expect(render.find(MenuModal).props().isOpen).toBeFalsy();
    runInAction(() => { store.isMenuModalOpen = true; });
    render.update();
    expect(render.find(MenuModal).props().isOpen).toBeTruthy();
    runInAction(() => { store.isMenuModalOpen = false; });
    render.update();
    expect(render.find(MenuModal).props().isOpen).toBeFalsy();
  });

  it('renders the About modal', () => {
    const render = mount((
      <App store={store}>
        <Text>
          43032E29-AECF-4389-9D2F-665CBFC13DE9
        </Text>
      </App>
    ));
    expect(render.find(AboutModal)).toHaveLength(1);
    expect(render.find(AboutModal).props().onClosed).toEqual(store.closeAboutModal);
    expect(render.find(AboutModal).props().isOpen).toBeFalsy();
    runInAction(() => { store.isAboutModalOpen = true; });
    render.update();
    expect(render.find(AboutModal).props().isOpen).toBeTruthy();
    runInAction(() => { store.isAboutModalOpen = false; });
    render.update();
    expect(render.find(AboutModal).props().isOpen).toBeFalsy();
  });

  it('renders the Instructions modal', () => {
    const render = mount((
      <App store={store}>
        <Text>
          B9B8DC2D-99D7-4A0F-B7FD-A1CD6A74978D
        </Text>
      </App>
    ));
    expect(render.find(InstructionsModal)).toHaveLength(1);
    expect(render.find(InstructionsModal).props().onClosed).toEqual(store.closeInstructionsModal);
    expect(render.find(InstructionsModal).props().isOpen).toBeFalsy();
    runInAction(() => { store.isInstructionsModalOpen = true; });
    render.update();
    expect(render.find(InstructionsModal).props().isOpen).toBeTruthy();
    runInAction(() => { store.isInstructionsModalOpen = false; });
    render.update();
    expect(render.find(InstructionsModal).props().isOpen).toBeFalsy();
  });

  it('returns on render', () => {
    const render = mount((
      <App store={store}>
        <Text>
          B9B8DC2D-99D7-4A0F-B7FD-A1CD6A74978D
        </Text>
      </App>
    ));
    expect(render.find(InstructionsModal)).toHaveLength(1);
    expect(render.find(InstructionsModal).props().onClosed).toEqual(store.closeInstructionsModal);
    expect(render.find(InstructionsModal).props().isOpen).toBeFalsy();
    runInAction(() => { store.isInstructionsModalOpen = true; });
    render.update();
    expect(render.find(InstructionsModal).props().isOpen).toBeTruthy();
    runInAction(() => { store.isInstructionsModalOpen = false; });
    render.update();
    expect(render.find(InstructionsModal).props().isOpen).toBeFalsy();
  });
});
