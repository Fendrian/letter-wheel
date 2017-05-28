import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  portrait: {
    flexDirection: 'column',
  },
  landscape: {
    flexDirection: 'row',
  },
  gridWrapper: {
    alignItems: 'center',
    backgroundColor: '#a6f',
    height: 350,
    justifyContent: 'center',
    width: 350,
  },
  dataWrapper: {
    backgroundColor: '#16f',
    flex: 1,
  },
});
