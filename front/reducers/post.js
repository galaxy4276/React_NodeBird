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
  postAdded: false // post sucessful is true
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


const ADD_POST = 'ADD_POST';


export const addPost = {
  type: ADD_POST,
}


const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_POST:
      return {
        ...state,
        mainPosts: [dummyPost, ...state.mainPosts]  
      };
    default:
      return state;
  }
};


export default reducer;