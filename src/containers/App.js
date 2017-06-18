import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { inject, observer } from 'mobx-react';
import Spinner from 'react-native-loading-spinner-overlay';

@inject('appStore') @observer
class App extends React.Component {
  static propTypes = {
    appStore: PropTypes.shape({
      navigator: PropTypes.object.isRequired,
      nav: PropTypes.object.isRequired,
    }).isRequired,
    children: PropTypes.element.isRequired,
  }
  render() {
    const { appStore, children } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <Spinner visible={appStore.loading} textContent={'Loading...'} textStyle={{ color: '#FFF' }} />
        {children}
      </View>
    );
  }
}

export default App;
