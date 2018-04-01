import React from 'react';
import PropTypes from 'prop-types';
import { StatusBar, View } from 'react-native';
import { inject, observer } from 'mobx-react';
import Spinner from 'react-native-loading-spinner-overlay';

import MenuModal from '../components/MenuModal';
import AboutModal from '../components/AboutModal';
import InstructionsModal from '../components/InstructionsModal';

@inject('store')
@observer
export default class App extends React.Component {
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
    return (
      <View style={{ flex: 1 }}>
        <StatusBar
          backgroundColor="#ffffff55"
          translucent
        />
        <Spinner
          visible={this.props.store.loading}
          textContent="Loading..."
          textStyle={{ color: '#FFF' }}
        />
        {this.props.children}
        <MenuModal
          isOpen={this.props.store.isMenuModalOpen}
          onClosed={this.props.store.closeMenuModal}
        />
        <AboutModal
          isOpen={this.props.store.isAboutModalOpen}
          onClosed={this.props.store.closeAboutModal}
        />
        <InstructionsModal
          isOpen={this.props.store.isInstructionsModalOpen}
          onClosed={this.props.store.closeInstructionsModal}
        />
      </View>
    );
  }
}
