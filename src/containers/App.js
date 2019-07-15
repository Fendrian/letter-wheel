import React from 'react';
import PropTypes from 'prop-types';
import { StatusBar, View } from 'react-native';
import { inject, observer } from 'mobx-react';
import Spinner from 'react-native-loading-spinner-overlay';

import MenuModal from '../components/MenuModal';
import AboutModal from '../components/AboutModal';
import InstructionsModal from '../components/InstructionsModal';

export default
@inject('store')
@observer
class App extends React.Component {
  static propTypes = {
    store: PropTypes.shape({
      closeAboutModal: PropTypes.func.isRequired,
      closeMenuModal: PropTypes.func.isRequired,
      closeInstructionsModal: PropTypes.func.isRequired,
      loading: PropTypes.bool.isRequired,
      isAboutModalOpen: PropTypes.bool.isRequired,
      isMenuModalOpen: PropTypes.bool.isRequired,
      isInstructionsModalOpen: PropTypes.bool.isRequired,
    }).isRequired,
    children: PropTypes.element.isRequired,
  }

  render() {
    const { children, store } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <StatusBar
          backgroundColor="#00000055"
          translucent
        />
        <Spinner
          visible={store.loading}
          textContent="Loading..."
          textStyle={{ color: '#FFF' }}
        />
        {children}
        <MenuModal
          isOpen={store.isMenuModalOpen}
          onClosed={store.closeMenuModal}
        />
        <AboutModal
          isOpen={store.isAboutModalOpen}
          onClosed={store.closeAboutModal}
        />
        <InstructionsModal
          isOpen={store.isInstructionsModalOpen}
          onClosed={store.closeInstructionsModal}
        />
      </View>
    );
  }
}
