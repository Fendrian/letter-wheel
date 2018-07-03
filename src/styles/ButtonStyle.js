import { StyleSheet } from 'react-native';
import { verticalScale } from 'react-native-size-matters';

export default StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    width: undefined,
    height: undefined,
    marginRight: verticalScale(-4),
  },
  contentWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: verticalScale(2),
    paddingLeft: verticalScale(12),
    paddingRight: verticalScale(12),
    paddingTop: verticalScale(8),
  },
  text: {
    fontFamily: 'Grundschrift-Bold',
    color: '#000000',
    fontSize: verticalScale(20),
    marginBottom: verticalScale(15),
  },
});
