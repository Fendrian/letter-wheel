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
    marginRight: -4,
  },
  textWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 2,
    paddingLeft: 12,
    paddingRight: 12,
    paddingTop: 8,
  },
  text: {
    fontFamily: 'Grundschrift-Bold',
    color: '#000000',
    fontSize: 20,
    marginBottom: 15,
  },
});
