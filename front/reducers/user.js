import { createAction, handleActions } from 'redux-actions';


export const initialState = {
  logInLoading: false, // 로그인 시도 중
  logInDone: false,
  logInError: null,
  logOutLoading: false, // 로그아웃 시도 중
  logOutDone: false,
  logOutError: false,
  signUpLoading: false, // 회원가입 시도 중
  signUpDone: false,
  signUpFailure: false,
  me: null,
  signUpData: {},
  loginData: {},
};

export const LOG_IN_REQUEST = 'LOG_IN_REQUEST';
export const LOG_IN_SUCCESS = 'LOG_IN_SUCCESS';
export const LOG_IN_FAILURE = 'LOG_IN_FAILURE';

export const LOG_OUT_REQUEST = 'LOG_OUT_REQUEST';
export const LOG_OUT_SUCCESS = 'LOG_OUT_SUCCESS';
export const LOG_OUT_FAILURE = 'LOG_OUT_FAILURE';

export const SIGN_UP_REQUEST = 'SIGN_UP_REQEUST';
export const SIGN_UP_SUCCESS = 'SIGN_UP_SUCCESS';
export const SIGN_UP_FAILURE = 'SIGN_UP_FAILURE';

export const FOLLOW_REQUEST = 'FOLLOW_REQUEST';
export const FOLLOW_SUCCESS = 'FOLLOW_SUCCESS';
export const FOLLOW_FAILURE = 'FOLLOW_FAILURE';

export const UNFOLLOW_REQUEST = 'UNFOLLOW_REQUEST';
export const UNFOLLOW_SUCCESS = 'UNFOLLOW_SUCCESS';
export const UNFOLLOW_FAILURE = 'UNFOLLOW_FAILURE';


export const loginRequestAction = createAction(LOG_IN_REQUEST, data => data);
export const logoutRequestAction = createAction(LOG_OUT_REQUEST);


const dummyUser = (payload) => ({
  ...payload,
  unique: 1,
  Posts: [],
  Followings: [],
  Followers: [],
});


const reducer = handleActions(
  {
    [LOG_IN_REQUEST]: (state) => {
      console.log('reducer logIn');
      return { 
        ...state,
        logInLoading: true,
        logInError: null,
        logInDone: false, 
      };
    },
    [LOG_IN_SUCCESS]: (state, { payload }) => {
      console.log(`${LOG_IN_SUCCESS}`);
      const me = dummyUser(payload);

      return {
      ...state,
      logInLoading: false,
      logInDone: true,
      me// { ...me, nickname: zerocho }
      }
    },
    [LOG_IN_FAILURE]: (state, payload) => ({
      ...state,
      logInLoading: false,
      logInError: payload.error,
    }),
    [LOG_OUT_REQUEST]: (state) => ({
      ...state,
      logOutLoading: true,
      logOutDone: false,
      logOutFailure: null,
    }),
    [LOG_OUT_SUCCESS]: (state) => ({
      ...state,
      logOutLoading: false,
      logOutDone: true,
      me: null,
    }),
    [LOG_OUT_FAILURE]: (state, { payload }) => ({
      ...state,
      logOutLoading: false,
      logOutError: payload.error || 'critical',
    }),
    [SIGN_UP_REQUEST]: (state) => ({
      ...state,
      logOutLoading: true,
      logOutDone: false,
      logOutFailure: null,
    }),
    [SIGN_UP_SUCCESS]: (state) => ({
      ...state,
      logOutLoading: false,
      logOutDone: true,
      me: null,
    }),
    [SIGN_UP_FAILURE]: (state, { payload }) => ({
      ...state,
      logOutLoading: false,
      logOutError: payload.error || 'critical',
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
//         logInLoading: true,
//       };
//     case 'LOG_IN_SUCCESS':
//       return {
//         ...state,
//         logInLoading: false,
//         logInDone: true,
//         me: action.data,
//       };
//     case 'LOG_IN_FAILURE':
//       return {
//         ...state,
//         logInLoading: false,
//         logInDone: false,
//       };
//     case 'LOG_OUT_REQUEST':
//       return {
//         ...state,
//         logInDone: false,
//         me: null,
//       };
//     case 'LOG_OUT_SUCCESS':
//       return {
//         ...state,
//         logInDone: false,
//         me: null,
//       };
//     case 'LOG_OUT_FAILURE':
//       return {
//         ...state,
//         logInDone: false,
//         me: null,
//       };
//     default:
//       return state;
//   }
// };