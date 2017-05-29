import { StyleSheet } from 'react-native';

const block = {
  alignItems: 'center',
  flex: (1 / 3),
  justifyContent: 'center',
  margin: 1,
  width: 98,
  height: 98,
}

export default StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#153',
    width: 300,
    height: 300,
  },
  row: {
    backgroundColor: '#457',
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
  letter: {
    color: '#000',
    fontSize: 60,
  },
});
