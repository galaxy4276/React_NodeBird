import { createAction, handleActions } from 'redux-actions';

export const initialState = {
  mainPosts: [{
    id: 1,
    User: {
      id: 1,
      nickname: '불로초',
    },
    content: '첫 번째 게시글 #해시태그 #익스프레스',
    Images: [{
      src: 'https://images.unsplash.com/photo-1593642634443-44adaa06623a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1225&q=80'
    }, {
      src: 'https://images.unsplash.com/photo-1601403325497-a2248bae962a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80'
    }, {
      src: 'https://images.unsplash.com/photo-1593642634402-b0eb5e2eebc9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80'
    }],
    Comments: [
      {
        User: {
          nickname: 'minesp'
        },
        content: '우와 개정판이 나왔군요~',
      }, 
      {
        User: {
          nickname: 'rim',
        },
        content: '얼른 사고싶어요.',
      }
    ], 
  }],
  imagePaths: [], // Save image path
  addPostLoading: false, // post sucessful is true
  addPostDone: false,
  addPostError: null,
  addCommentLoading: false,
  addCommentDone: false,
  addCommentError: null,
};

const dummyPost = {
  id: 2,
  content: '더미데이터입니다.',
  User: {
    id: 1,
    nickname: '불로초',
  },
  Images: [],
  Comments: [],
};


export const ADD_POST_REQUEST = 'ADD_POST';
export const ADD_POST_SUCCESS = 'ADD_POST_SUCCESS';
export const ADD_POST_FAILURE = 'ADD_POST_FAILURE';

export const ADD_COMMENT_REQUEST = 'ADD_COMMENT';
export const ADD_COMMENT_SUCCESS = 'ADD_COMMENT_SUCCESS';
export const ADD_COMMENT_FAILURE = 'ADD_COMMENT_FAILURE';


export const addPostRequest = createAction(ADD_POST_REQUEST, data => data);
export const addCommentRequest = createAction(ADD_COMMENT_REQUEST, data => data);


const reducer = handleActions(
  {
    [ADD_POST_REQUEST]: (state) => ({
      ...state,
      addPostLoading: true,
      addPostDone: false,
      addPostError: null,
    }),
    [ADD_POST_SUCCESS]: (state) => ({
      ...state,
      mainPosts: [dummyPost, ...state.mainPosts],
      addPostLoading: false,
      addPostDone: true
    }),
    [ADD_POST_FAILURE]: (state, { payload }) => ({
      ...state,
      addPostError: payload.error,
    }),
    [ADD_COMMENT_REQUEST]: (state) => ({
      ...state,
      addCommentLoading: true,
      addCommentDone: false,
      addCommentError: null,
    }),
    [ADD_COMMENT_SUCCESS]: (state) => ({
      ...state,
      addCommentLoading: false,
      addCommentDone: true
    }),
    [ADD_COMMENT_FAILURE]: (state, { payload }) => ({
      ...state,
      addCommentError: payload.error,
    }),
  },
  initialState,
  );
  
  
  export default reducer;
    // const reducer = (state = initialState, action) => {
    //   switch (action.type) {
    //     case ADD_POST_REQUEST:
    //       return {
    //         ...state,
    //         mainPosts: [dummyPost, ...state.mainPosts]  
    //       };
    //     default:
    //       return state;
    //   }
    // };