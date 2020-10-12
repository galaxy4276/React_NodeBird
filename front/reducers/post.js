import { createAction, handleActions } from 'redux-actions';
import shortid from 'shortid';
import produce from 'immer';
import faker from 'faker';


export const initialState = {
  mainPosts: [],
  imagePaths: [], // Save image path
  hasMorePost: true,
  addPostLoading: false, // post sucessful is true
  addPostDone: false,
  addPostError: null,
  loadPostLoading: false, 
  loadPostDone: false,
  loadPostError: null,
  removePostLoading: false, // post sucessful is true
  removePostDone: false,
  removePostError: null,
  addCommentLoading: false,
  addCommentDone: false,
  addCommentError: null,
};


export const genereateDummyPost = number => Array(number).fill().map(() => ({
  id: shortid.generate(),
  User: {
    id: shortid.generate(),
    nickname: faker.name.findName(),
  },
  content: faker.lorem.paragraph(),
  Images: (() => {
    const arr = [];
    const nand = Math.random() * 5;
    for (let i = 0; i < nand; i++) {
      arr.push({ src: faker.image.image() });
    }
    return arr;
  })(),
  Comments: [{
    User: {
      id: shortid.generate(),
      nickname: faker.name.findName(),
    },
    content: faker.lorem.sentence(),
  }],
}));


// const dummyPost = (data) => {
//   console.log('dummyPost data');
//   console.table(data);
//   return {  
//     id: data.id,
//     content: data.content,
//     User: {
//       id: 1,
//       nickname: '최은기',
//     },
//     Images: [],
//     Comments: [],
//   };
// };

const dummyComment = (data) => ({
  id: shortid.generate(),
  content: data,
  User: {
    id: 1,
    nickname: '최은기',
  },
});


export const ADD_POST_REQUEST = 'ADD_POST_REQUEST';
export const ADD_POST_SUCCESS = 'ADD_POST_SUCCESS';
export const ADD_POST_FAILURE = 'ADD_POST_FAILURE';

export const LOAD_POST_REQUEST = 'LOAD_POST_REQUEST';
export const LOAD_POST_SUCCESS = 'LOAD_POST_SUCCESS';
export const LOAD_POST_FAILURE = 'LOAD_POST_FAILURE';

export const REMOVE_POST_REQUEST = 'REMOVE_POST_REQUEST';
export const REMOVE_POST_SUCCESS = 'REMOVE_POST_SUCCESS';
export const REMOVE_POST_FAILURE = 'REMOVE_POST_FAILURE';

export const ADD_POST_TO_ME = 'ADD_POST_TO_ME';
export const REMOVE_POST_OF_ME = 'REMOVE_POST_OF_ME';

export const ADD_COMMENT_REQUEST = 'ADD_COMMENT';
export const ADD_COMMENT_SUCCESS = 'ADD_COMMENT_SUCCESS';
export const ADD_COMMENT_FAILURE = 'ADD_COMMENT_FAILURE';


export const addPostRequest = createAction(ADD_POST_REQUEST, data => data);
export const addCommentRequest = createAction(ADD_COMMENT_REQUEST, data => data);


const reducer = handleActions(
  {
    [ADD_POST_REQUEST]: (state) =>
      produce(state, draft => {
        draft.addPostLoading = true;
        draft.addPostDone = false;
        draft.addPostError = null;
    }),
    [ADD_POST_SUCCESS]: (state, { data }) => 
      produce(state, draft => {
        console.table(data);
        draft.addPostLoading = false;
        draft.addPostDone = true;
        draft.mainPosts.unshift(data);
    }),
    [ADD_POST_FAILURE]: (state, { data }) => 
      produce(state, draft => {
        draft.addPostLoading = false;
        draft.addPostError = data.error;
    }),
    [LOAD_POST_REQUEST]: (state) =>
      produce(state, draft => {
        draft.loadPostDone = false;
        draft.loadPostLoading = true;
        draft.loadPostError = null;
    }),
    [LOAD_POST_SUCCESS]: (state, { data }) => 
      produce(state, draft => {
        draft.loadPostDone = true;
        draft.loadPostLoading = false;
        draft.mainPosts = draft.mainPosts.concat(data); //data.concat(draft.mainPosts);
        draft.hasMorePost = draft.mainPosts.length < 50; // 게시글을 50개만 보겠다.
    }),
    [LOAD_POST_FAILURE]: (state, { data }) => 
      produce(state, draft => {
        draft.loadPostLoading = false;
        draft.loadPostError = data.error;
    }),
    [REMOVE_POST_REQUEST]: (state) => 
      produce(state, draft => {
        draft.removePostLoading = true;
        draft.removePostDone = false;
        draft.removePostError = null;
    }),
    [REMOVE_POST_SUCCESS]: (state, { data }) => 
      produce(state, draft => {
        draft.mainPosts = draft.mainPosts.filter(v => v.id !== data );
        draft.removePostLoading = false;
        draft.removePostDone = true;
    }),
    [REMOVE_POST_FAILURE]: (state, { data }) => 
      produce(state, draft => {
        draft.removePostLoading = false;
        draft.removePostError = data.error;
    }),
    [ADD_COMMENT_REQUEST]: (state) => 
      produce(state, draft => {
        draft.addCommentLoading = true;
        draft.addCommentDone = false;
        draft.addCommentError = null;
    }),
    [ADD_COMMENT_SUCCESS]: (state, { data }) => 
      produce(state, draft => {
        const post = draft.mainPosts.find((v) => v.id === data.PostId);
        post.Comments.unshift(data.content);
        draft.addCommentLoading = false,
        draft.addCommentDone = true
    }),
    [ADD_COMMENT_FAILURE]: (state, { data }) => 
      produce(state, draft => {
        draft.addCommentLoading = false;
        draft.addCommentError = data.error;
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
        /* data 
        content: 댓글 내용
        postId: 해당 게시글 아이디
        userId: 댓글을 쓴 유저 아이디
        {
          return {
            const postIndex = state.mainPosts.findIndex((v) => v.id === data.postId);
            const post = { ...state.mainPosts[postIndex] };
            post.Comments = [, ...post.Comments];
            const mainPosts = [...state.mainPosts];
            mainPosts[postIndex] = post;
            */
        //     ...state,
        //     mainPosts,
        //     addCommentLoading: false,
        //     addCommentDone: true
        //   };
        // },