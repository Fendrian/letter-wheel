import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  portrait: {
    flex: 1,
    flexDirection: 'column',
  },
  landscape: {
    flex: 1,
    flexDirection: 'row',
  },
  gridWrapper: {
    alignItems: 'center',
    height: 350,
    justifyContent: 'center',
    width: 350,
  },
  dataWrapper: {
    flex: 1,
  },
});
