import { StyleSheet } from 'react-native';
import { verticalScale } from 'react-native-size-matters';

export default StyleSheet.create({
  portrait: {
    flex: 1,
    flexDirection: 'column',
    width: '100%',
  },
  landscape: {
    flex: 1,
    flexDirection: 'row',
  },
  dataWrapper: {
    flex: 1,
  },
  decorativePaper: {
    position: 'absolute',
    height: verticalScale(375),
    width: verticalScale(400),
    right: verticalScale(-320),
    top: verticalScale(-220),
  },
});
