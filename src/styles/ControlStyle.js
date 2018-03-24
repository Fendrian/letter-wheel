import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    justifyContent: 'center',
    flexDirection: 'column',
    flex: 1,
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
    marginTop: 10,
    overflow: 'hidden',
  },
  leftColumnHeader: {
    alignItems: 'center',
    backgroundColor: '#aaa',
    justifyContent: 'center',
  },
  leftColumnHeaderText: {
    fontSize: 15,
    color: '#444',
    margin: 5,
  },
  rightColumn: {
    flex: 6,
    marginBottom: 10,
    marginLeft: 10,
    marginTop: 10,
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
