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
  },
  contentWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: verticalScale(15),
    paddingLeft: verticalScale(20),
    paddingRight: verticalScale(20),
    paddingTop: verticalScale(15),
  },
  text: {
    fontFamily: 'Grundschrift-Bold',
    color: '#000000',
    fontSize: verticalScale(20),
  },
});
