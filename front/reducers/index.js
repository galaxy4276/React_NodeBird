import { HYDRATE } from 'next-redux-wrapper';
import { combineReducers } from 'redux';

import user from './user';
import post from './post';


// (prevState, action) => nextAction 
const rootReducer = combineReducers({
  index: (state = {}, action) => { // Reducer for HYDRATE
    switch (action.type) {
      case HYDRATE: // SSR
        console.log('HYDRATE', action);
        return { ...state, ...action.payload };
      default:
        return state;
    }
  },
  user,
  post,
});


export default rootReducer;