import { createAction, handleActions } from 'redux-actions';

export const initialState = {
  isLoggedIn: false,
  isLoggingIn: false, // 로그인 시도 중,
  isLoggingOut: false, // 로그아웃 시도 중,
  me: null,
  signUpData: {},
  loginData: {},
};

export const LOG_IN_REQUEST = 'LOG_IN_REQUEST';
export const LOG_IN_SUCCESS = 'LOG_IN_SUCCESS';
export const LOG_IN_FAILURE = 'LOG_IN_FAILURE';
export const LOG_OUT_REQUEST = 'LOG_OU_REQUEST';
export const LOG_OUT_SUCCESS = 'LOG_OUT_SUCCESS';
export const LOG_OUT_FAILURE = 'LOG_OUT_FAILURE';


export const loginRequestAction = createAction(LOG_IN_REQUEST, data => data);
export const logoutRequestAction = createAction(LOG_OUT_REQUEST);


const reducer = handleActions(
  {
    [LOG_IN_REQUEST]: (state) => {
      console.log('reducer logIn');
      return { 
        ...state,
        isLoggingIn: true 
      };
      },
    [LOG_IN_SUCCESS]: (state, payload) => {
      console.log('payload');
      console.log(payload);

      return {
      ...state,
      isLoggingIn: false,
      isLoggedIn: true,
      me: payload // { ...me, nickname: zerocho }
      }
    },
    [LOG_IN_FAILURE]: (state) => ({
      ...state,
      isLoggingIn: false,
      isLoggedIn: false,
    }),
    [LOG_OUT_REQUEST]: (state) => ({
      ...state,
      isLoggingOut: true,
    }),
    [LOG_OUT_SUCCESS]: (state) => ({
      ...state,
      isLoggingOut: false,
      isLoggedIn: false,
      me: null,
    }),
    [LOG_OUT_FAILURE]: (state) => ({
      ...state,
      isLoggingOut: false,
    }),
  },
  initialState
);

export default reducer;

// const reducer = (state = initialState, action) => {
//   switch (action.type) {
//     case 'LOG_IN_REQUEST':
//       return {
//         ...state,
//         isLoggingIn: true,
//       };
//     case 'LOG_IN_SUCCESS':
//       return {
//         ...state,
//         isLoggingIn: false,
//         isLoggedIn: true,
//         me: action.data,
//       };
//     case 'LOG_IN_FAILURE':
//       return {
//         ...state,
//         isLoggingIn: false,
//         isLoggedIn: false,
//       };
//     case 'LOG_OUT_REQUEST':
//       return {
//         ...state,
//         isLoggedIn: false,
//         me: null,
//       };
//     case 'LOG_OUT_SUCCESS':
//       return {
//         ...state,
//         isLoggedIn: false,
//         me: null,
//       };
//     case 'LOG_OUT_FAILURE':
//       return {
//         ...state,
//         isLoggedIn: false,
//         me: null,
//       };
//     default:
//       return state;
//   }
// };