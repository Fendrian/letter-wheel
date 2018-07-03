import { StyleSheet } from 'react-native';
import { verticalScale } from 'react-native-size-matters';

export default StyleSheet.create({
  text: {
    fontSize: verticalScale(20),
  },
  wrapper: {
    alignContent: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});
