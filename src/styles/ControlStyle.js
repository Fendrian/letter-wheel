import { StyleSheet } from 'react-native';

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
    flex: 1,
    justifyContent: 'center',
    margin: 5,
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
  timerContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  timerText: {
    color: '#000',
    fontSize: 20,
  },
  progressContainer: {
    alignItems: 'center',
    flex: 2,
    justifyContent: 'center',
  },
  progressText: {
    color: '#227711',
    fontSize: 30,
    textAlign: 'center',
  },
  progressTextSmall: {
    color: '#000',
    fontSize: 20,
    textAlign: 'center',
  },
  resultContainer: {
    alignItems: 'center',
    flex: 1,
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
    flex: 4,
    marginBottom: 10,
  },
  rightColumn: {
    flex: 6,
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
  neutral: {
    color: '#444',
    fontSize: 20,
  },
});
