import { createAction, handleActions } from 'redux-actions';
import shortid from 'shortid';
import produce from 'immer';
import faker from 'faker';


export const initialState = {
  mainPosts: [],
  imagePaths: [], // Save image path
  singlePost: null, // 하나만 불러오니까 null
  hasMorePost: true,
  addPostLoading: false, // post sucessful is true
  addPostDone: false,
  addPostError: null,
  uploadImageLoading: false, 
  uploadImageDone: false,
  uploadImageError: null,
  loadPostLoading: false, 
  loadPostDone: false,
  loadPostError: null,
  loadOnePostLoading: false, 
  loadOnePostDone: false,
  loadOnePostError: null,
  removePostLoading: false, // post sucessful is true
  removePostDone: false,
  removePostError: null,
  addCommentLoading: false,
  addCommentDone: false,
  addCommentError: null,
  likePostLoading: false, 
  likePostDone: false,
  likePostError: null,
  unLikePostLoading: false, 
  unLikePostDone: false,
  unLikePostError: null,
  retweetLoading: false, 
  retweetDone: false,
  retweetError: null,
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

export const ADD_POST_REQUEST = 'ADD_POST_REQUEST';
export const ADD_POST_SUCCESS = 'ADD_POST_SUCCESS';
export const ADD_POST_FAILURE = 'ADD_POST_FAILURE';

export const RETWEET_REQUEST = 'RETWEET_REQUEST';
export const RETWEET_SUCCESS = 'RETWEET_SUCCESS';
export const RETWEET_FAILURE = 'RETWEET_FAILURE';

export const UPLOAD_IMAGES_REQUEST = 'UPLOAD_IMAGES_REQUEST';
export const UPLOAD_IMAGES_SUCCESS = 'UPLOAD_IMAGES_SUCCESS';
export const UPLOAD_IMAGES_FAILURE = 'UPLOAD_IMAGES_FAILURE';

export const REMOVE_IMAGE = 'REMOVE_IMAGE';

export const LOAD_POST_REQUEST = 'LOAD_POST_REQUEST';
export const LOAD_POST_SUCCESS = 'LOAD_POST_SUCCESS';
export const LOAD_POST_FAILURE = 'LOAD_POST_FAILURE';

export const LOAD_ONE_POST_REQUEST = 'LOAD_ONE_POST_REQUEST';
export const LOAD_ONE_POST_SUCCESS = 'LOAD_ONE_POST_SUCCESS';
export const LOAD_ONE_POST_FAILURE = 'LOAD_ONE_POST_FAILURE';

export const REMOVE_POST_REQUEST = 'REMOVE_POST_REQUEST';
export const REMOVE_POST_SUCCESS = 'REMOVE_POST_SUCCESS';
export const REMOVE_POST_FAILURE = 'REMOVE_POST_FAILURE';

export const ADD_POST_TO_ME = 'ADD_POST_TO_ME';
export const REMOVE_POST_OF_ME = 'REMOVE_POST_OF_ME';

export const ADD_COMMENT_REQUEST = 'ADD_COMMENT';
export const ADD_COMMENT_SUCCESS = 'ADD_COMMENT_SUCCESS';
export const ADD_COMMENT_FAILURE = 'ADD_COMMENT_FAILURE';

export const LIKE_POST_REQUEST = 'LIKE_POST_REQUEST';
export const LIKE_POST_SUCCESS = 'LIKE_POST_SUCCESS';
export const LIKE_POST_FAILURE = 'LIKE_POST_FAILURE';

export const UNLIKE_POST_REQUEST = 'UNLIKE_POST_REQUEST';
export const UNLIKE_POST_SUCCESS = 'UNLIKE_POST_SUCCESS';
export const UNLIKE_POST_FAILURE = 'UNLIKE_POST_FAILURE';

export const addPostRequest = createAction(ADD_POST_REQUEST, data => data);
export const addCommentRequest = createAction(ADD_COMMENT_REQUEST, data => data);


const reducer = handleActions(
  {
    [REMOVE_IMAGE]: (state, { data }) =>  // 프론트 측에서만 제거
      produce(state, draft => {
        draft.imagePaths = draft.imagePaths.filter((v, i) => i !== data);
    }),
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
        draft.imagePaths = [];
    }),
    [ADD_POST_FAILURE]: (state, { data }) => 
      produce(state, draft => {
        draft.addPostLoading = false;
        draft.addPostError = data.error;
    }),
    [LOAD_POST_REQUEST]: (state) =>
      produce(state, draft => {
        console.log('[REDUX:]LOAD_POST_REQUEST');
        draft.loadPostDone = false;
        draft.loadPostLoading = true;
        draft.loadPostError = null;
    }),
    [LOAD_POST_SUCCESS]: (state, { data }) => 
      produce(state, draft => {
        draft.loadPostDone = true;
        draft.loadPostLoading = false;
        draft.mainPosts = draft.mainPosts.concat(data); //data.concat(draft.mainPosts);
        draft.hasMorePost = draft.mainPosts.length === 10;
    }),
    [LOAD_POST_FAILURE]: (state, { data }) => 
      produce(state, draft => {
        draft.loadPostLoading = false;
        draft.loadPostError = data.error;
    }),
    [LOAD_ONE_POST_REQUEST]: (state) =>
      produce(state, draft => {
        console.log('[REDUX:]LOAD_ONE_POST_REQUEST');
        draft.loadOnePostDone = false;
        draft.loadOnePostLoading = true;
        draft.loadOnePostError = null;
    }),
    [LOAD_ONE_POST_SUCCESS]: (state, { data }) => 
      produce(state, draft => {
        draft.loadOnePostDone = true;
        draft.loadOnePostLoading = false;
        draft.singlePost = data; //data.concat(draft.mainPosts);
    }),
    [LOAD_ONE_POST_FAILURE]: (state, { data }) => 
      produce(state, draft => {
        draft.loadOnePostLoading = false;
        draft.loadOnePostError = data;
    }),
    [UPLOAD_IMAGES_REQUEST]: (state) =>
      produce(state, draft => {
        draft.uploadImageDone = false;
        draft.uploadImageLoading = true;
        draft.uploadImageError = null;
    }),
    [UPLOAD_IMAGES_SUCCESS]: (state, { data }) => 
      produce(state, draft => {
        draft.imagePaths = data;
        draft.uploadImageDone = true;
        draft.uploadImageLoading = false;
    }),
    [UPLOAD_IMAGES_FAILURE]: (state, { data }) => 
      produce(state, draft => {
        draft.uploadImageLoading = false;
        draft.uploadImageError = data.error;
    }),
    [RETWEET_REQUEST]: (state) =>
      produce(state, draft => {
        draft.retweetDone = false;
        draft.retweetLoading = true;
        draft.retweetError = null;
    }),
    [RETWEET_SUCCESS]: (state, { data }) => 
      produce(state, draft => {
        draft.mainPosts.unshift(data);
        draft.retweetDone = true;
        draft.retweetLoading = false;
    }),
    [RETWEET_FAILURE]: (state, { data }) => 
      produce(state, draft => {
        draft.retweetLoading = false;
        draft.retweetError = data;
    }),
    [LIKE_POST_REQUEST]: (state) =>
      produce(state, draft => {
        draft.likePostDone = false;
        draft.likePostLoading = true;
        draft.likePostError = null;
    }),
    [LIKE_POST_SUCCESS]: (state, { data }) => 
      produce(state, draft => {
        const post = draft.mainPosts.find((v) => v.id === data.PostId);
        post.Likers.push({ id: data.UserId });
        draft.likePostDone = true;
        draft.likePostLoading = false;
    }),
    [LIKE_POST_FAILURE]: (state, { data }) => 
      produce(state, draft => {
        draft.likePostLoading = false;
        draft.likePostError = data.error;
    }),
    [UNLIKE_POST_REQUEST]: (state) =>
      produce(state, draft => {
        draft.unLikePostDone = false;
        draft.unLikePostLoading = true;
        draft.unLikePostError = null;
    }),
    [UNLIKE_POST_SUCCESS]: (state, { data }) => 
      produce(state, draft => {
        console.log('unlike data');
        console.log(data);
        const post = draft.mainPosts.find((v) => v.id === data.PostId);
        post.Likers = post.Likers.filter((v) => v.id !== data.UserId);
        draft.unLikePostDone = true;
        draft.unLikePostLoading = false;
    }),
    [UNLIKE_POST_FAILURE]: (state, { data }) => 
      produce(state, draft => {
        draft.unLikePostLoading = false;
        draft.unLikePostError = data.error;
    }),
    [REMOVE_POST_REQUEST]: (state) => 
      produce(state, draft => {
        draft.removePostLoading = true;
        draft.removePostDone = false;
        draft.removePostError = null;
    }),
    [REMOVE_POST_SUCCESS]: (state, { data }) => 
      produce(state, draft => {
        console.log('REMOVE_POST_SUCCESS');
        console.log(data);
        draft.removePostLoading = false;
        draft.removePostDone = true;
        draft.mainPosts = draft.mainPosts.filter(v => v.id !== data.PostId );
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
        console.log('redux addcommentSuccess data');
        console.log(data);
        console.log('draft.mainPosts');
        console.log(draft.mainPosts);
        console.log('data.PostId: ', data.id);
        const post = draft.mainPosts.find((v) => v.id === data.PostId);
        console.log('post');
        console.log(post);
        post.Comments.unshift(data);
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