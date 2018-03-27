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
    fontFamily: 'RujisHandwritingFontv.2.0',
    color: '#000',
    fontSize: 20,
  },
  progressContainer: {
    alignItems: 'center',
    flex: 2,
    justifyContent: 'center',
  },
  progressText: {
    fontFamily: 'RujisHandwritingFontv.2.0',
    color: '#227711',
    fontSize: 30,
    textAlign: 'center',
  },
  progressTextSmall: {
    fontFamily: 'RujisHandwritingFontv.2.0',
    color: '#000',
    fontSize: 16,
    textAlign: 'center',
  },
  resultContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  resultText: {
    fontFamily: 'RujisHandwritingFontv.2.0',
    fontSize: 20,
    color: '#444',
  },
  columnContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  leftColumn: {
    backgroundColor: '#fff',
    borderRadius: 4,
    flex: 4,
    marginBottom: 10,
    marginTop: 10,
    overflow: 'hidden',
  },
  leftColumnHeader: {
    alignItems: 'center',
    backgroundColor: '#b3c9d0',
    justifyContent: 'center',
  },
  leftColumnHeaderText: {
    fontFamily: 'RujisHandwritingFontv.2.0',
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
    fontFamily: 'RujisHandwritingFontv.2.0',
    color: '#505050',
    fontSize: 20,
  },
  incorrect: {
    fontFamily: 'RujisHandwritingFontv.2.0',
    color: '#a3a3a3',
    fontSize: 20,
    textDecorationLine: 'line-through',
  },
  neutral: {
    fontFamily: 'RujisHandwritingFontv.2.0',
    color: '#444',
    fontSize: 20,
  },
});
