import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { StackNavigator } from 'react-navigation';

@inject('appStore') @observer
class App extends React.Component {
  static propTypes = {
    appStore: React.PropTypes.shape({
      navigator: React.PropTypes.object.isRequired,
    }).isRequired,
    navScreens: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    navOptions: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  }
  constructor(props) {
    super(props);
    const { navScreens, navOptions } = props;
    this.Nav = StackNavigator(navScreens, navOptions);
  }
  render() {
    const { Nav } = this;
    const { appStore } = this.props;
    return (
      <Nav ref={(nav) => { appStore.navigator = nav; }} />
    );
  }
}

export default App;
