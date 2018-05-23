import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  buttonWrapper: {
    alignContent: 'center',
    justifyContent: 'center',
    marginBottom: 20,
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
    justifyContent: 'space-around',
    flex: 1,
    marginTop: 30,
    maxWidth: 400,
    maxHeight: 350,
    paddingBottom: 15,
    paddingTop: 15,
  },
  headerBackgroundBottom: {
    alignContent: 'center',
    alignSelf: 'center',
    justifyContent: 'flex-end',
    position: 'absolute',
    width: '100%',
    height: 50,
    bottom: -10,
  },
  headerBackgroundBody: {
    alignContent: 'center',
    alignSelf: 'center',
    justifyContent: 'flex-end',
    position: 'absolute',
    width: '100%',
    height: '100%',
    bottom: 39,
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
    maxWidth: 400,
  },
  sliderStyle: {
    height: 20,
    paddingVertical: 20,
  },
  timer: {
    marginHorizontal: 1,
  },
  timerLabel: {
    color: '#000',
    fontFamily: 'RujisHandwritingFontv.2.0',
    fontSize: 20,
  },
  verticalButtonWrapper: {
    alignContent: 'center',
    justifyContent: 'center',
    marginBottom: 8,
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
    justifyContent: 'space-around',
    maxHeight: 500,
  },
});
