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
    width: 350,
    height: 300,
  },
  headerText: {
    color: '#000',
    fontSize: 50,
    textAlign: 'center',
  },
  words: {
    borderRadius: 4,
    margin: 20,
    width: 350,
  },
  timer: {
    alignItems: 'flex-end',
    borderRadius: 4,
    margin: 20,
    width: 350,
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
    alignItems: 'center',
    borderRadius: 4,
    flex: 1,
    flexDirection: 'row',
    margin: 20,
  },
  buttons: {
    backgroundColor: '#999',
    color: '#000',
    fontSize: 20,
    marginHorizontal: 20,
    padding: 20,
  },
});
