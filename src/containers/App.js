import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { inject, observer } from 'mobx-react';
import Spinner from 'react-native-loading-spinner-overlay';

import MenuModal from '../components/MenuModal';
import AboutModal from '../components/AboutModal';
import InstructionsModal from '../components/InstructionsModal';

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
    const { children } = this.props;
    const {
      closeAboutModal,
      closeMenuModal,
      closeInstructionsModal,
      loading,
      isAboutModalOpen,
      isMenuModalOpen,
      isInstructionsModalOpen,
    } = this.props.store;
    return (
      <View style={{ flex: 1 }}>
        <Spinner
          visible={loading}
          textContent="Loading..."
          textStyle={{ color: '#FFF' }}
        />
        {children}
        <MenuModal
          isOpen={isMenuModalOpen}
          onClosed={closeMenuModal}
        />
        <AboutModal
          isOpen={isAboutModalOpen}
          onClosed={closeAboutModal}
        />
        <InstructionsModal
          isOpen={isInstructionsModalOpen}
          onClosed={closeInstructionsModal}
        />
      </View>
    );
  }
}

export default App;
