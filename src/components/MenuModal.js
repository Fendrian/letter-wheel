import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity } from 'react-native';
import { inject, observer } from 'mobx-react';
import Modal from 'react-native-modalbox';

import MenuModalStyle from '../styles/MenuModalStyle';

export default
@inject('store')
@observer
class MenuModal extends React.Component {
  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClosed: PropTypes.func.isRequired,
    store: PropTypes.shape({
      closeMenuModal: PropTypes.func.isRequired,
      nav: PropTypes.object.isRequired,
      openAboutModal: PropTypes.func.isRequired,
      openInstructionsModal: PropTypes.func.isRequired,
      openMenuModal: PropTypes.func.isRequired,
      scoreGame: PropTypes.func.isRequired,
    }).isRequired,
  }

  render() {
    const { isOpen, onClosed, store } = this.props;
    const {
      closeMenuModal,
      nav,
      openAboutModal,
      openInstructionsModal,
      scoreGame,
    } = store;
    const {
      container,
      divider,
      line,
      text,
      title,
    } = MenuModalStyle;
    return (
      <Modal
        backButtonClose
        entry="bottom"
        isOpen={isOpen}
        onClosed={onClosed}
        position="center"
        style={MenuModalStyle.modal}
        swipeToClose
      >
        <View style={container}>
          <Text style={title}>
            Letter Wheel
          </Text>
          <View style={divider} />
          <TouchableOpacity
            onPress={() => {
              closeMenuModal();
              nav.resetto('New');
            }}
            style={line}
          >
            <Text style={text}>
              New Game
            </Text>
          </TouchableOpacity>
          <View style={divider} />
          <TouchableOpacity
            onPress={() => {
              closeMenuModal();
              scoreGame();
            }}
            style={line}
          >
            <Text style={text}>
              Score This Game
            </Text>
          </TouchableOpacity>
          <View style={divider} />
          <TouchableOpacity
            onPress={openInstructionsModal}
            style={line}
          >
            <Text style={text}>
              Instructions
            </Text>
          </TouchableOpacity>
          <View style={divider} />
          <TouchableOpacity
            onPress={openAboutModal}
            style={line}
          >
            <Text style={text}>
              About Letter Wheel
            </Text>
          </TouchableOpacity>
          <View style={divider} />
        </View>
      </Modal>
    );
  }
}
