import React from 'react';
import { shallow } from 'enzyme';

import Routes from '../Routes';
import Entry from '../Entry';
import AppStore from '../data/AppStore';

describe('Main entry file', () => {
  it('Exports a Routes component', () => {
    expect(shallow(<Entry />).type()).toEqual(Routes);
  });

  it('Provides an AppStore', () => {
    expect(shallow(<Entry />).props().store).toBeInstanceOf(AppStore);
  });
});
