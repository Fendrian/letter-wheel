import { StyleSheet } from 'react-native';
import { verticalScale } from 'react-native-size-matters';

const block = {
  alignItems: 'center',
  borderColor: '#000000',
  borderWidth: verticalScale(3),
  flex: 1,
  justifyContent: 'center',
  margin: verticalScale(-1.5),
};

export default StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: verticalScale(300),
    maxHeight: verticalScale(300),
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    margin: 0,
  },
  backspaceTouch: {
    alignItems: 'center',
    borderRadius: verticalScale(8),
    height: verticalScale(50),
    justifyContent: 'center',
    width: verticalScale(60),
  },
  buttonWrapper: {
    flex: 1,
    justifyContent: 'center',
    margin: verticalScale(5),
  },
  block: {
    ...block,
    backgroundColor: '#fff',
  },
  centerBlock: {
    ...block,
    backgroundColor: '#aaa',
  },
  centerBlockSelected: {
    ...block,
    backgroundColor: '#aa6',
  },
  entryContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    height: verticalScale(50),
    justifyContent: 'flex-start',
    marginHorizontal: verticalScale(10),
  },
  entryWrapper: {
    borderBottomWidth: verticalScale(1),
    borderBottomColor: '#444',
    flex: 1,
    height: verticalScale(30),
    marginLeft: verticalScale(20),
  },
  entryText: {
    fontFamily: 'RujisHandwritingFontv.2.0',
    color: '#000',
    fontSize: verticalScale(20),
  },
  gridBackground: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
    width: null,
    height: null,
    paddingBottom: verticalScale(7),
    paddingLeft: verticalScale(15),
    paddingRight: verticalScale(15),
    paddingTop: verticalScale(20),
  },
  gridSelect: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
    width: null,
    height: null,
    margin: verticalScale(1),
  },
  gridWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    zIndex: 100,
    marginBottom: verticalScale(-10),
    top: 0,
    width: '100%',
    maxWidth: verticalScale(315),
  },
  letter: {
    color: '#000',
    fontFamily: 'OFLGoudyStM',
    fontSize: verticalScale(60),
    marginTop: verticalScale(11),
  },
});
