import { StyleSheet } from 'react-native';
import { verticalScale } from 'react-native-size-matters';

export default StyleSheet.create({
  modal: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    justifyContent: 'center',
  },
  container: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: verticalScale(4),
    justifyContent: 'center',
    padding: verticalScale(20),
    width: verticalScale(300),
  },
  divider: {
    backgroundColor: '#555',
    height: verticalScale(2),
    width: verticalScale(280),
  },
  line: {
    alignItems: 'center',
    height: verticalScale(60),
    justifyContent: 'center',
    width: verticalScale(280),
  },
  text: {
    color: '#000',
    fontSize: verticalScale(20),
  },
  title: {
    color: '#000',
    fontSize: verticalScale(40),
    marginBottom: verticalScale(20),
  },
});
