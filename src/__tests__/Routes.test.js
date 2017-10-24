import React from 'react';
import { Provider } from 'mobx-react';
import { shallow } from 'enzyme';

import Routes from '../Routes';
import AppStore from '../data/AppStore';

const store = new AppStore();

describe('Main routes file', () => {
  it('Exports a MobX provider', () => {
    expect(shallow(<Routes store={store} />).type()).toEqual(Provider);
  });

  it('Provides an AppStore', () => {
    expect(shallow(<Routes store={store} />).props().appStore).toBeInstanceOf(AppStore);
  });
});
