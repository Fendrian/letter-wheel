import { Dimensions, StyleSheet } from 'react-native';

const window = Dimensions.get('window');

export default StyleSheet.create({
  modal: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    width: (window.width - 50),
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 4,
    padding: 20,
  },
  text: {
    color: '#000',
    fontSize: 18,
  },
});
