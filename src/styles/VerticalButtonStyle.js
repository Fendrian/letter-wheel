import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    width: undefined,
    height: undefined,
  },
  contentWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 15,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 15,
  },
  text: {
    fontFamily: 'Grundschrift-Bold',
    color: '#000000',
    fontSize: 20,
  },
});
