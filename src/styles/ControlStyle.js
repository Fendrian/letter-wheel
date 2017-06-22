import { StyleSheet } from 'react-native';

const block = {
  alignItems: 'center',
  flex: (1 / 3),
  justifyContent: 'center',
  margin: 1,
  width: 98,
  height: 98,
};

export default StyleSheet.create({
  container: {
    justifyContent: 'center',
    flexDirection: 'column',
    flex: 1,
  },
  backspaceTouch: {
    alignItems: 'center',
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    width: 60,
  },
  buttonWrapper: {
    marginLeft: 10,
    marginRight: 10,
  },
  entryContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 50,
    justifyContent: 'flex-start',
    marginLeft: 10,
    marginRight: 10,
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
  resultContainer: {
    alignItems: 'center',
    height: 40,
    justifyContent: 'center',
  },
  resultText: {
    fontSize: 20,
    color: '#444',
  },
  columnContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  leftColumn: {
    backgroundColor: '#ccc',
    borderRadius: 4,
    flex: 0.4,
    marginBottom: 10,
  },
  rightColumn: {
    flex: 0.6,
  },
  row: {
    marginLeft: 10,
    marginBottom: 10,
  },
  correct: {
    color: '#227711',
    fontSize: 20,
  },
  incorrect: {
    color: '#772211',
    fontSize: 20,
    textDecorationLine: 'line-through',
  },
});
