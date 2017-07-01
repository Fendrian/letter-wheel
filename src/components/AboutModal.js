import React from 'react';
import { ScrollView, Text } from 'react-native';

import AboutModalStyle from '../styles/AboutModalStyle';

export default () => (
  <ScrollView style={AboutModalStyle.container}>
    <Text style={AboutModalStyle.text}>
      {'Target Words is based on the popular newspaper game Target, and inspired by the ' +
      'long-abandoned Target app for Android by Ben Buxton.'}
    </Text>
    <Text style={AboutModalStyle.text}>
      {' '}
    </Text>
    <Text style={AboutModalStyle.text}>
      {'Original copyright © 2017 by Wolf Hatch. The source code for this app is released ' +
      'under the MIT license at https://github.com/Fendrian/target-words'}
    </Text>
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
      {'The base dictionary is Yet Another Word List by Mendel Leo Cooper, which is in the public domain.'}
    </Text>
  </ScrollView>
);
