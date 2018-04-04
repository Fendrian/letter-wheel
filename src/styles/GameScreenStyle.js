import { StyleSheet } from 'react-native';

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
    height: 375,
    width: 400,
    right: -320,
    top: -220,
  },
});
