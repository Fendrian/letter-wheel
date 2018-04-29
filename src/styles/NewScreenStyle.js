import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  buttonWrapper: {
    alignContent: 'center',
    justifyContent: 'center',
    width: 160,
  },
  checkBoxWrapper: {
    paddingBottom: 12,
    paddingLeft: 6,
  },
  customMarker: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    width: 35,
    height: 35,
  },
  header: {
    alignContent: 'center',
    alignSelf: 'center',
    backgroundColor: 'transparent',
    overflow: 'hidden',
    maxWidth: 400,
    paddingBottom: 15,
    paddingTop: 10,
  },
  headerBackground: {
    alignContent: 'center',
    alignSelf: 'center',
    justifyContent: 'flex-end',
    position: 'absolute',
    width: '100%',
    height: null,
    bottom: 0,
  },
  headerText: {
    color: '#000',
    fontFamily: 'OFLGoudyStM',
    fontSize: 40,
    textAlign: 'center',
  },
  headerTextWrapper: {
    marginBottom: 10,
  },
  menuRow: {
    alignContent: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 25,
    paddingVertical: 10,
    maxWidth: 400,
  },
  segmented: {
    flex: 1,
  },
  sliderStyle: {
    height: 20,
    paddingVertical: 10,
  },
  timer: {
    marginHorizontal: 1,
  },
  timerLabel: {
    color: '#000',
    fontFamily: 'RujisHandwritingFontv.2.0',
    fontSize: 20,
  },
  wordItems: {
    fontSize: 20,
    paddingVertical: 10,
  },
  words: {
    flex: 1,
    marginHorizontal: 1,
  },
  wordsGeneratedWrapper: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 12,
    paddingLeft: 6,
  },
  wordsGenerated: {
    fontFamily: 'RujisHandwritingFontv.2.0',
    fontSize: 20,
  },
  wrapper: {
    alignContent: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});
