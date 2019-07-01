import { AppRegistry } from 'react-native';
import letterWheel from '../Entry';
import '../index';

jest.mock('react-native', () => (
  {
    AppRegistry: {
      registerComponent: jest.fn(),
    },
  }
));
jest.mock('../Entry', () => {});

describe('Main index', () => {
  it('registers letterWheel', () => {
    const register = AppRegistry.registerComponent;
    expect(register).toHaveBeenCalledTimes(1);
    expect(register).toHaveBeenCalledWith(
      'letter-wheel',
      expect.any(Function),
    );
    expect(register.mock.calls[0][1]()).toEqual(letterWheel);
  });
});
