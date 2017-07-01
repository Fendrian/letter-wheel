import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { inject, observer } from 'mobx-react';
import Spinner from 'react-native-loading-spinner-overlay';

import MenuModal from '../components/MenuModal';
import MenuModalStyle from '../styles/MenuModalStyle';
import AboutModal from '../components/AboutModal';
import AboutModalStyle from '../styles/AboutModalStyle';
import InstructionsModal from '../components/InstructionsModal';
import InstructionsModalStyle from '../styles/InstructionsModalStyle';

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
          style={MenuModalStyle.modal}
          swipeArea={50}
          ref={(ref) => { appStore.gameModal = ref; }}
          swipeToClose
        >
          <MenuModal />
        </Modal>
        <Modal
          backButtonClose
          entry={'bottom'}
          position={'center'}
          style={AboutModalStyle.modal}
          swipeArea={50}
          ref={(ref) => { appStore.aboutModal = ref; }}
          swipeToClose
        >
          <AboutModal />
        </Modal>
        <Modal
          backButtonClose
          entry={'bottom'}
          position={'center'}
          style={InstructionsModalStyle.modal}
          swipeArea={50}
          ref={(ref) => { appStore.instructionsModal = ref; }}
          swipeToClose
        >
          <InstructionsModal />
        </Modal>
      </View>
    );
  }
}

export default App;
