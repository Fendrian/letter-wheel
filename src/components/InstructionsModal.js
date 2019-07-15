import React from 'react';
import PropTypes from 'prop-types';
import { Text, View } from 'react-native';
import Modal from 'react-native-modalbox';

import InstructionsModalStyle from '../styles/InstructionsModalStyle';

const InstructionsModal = ({ isOpen, onClosed }) => (
  <Modal
    backButtonClose
    entry="bottom"
    isOpen={isOpen}
    onClosed={onClosed}
    position="center"
    style={InstructionsModalStyle.modal}
    swipeToClose
  >
    <View style={InstructionsModalStyle.container}>
      <Text style={InstructionsModalStyle.text}>
        {'Letter Wheel is a word-finding game. Select letters from the grid to '
        + 'make words, then click "submit" to see if you found one! Each letter can be used once '
        + 'per word, and every word must contain the center letter.'}
      </Text>
      <Text style={InstructionsModalStyle.text}>
        {' '}
      </Text>
      <Text style={InstructionsModalStyle.text}>
        {'Try variations on valid words you find: "Word", "wording", "words", '
        + '"wordings", and "worded" are all valid, for example, and both American and British spellings '
        + 'are valid.'}
      </Text>
      <Text style={InstructionsModalStyle.text}>
        {' '}
      </Text>
      <Text style={InstructionsModalStyle.text}>
        {'For a challenge, try timed mode. Time is added for each correct word, but the '
        + 'clock is relentless!'}
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
    </View>
  </Modal>
);

InstructionsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClosed: PropTypes.func.isRequired,
};

export default InstructionsModal;
