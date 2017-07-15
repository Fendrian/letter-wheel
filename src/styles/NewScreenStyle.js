import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  button: {
    alignContent: 'center',
    backgroundColor: '#999',
    borderRadius: 4,
    justifyContent: 'center',
    height: 60,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: '#000',
    fontSize: 20,
    lineHeight: 20,
  },
  header: {
    marginBottom: 10,
  },
  headerText: {
    color: '#000',
    fontSize: 50,
    textAlign: 'center',
  },
  menuRow: {
    alignContent: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 25,
    paddingVertical: 10,
    maxWidth: 400,
  },
  segmented: {
    flex: 1,
  },
  sliderStyle: {
    height: 30,
    paddingVertical: 20,
    overflow: 'visible',
  },
  timer: {
    alignItems: 'flex-end',
    flex: 1,
  },
  timerLabel: {
    color: '#000',
    fontSize: 20,
  },
  wordItems: {
    fontSize: 20,
    paddingVertical: 10,
  },
  words: {
    flex: 1,
  },
  wordsGenerated: {
    fontSize: 20,
  },
  wrapper: {
    alignContent: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});
