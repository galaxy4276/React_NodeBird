const initialState = {
  user: {
    isLoggedIn: false,
    user: null,
    signUpData: {},
    loginData: {},
  },
  post: {
    mainPost: [],
  },
};


// Async action craetor


// Action Creator
export const changeNickname = (data) => {
  return {
    type: 'CHANGE_NICKNAME',
    data,
  };
};

export const loginAction = (data) => {
  return {
    type: 'LOG_IN',
    data
  };
};

export const logoutAction = () => {
  return {
    type: 'LOG_OUT',
  };
};


// (prevState, action) => nextAction 
const rootReducer = (state = initialState, action) => {
  console.table(state);

  switch (action.type) {
    case 'CHANGE_NICKNAME':
      return {
        ...state,
        name: action.data,
      }; // 새로운 객체를 생성해 히스토리를 만들어 준다.
    case 'LOG_IN':
      return {
        ...state,
        user: {
          ...state.user,
          isLoggedIn: true,
          user: action.data,
        },
      };
    case 'LOG_OUT':
      return {
        ...state,
        user: {
          ...state.user,
          isLoggedIn: false,
          user: null,
        },
      };
    default:
      return state;
    }
};


export default rootReducer;