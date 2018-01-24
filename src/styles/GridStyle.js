import { StyleSheet } from 'react-native';

const block = {
  alignItems: 'center',
  borderRadius: 3,
  flex: (1 / 3),
  justifyContent: 'center',
  margin: 1,
  width: 98,
  height: 98,
};

export default StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 300,
    height: 300,
  },
  row: {
    flex: (1 / 3),
    flexDirection: 'row',
    width: 300,
  },
  block: {
    ...block,
    backgroundColor: '#fff',
  },
  blockSelected: {
    ...block,
    backgroundColor: '#ffa',
  },
  centerBlock: {
    ...block,
    backgroundColor: '#aaa',
  },
  centerBlockSelected: {
    ...block,
    backgroundColor: '#aa6',
  },
  gridWrapper: {
    alignItems: 'center',
    height: 320,
    justifyContent: 'center',
    width: 320,
  },
  letter: {
    color: '#000',
    fontSize: 60,
  },
});
