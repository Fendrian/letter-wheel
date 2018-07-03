import { Dimensions, StyleSheet } from 'react-native';
import { verticalScale } from 'react-native-size-matters';

const window = Dimensions.get('window');

export default StyleSheet.create({
  modal: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    width: (window.width - verticalScale(50)),
  },
  line: {
    width: (window.width - verticalScale(50)),
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: verticalScale(4),
    padding: verticalScale(20),
  },
  text: {
    color: '#000',
    fontSize: verticalScale(18),
  },
});
