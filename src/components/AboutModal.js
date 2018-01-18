import React from 'react';
import PropTypes from 'prop-types';
import { Linking, View, Text } from 'react-native';
import { inject, observer } from 'mobx-react';
import Modal from 'react-native-modalbox';
import Hyperlink from 'react-native-hyperlink';

import AboutModalStyle from '../styles/AboutModalStyle';

@inject('appStore')
@observer
export default class AboutModal extends React.Component {
  static propTypes = {
    appStore: PropTypes.shape({
      aboutModal: PropTypes.object,
      loadAboutModal: PropTypes.func.isRequired,
    }).isRequired,
  }
  render() {
    const { appStore } = this.props;
    return (
      <Modal
        backButtonClose
        entry="bottom"
        position="center"
        style={AboutModalStyle.modal}
        ref={appStore.loadAboutModal}
        swipeToClose
      >
        <View style={AboutModalStyle.container}>
          <Text style={AboutModalStyle.text}>
            {'Target Words is based on the popular newspaper game Target, and inspired by the ' +
            'long-abandoned Target app for Android by Ben Buxton.'}
          </Text>
          <Text style={AboutModalStyle.text}>
            {' '}
          </Text>
          <Hyperlink
            linkStyle={{ color: '#2980b9' }}
            onPress={() => {
              Linking.openURL('https://www.github.com/Fendrian/target-words/');
            }}
          >
            <Text style={AboutModalStyle.text}>
              {'Original copyright © 2017-2018 by Wolf Hatch. The source code for this app is released ' +
              'under the MIT license at https://github.com/Fendrian/target-words'}
            </Text>
          </Hyperlink>
          <Text style={AboutModalStyle.text}>
            {' '}
          </Text>
          <Text style={AboutModalStyle.text}>
            {'The code base is primarily coded in Javascript using React-Native, with additional ' +
            'Javascript libraries from NPM that can be viewed in the package.json file on GitHub.'}
          </Text>
          <Text style={AboutModalStyle.text}>
            {' '}
          </Text>
          <Text style={AboutModalStyle.text}>
            {'The word dictionary is drawn from several open-source and public domain word lists. ' +
            'Please see the project on github for more precise information about dictionary generation.'}
          </Text>
        </View>
      </Modal>
    );
  }
}
