import { createAction, handleActions } from 'redux-actions';
import shortid from 'shortid';
import produce from 'immer';
import faker from 'faker';


export const initialState = {
  mainPosts: [{
    id: 'first',
    User: {
      id: 1,
      nickname: '불로초',
    },
    content: '첫 번째 게시글 #해시태그 #익스프레스',
    Images: [{
      id: shortid.generate(),
      src: 'https://images.unsplash.com/photo-1593642634443-44adaa06623a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1225&q=80'
    }, {
      id: shortid.generate(),
      src: 'https://images.unsplash.com/photo-1601403325497-a2248bae962a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80'
    }, {
      id: shortid.generate(),
      src: 'https://images.unsplash.com/photo-1593642634402-b0eb5e2eebc9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80'
    }],
    Comments: [
      {
        id: shortid.generate(),
        User: {
          id: shortid.generate(),
          nickname: 'minesp'
        },
        content: '우와 개정판이 나왔군요~',
      }, 
      {
        id: shortid.generate(),
        User: {
          id: shortid.generate(),
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
  removePostLoading: false, // post sucessful is true
  removePostDone: false,
  removePostError: null,
  addCommentLoading: false,
  addCommentDone: false,
  addCommentError: null,
};


const randomImage = () => {
  const arr = [];
  const nand = Math.random() * 5;
  for (let i = 0; i < nand; i++) {
    arr.push({ src: faker.image.image() });
  }

  return arr;
};

initialState.mainPosts = initialState.mainPosts.concat(
  Array(20).fill().map(() => ({
    id: shortid.generate(),
    User: {
      id: shortid.generate(),
      nickname: faker.name.findName(),
    },
    content: faker.lorem.paragraph(),
    Images: randomImage(),
    Comments: [{
      User: {
        id: shortid.generate(),
        nickname: faker.name.findName(),
      },
      content: faker.lorem.sentence(),
    }],
  }))
);


const dummyPost = (data) => {
  console.log('dummyPost data');
  console.table(data);
  return {  
    id: data.id,
    content: data.content,
    User: {
      id: 1,
      nickname: '최은기',
    },
    Images: [],
    Comments: [],
  };
};

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
        draft.addPostLoading = false;
        draft.addPostDone = true;
        draft.mainPosts.unshift(dummyPost(data));
    }),
    [ADD_POST_FAILURE]: (state, { data }) => 
      produce(state, draft => {
        draft.addPostLoading = false;
        draft.addPostError = data.error;
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
        const post = draft.mainPosts.find((v) => v.id === data.postId);
        post.Comments.unshift(dummyComment(data.content));
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
        