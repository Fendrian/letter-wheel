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
    backgroundColor: '#bbb',
    height: 350,
    justifyContent: 'center',
    width: 350,
  },
  dataWrapper: {
    backgroundColor: '#ddd',
    flex: 1,
  },
});
