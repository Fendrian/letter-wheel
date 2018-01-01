import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { inject, observer } from 'mobx-react';
import Spinner from 'react-native-loading-spinner-overlay';

import MenuModal from '../components/MenuModal';
import AboutModal from '../components/AboutModal';
import InstructionsModal from '../components/InstructionsModal';

@inject('appStore')
@observer
class App extends React.Component {
  static propTypes = {
    appStore: PropTypes.shape({
      nav: PropTypes.object.isRequired,
    }).isRequired,
    children: PropTypes.element.isRequired,
  }
  render() {
    const { appStore, children } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <Spinner
          visible={appStore.loading}
          textContent="Loading..."
          textStyle={{ color: '#FFF' }}
        />
        {children}
        <MenuModal />
        <AboutModal />
        <InstructionsModal />
      </View>
    );
  }
}

export default App;
