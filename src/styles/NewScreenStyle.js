import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  header: {
    alignItems: 'center',
    height: 70,
    margin: 10,
    width: 350,
  },
  body: {
    alignItems: 'center',
    borderRadius: 4,
    height: 300,
  },
  menuRow: {
    borderRadius: 4,
    flexDirection: 'row',
    marginHorizontal: 25,
    marginVertical: 15,
    maxWidth: 400,
  },
  headerText: {
    color: '#000',
    fontSize: 50,
    textAlign: 'center',
  },
  words: {
    flex: 1,
  },
  timer: {
    alignItems: 'flex-end',
    flex: 1,
  },
  timerLabel: {
    color: '#000',
    fontSize: 20,
  },
  wordContainer: {
    margin: 1,
  },
  wordItems: {
    fontSize: 20,
  },
  buttonWrapper: {
    flex: 1,
    flexDirection: 'row',
  },
  buttons: {
    backgroundColor: '#999',
    color: '#000',
    fontSize: 20,
    padding: 20,
  },
});
