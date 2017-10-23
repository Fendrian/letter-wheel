import React from 'react';
import Routes from '../Routes';
import Entry from '../Entry';

import AppStore from '../data/AppStore';

const store = new AppStore();

describe('Main entry file', () => {
  it('Exports a Routes component', () => {
    expect(Entry().type).toEqual(<Routes store={store} />.type);
  });
  it('Provides an AppStore', () => {
    expect(Entry().props.store).toBeInstanceOf(AppStore);
  });
});
