import React from 'react';
import Routes from './Routes';

// Main app data store import
import AppStore from './data/AppStore';

const store = new AppStore();

export default () =>
  <Routes store={store} />;
