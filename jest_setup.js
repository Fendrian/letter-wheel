import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { JSDOM } from 'jsdom';

Enzyme.configure({ adapter: new Adapter() });

global.document = new JSDOM('');
global.window = global.document.defaultView;
Object.keys(global.document.defaultView).forEach((property) => {
  if (typeof global[property] === 'undefined') {
    global[property] = global.document.defaultView[property];
  }
});

// Suppress warnings about View from the non-native React parsers in jsdom
const { error } = console;
console.error = (...args) => { // eslint-disable-line no-console
  if (
    args[0].substring(0, 42) === 'Warning: <View /> is using uppercase HTML.' ||
    args[0].substring(0, 56) === 'Warning: The tag <View> is unrecognized in this browser.' ||
    args[0].substring(0, 42) === 'Warning: <Text /> is using uppercase HTML.' ||
    args[0].substring(0, 56) === 'Warning: The tag <Text> is unrecognized in this browser.'
  ) {
    return null;
  }
  return error(...args);
};
