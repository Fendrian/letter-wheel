import React from 'react';
import PropTypes from 'prop-types';
import { Linking, View, Text } from 'react-native';
import Modal from 'react-native-modalbox';
import Hyperlink from 'react-native-hyperlink';

import AboutModalStyle from '../styles/AboutModalStyle';

const AboutModal = ({ isOpen, onClosed }) => (
  <Modal
    backButtonClose
    entry="bottom"
    isOpen={isOpen}
    onClosed={onClosed}
    position="center"
    style={AboutModalStyle.modal}
    swipeToClose
  >
    <View style={AboutModalStyle.container}>
      <Hyperlink
        linkStyle={{ color: '#2980b9' }}
        onPress={() => {
          Linking.openURL('https://github.com/buxtronix/target');
        }}
      >
        <Text style={AboutModalStyle.text}>
          {'Letter Wheel is based on the popular newspaper game Word Wheel, and was inspired by the ' +
          'Target app for Android by Ben Buxton (https://github.com/buxtronix/target), which had not been updated in years when this ' +
          'project was started.'}
        </Text>
      </Hyperlink>
      <Text style={AboutModalStyle.text}>
        {' '}
      </Text>
      <Hyperlink
        linkStyle={{ color: '#2980b9' }}
        onPress={() => {
          Linking.openURL('https://www.github.com/Fendrian/letter-wheel/');
        }}
      >
        <Text style={AboutModalStyle.text}>
          {'Original copyright © 2017-2018 by Wolf Hatch. The source code for this app is released ' +
          'under the MIT license at https://github.com/Fendrian/letter-wheel'}
        </Text>
      </Hyperlink>
      <Text style={AboutModalStyle.text}>
        {' '}
      </Text>
      <Text style={AboutModalStyle.text}>
        {'This work would not be remotely possible without the massive wealth of open-source ' +
        'and public domain resources that it is built upon, a full list of which is available ' +
        'with this project\'s source code on GitHub.'}
      </Text>
    </View>
  </Modal>
);

AboutModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClosed: PropTypes.func.isRequired,
};

export default AboutModal;
