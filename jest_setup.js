import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { JSDOM } from 'jsdom';

jest.mock('react-native', () => {
  // eslint-disable-next-line global-require
  const ReactNative = require('react-native-mock-render');
  ReactNative.Vibration = { vibrate: jest.fn() };
  return ReactNative;
}, { virtual: true });

Enzyme.configure({ adapter: new Adapter() });
jest.useFakeTimers();

global.document = new JSDOM('');
global.window = global.document.defaultView;

// Suppress warnings about View from the non-native React parsers in jsdom
const jsdomWarning1 = new RegExp(/Warning:.*Always use lowercase HTML tags in React\./);
const jsdomWarning2 = new RegExp(/Warning:.*If you meant to render a React component, start its name with an uppercase letter./);
const jsdomWarning3 = new RegExp(/Warning: React does not recognize the `.*` prop on a DOM element./);
const jsdomWarning4 = new RegExp(/Warning: Received `.*` for a non-boolean attribute `accessible`./);
const jsdomWarning5 = new RegExp(/Warning: Unknown event handler property `.*`. It will be ignored./);
console.error = (...args) => { // eslint-disable-line no-console
  if (
    args[0].match(jsdomWarning1) ||
    args[0].match(jsdomWarning2) ||
    args[0].match(jsdomWarning3) ||
    args[0].match(jsdomWarning4) ||
    args[0].match(jsdomWarning5)
  ) {
    return null;
  }
  throw new Error(...args);
};
