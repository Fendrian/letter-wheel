import { AppRegistry } from 'react-native';
import targetWords from '../Entry';
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
  it('registers targetWords', () => {
    const register = AppRegistry.registerComponent;
    expect(register).toHaveBeenCalledTimes(1);
    expect(register).toHaveBeenCalledWith(
      'targetwords',
      expect.any(Function),
    );
    expect(register.mock.calls[0][1]()).toEqual(targetWords);
  });
});
