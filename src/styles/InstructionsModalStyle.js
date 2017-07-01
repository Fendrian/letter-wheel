import { Dimensions, StyleSheet } from 'react-native';

const window = Dimensions.get('window');

export default StyleSheet.create({
  modal: {
    backgroundColor: '#fff',
    borderRadius: 4,
    height: (window.height - 120),
    width: (window.width - 50),
  },
  line: {
    width: (window.width - 50),
  },
  container: {
    margin: 20,
  },
  text: {
    color: '#000',
    fontSize: 18,
  },
});
