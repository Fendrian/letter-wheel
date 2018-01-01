import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity } from 'react-native';
import { inject, observer } from 'mobx-react';
import Modal from 'react-native-modalbox';

import MenuModalStyle from '../styles/MenuModalStyle';

@inject('appStore')
@observer
export default class MenuModal extends React.Component {
  static propTypes = {
    appStore: PropTypes.shape({
      aboutModal: PropTypes.object,
      loadAboutModal: PropTypes.func.isRequired,
      gameModal: PropTypes.object,
      instructionsModal: PropTypes.object,
      nav: PropTypes.object.isRequired,
      scoreGame: PropTypes.func.isRequired,
    }).isRequired,
  }
  render() {
    const { appStore } = this.props;
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
        position="center"
        style={MenuModalStyle.modal}
        ref={appStore.loadGameModal}
        swipeToClose
      >
        <View style={container}>
          <Text style={title}>
            Target Words
          </Text>
          <View style={divider} />
          <TouchableOpacity
            onPress={() => {
              appStore.gameModal.close();
              appStore.nav.resetto('New');
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
              appStore.gameModal.close();
              appStore.scoreGame();
            }}
            style={line}
          >
            <Text style={text}>
              Score This Game
            </Text>
          </TouchableOpacity>
          <View style={divider} />
          <TouchableOpacity
            onPress={() => {
              appStore.gameModal.close();
              appStore.instructionsModal.open();
            }}
            style={line}
          >
            <Text style={text}>
              Instructions
            </Text>
          </TouchableOpacity>
          <View style={divider} />
          <TouchableOpacity
            onPress={() => {
              appStore.gameModal.close();
              appStore.aboutModal.open();
            }}
            style={line}
          >
            <Text style={text}>
              About Target Words
            </Text>
          </TouchableOpacity>
          <View style={divider} />
        </View>
      </Modal>
    );
  }
}
