import React from 'react';
import { shallow } from 'enzyme';

import Routes from '../Routes';
import Entry from '../Entry';
import store from '../data/store';

describe('Main entry file', () => {
  it('exports a Routes component', () => {
    expect(shallow(<Entry />).type()).toEqual(Routes);
  });

  it('provides a store', () => {
    expect(shallow(<Entry />).props().store).toBeInstanceOf(store);
  });
});
