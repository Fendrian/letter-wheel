import React from 'react';
import PropTypes from 'prop-types';
import { ScrollView, Text, View } from 'react-native';
import { inject, observer } from 'mobx-react';
import Modal from 'react-native-modalbox';

import InstructionsModalStyle from '../styles/InstructionsModalStyle';

@inject('appStore') @observer
class AboutModal extends React.Component {
  static propTypes = {
    appStore: PropTypes.shape({
      instructionsModal: PropTypes.object,
    }).isRequired,
  }
  render() {
    return (
      <Modal
        backButtonClose
        entry={'bottom'}
        position={'center'}
        style={InstructionsModalStyle.modal}
        swipeArea={50}
        ref={(ref) => { this.props.appStore.instructionsModal = ref; }}
        swipeToClose
      >
        <ScrollView style={InstructionsModalStyle.container}>
          <Text style={InstructionsModalStyle.text}>
            {'Target Words is a word-finding game. Select letters from the grid to ' +
            'make words, then click "submit" to see if you found one! Each letter can be used once ' +
            'per word, and every word must contain the center letter.'}
          </Text>
          <Text style={InstructionsModalStyle.text}>
            {' '}
          </Text>
          <Text style={InstructionsModalStyle.text}>
            {'Try variations on valid words you find: "Word", "wording", "words", ' +
            '"wordings", and "worded" are all valid, for example, and both American and British spellings ' +
            'are valid.'}
          </Text>
          <Text style={InstructionsModalStyle.text}>
            {' '}
          </Text>
          <Text style={InstructionsModalStyle.text}>
            {'For a challenge, try timed mode. Time is added for each correct word, but the ' +
            'clock is relentless!'}
          </Text>
          <Text style={InstructionsModalStyle.text}>
            {' '}
          </Text>
          <View>
            <Text style={InstructionsModalStyle.text}>
              {'Speed tips:'}
            </Text>
            <Text style={InstructionsModalStyle.text}>
              {'  • Long-press letters to submit'}
            </Text>
            <Text style={InstructionsModalStyle.text}>
              {'  • Long-press backspace to clear'}
            </Text>
          </View>
          <Text style={InstructionsModalStyle.text}>
            {' '}
          </Text>
          <Text style={InstructionsModalStyle.text}>
            {'Good luck!'}
          </Text>
        </ScrollView>
      </Modal>
    );
  }
}

export default AboutModal;
