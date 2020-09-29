import { createWrapper } from 'next-redux-wrapper';
import { createStore } from 'redux';

// configureStore.js
const configureStore = () => {
  const store = createStore(reduecer);
  return store;
};


const wrapper = createWrapper(configureStore, {
  debug: process.env.NODE_ENV === 'development', // debug가 true면 redux detail이 증가 함.
});


export default wrapper;