import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { inject, observer } from 'mobx-react';
import Spinner from 'react-native-loading-spinner-overlay';

import MenuDrawer from '../components/MenuDrawer';
import MenuDrawerStyle from '../styles/MenuDrawerStyle';

// Until react-native-modalbox updates, use this to stop backAndroid warnings.
import Modal from '../react-native-modalbox';

@inject('appStore') @observer
class App extends React.Component {
  static propTypes = {
    appStore: PropTypes.shape({
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
        <Modal
          backButtonClose
          entry={'bottom'}
          position={'center'}
          style={MenuDrawerStyle.modal}
          ref={(ref) => { appStore.gameMenu = ref; }}
          swipeToClose
        >
          <MenuDrawer />
        </Modal>
      </View>
    );
  }
}

export default App;
