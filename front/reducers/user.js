import { createAction, handleActions } from 'redux-actions';
import { ADD_POST_TO_ME, REMOVE_POST_OF_ME } from './post';
import produce from 'immer';


export const initialState = {
  logInLoading: false, // 로그인 시도 중
  logInDone: false,
  logInError: null,
  logOutLoading: false, // 로그아웃 시도 중
  logOutDone: false,
  logOutError: null,
  signUpLoading: false, // 회원가입 시도 중
  signUpDone: false,
  signUpError: null,
  followLoading: false, // 팔로우 시도 중
  followDone: false,
  followError: null,
  unFollowLoading: false, // 언팔로우 시도 중
  unFollowDone: false,
  unFollowError: null,
  changeNicknameLoading: false, // 닉네임 시도 중
  changeNicknameDone: false,
  changeNicknameError: null,
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

export const CHANGE_NICKNAME_REQUEST = 'SIGN_UP_REQEUST';
export const CHANGE_NICKNAME_SUCCESS = 'SIGN_UP_SUCCESS';
export const CHANGE_NICKNAME_FAILURE = 'SIGN_UP_FAILURE';

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
  id: 1,
  Posts: [{ id: 'first' }],
  Followings: [{ nickname: '이현동'}, { nickname: '이예림'}, { nickname: '심동진' }],
  Followers: [{ nickname: '이현동'}, { nickname: '이예림'}, { nickname: '심동진' }],
});


const reducer = handleActions(
  {
    [UNFOLLOW_REQUEST]: (state) => 
      produce(state, draft => {
        draft.unFollowLoading = true;
        draft.unFollowError = null;
        draft.unFollowDone = false; 
    }),
    [UNFOLLOW_SUCCESS]: (state, { data }) =>
      produce(state, draft => {
        draft.unFollowLoading = false;
        draft.unFollowDone = true;
        draft.me.Followings = draft.me.Followings.filter((v) => v.id !== data);
    }),
    [UNFOLLOW_FAILURE]: (state, payload) =>
      produce(state, draft => {
        draft.unFollowLoading = false;
        draft.unFollowError = payload.error;
    }),
    [FOLLOW_REQUEST]: (state) => 
      produce(state, draft => {
        draft.followLoading = true;
        draft.followError = null;
        draft.followDone = false; 
    }),
    [FOLLOW_SUCCESS]: (state, { data }) =>
      produce(state, draft => {
        draft.followLoading = false;
        draft.followDone = true;
        draft.me.Followings.push({ id: data });
    }),
    [FOLLOW_FAILURE]: (state, payload) =>
      produce(state, draft => {
        draft.followLoading = false;
        draft.followError = payload.error;
    }),
    [LOG_IN_REQUEST]: (state) => 
      produce(state, draft => {
        draft.logInLoading = true;
        draft.logInError = null;
        draft.logInDone = false; 
    }),
    [LOG_IN_SUCCESS]: (state, { payload }) =>
      produce(state, draft => {
        draft.logInLoading = false;
        draft.logInDone = true;
        draft.me = dummyUser(payload);
    }),
    [LOG_IN_FAILURE]: (state, payload) =>
      produce(state, draft => {
        draft.logInLoading = false;
        draft.logInError = payload.error;
    }),
    [LOG_OUT_REQUEST]: (state) => 
      produce(state, draft => {
        draft.logOutLoading = true;
        draft.logOutDone = false;
        draft.logOutError = null;
    }),
    [LOG_OUT_SUCCESS]: (state) => 
      produce(state, draft => {
        draft.logOutLoading = false;
        draft.logOutDone = true;
        draft.me = null;
    }),
    [LOG_OUT_FAILURE]: (state, { error }) => ({
      ...state,
      logOutLoading: false,
      logOutError: error || 'critical',
    }),
    [SIGN_UP_REQUEST]: (state) => 
      produce(state, draft => {
        draft.signUpLoading = true;
        draft.signUpDone = false;
        draft.signUpError = null;
    }),
    [SIGN_UP_SUCCESS]: (state) => 
      produce(state, draft => {
        draft.signUpLoading = false;
        draft.signUpDone = true;
    }),
    [SIGN_UP_FAILURE]: (state, { error }) => 
      produce(state, draft => {
        draft.signUpLoading = false;
        draft.signUpError = error;
    }),
    [CHANGE_NICKNAME_REQUEST]: (state) => 
      produce(state, draft => {
        draft.changeNicknameLoading = true;
        draft.changeNicknameDone = false;
        draft.changeNicknameError = null;
    }),
    [CHANGE_NICKNAME_SUCCESS]: (state) => 
      produce(state, draft => {
        draft.changeNicknameLoading = false;
        draft.changeNicknameDone = true;
    }),
    [CHANGE_NICKNAME_FAILURE]: (state, { error }) => 
      produce(state, draft => {
        draft.changeNicknameLoading = false;
        draft.changeNicknameError = error || 'critical';
    }),
    [ADD_POST_TO_ME]: (state, payload) => 
      produce(state, draft => {
        draft.me.Posts.unshift(payload.data);
      }),
    [REMOVE_POST_OF_ME]: (state, { data }) => 
      produce(state, draft => {
        draft.me.Posts = draft.me.Posts.filter(v => v.id !== data);
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