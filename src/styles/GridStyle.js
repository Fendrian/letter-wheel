import { StyleSheet } from 'react-native';

const block = {
  alignItems: 'center',
  borderColor: '#000000',
  borderWidth: 2,
  flex: (1 / 3),
  justifyContent: 'center',
  margin: 0,
};

export default StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 300,
    maxHeight: 300,
  },
  row: {
    flex: (1 / 3),
    flexDirection: 'row',
    margin: 0,
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
    fontFamily: 'RujisHandwritingFontv.2.0',
    color: '#000',
    fontSize: 20,
  },
  gridBackground: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
    width: null,
    height: null,
    paddingBottom: 2,
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 5,
  },
  gridSelect: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
    width: null,
    height: null,
  },
  gridWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    zIndex: 100,
    marginBottom: -10,
    top: 0,
    width: '100%',
    maxWidth: 315,
  },
  letter: {
    color: '#000',
    fontFamily: 'OFLGoudyStM',
    fontSize: 60,
    marginTop: 11,
  },
});
