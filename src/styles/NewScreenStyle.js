import { StyleSheet } from 'react-native';
import { verticalScale } from 'react-native-size-matters';

export default StyleSheet.create({
  buttonWrapper: {
    alignContent: 'center',
    justifyContent: 'center',
    marginBottom: verticalScale(20),
    width: verticalScale(160),
  },
  checkBoxWrapper: {
    paddingBottom: verticalScale(12),
    paddingLeft: verticalScale(6),
  },
  customMarker: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    width: verticalScale(35),
    height: verticalScale(35),
  },
  header: {
    alignContent: 'center',
    alignSelf: 'center',
    backgroundColor: 'transparent',
    justifyContent: 'space-around',
    flex: 1,
    marginTop: verticalScale(30),
    maxWidth: verticalScale(400),
    maxHeight: verticalScale(350),
    paddingBottom: verticalScale(15),
    paddingTop: verticalScale(15),
  },
  headerBackgroundBottom: {
    alignContent: 'center',
    alignSelf: 'center',
    justifyContent: 'flex-end',
    position: 'absolute',
    width: '100%',
    height: verticalScale(50),
    bottom: verticalScale(-10),
  },
  headerBackgroundBody: {
    alignContent: 'center',
    alignSelf: 'center',
    justifyContent: 'flex-end',
    position: 'absolute',
    width: '100%',
    height: '100%',
    bottom: verticalScale(39),
  },
  headerText: {
    color: '#000',
    fontFamily: 'OFLGoudyStM',
    fontSize: verticalScale(40),
    textAlign: 'center',
  },
  headerTextWrapper: {
    marginBottom: verticalScale(10),
  },
  menuRow: {
    alignContent: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: verticalScale(25),
    maxWidth: verticalScale(400),
  },
  sliderStyle: {
    height: verticalScale(20),
    paddingVertical: verticalScale(20),
  },
  timer: {
    marginHorizontal: verticalScale(1),
  },
  timerLabel: {
    color: '#000',
    fontFamily: 'RujisHandwritingFontv.2.0',
    fontSize: verticalScale(20),
  },
  verticalButtonWrapper: {
    alignContent: 'center',
    justifyContent: 'center',
    marginBottom: verticalScale(8),
  },
  wordsGeneratedWrapper: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: verticalScale(12),
    paddingLeft: verticalScale(6),
  },
  wordsGenerated: {
    fontFamily: 'RujisHandwritingFontv.2.0',
    fontSize: verticalScale(20),
  },
  wrapper: {
    alignContent: 'center',
    flex: 1,
    justifyContent: 'space-around',
    maxHeight: verticalScale(500),
  },
});
