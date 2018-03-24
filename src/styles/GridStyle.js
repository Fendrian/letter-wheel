import { StyleSheet } from 'react-native';

const block = {
  alignItems: 'center',
  borderColor: '#000000',
  borderWidth: 2,
  flex: (1 / 3),
  justifyContent: 'center',
  margin: 0,
};

export default StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 3,
    width: 300,
    height: 300,
  },
  row: {
    flex: (1 / 3),
    flexDirection: 'row',
    margin: 0,
  },
  backspaceTouch: {
    alignItems: 'center',
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    width: 60,
  },
  buttonWrapper: {
    flex: 1,
    justifyContent: 'center',
    margin: 5,
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
  entryContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 50,
    justifyContent: 'flex-start',
    marginHorizontal: 10,
  },
  entryWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: '#444',
    flex: 1,
    height: 30,
    marginLeft: 20,
  },
  entryText: {
    color: '#000',
    fontSize: 20,
  },
  gridWrapper: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    justifyContent: 'center',
  },
  letter: {
    color: '#000',
    fontSize: 60,
  },
});
