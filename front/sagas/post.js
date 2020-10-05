import { all, delay, put, takeLatest, fork } from "redux-saga/effects";
import shortid from "shortid";
import { 
  ADD_POST_FAILURE, ADD_POST_SUCCESS, ADD_POST_REQUEST,
  ADD_COMMENT_REQUEST, ADD_COMMENT_SUCCESS, ADD_COMMENT_FAILURE,
  ADD_POST_TO_ME, REMOVE_POST_OF_ME,
  REMOVE_POST_REQUEST, REMOVE_POST_SUCCESS, REMOVE_POST_FAILURE,
} from '../reducers/post';


// TODO: error: ADD_POST_REQUEST를 한 번에 2번 처리함.

function* addPost(action) {
  try {
    console.log('saga addPost');
    console.log(action.payload);
    yield delay(1000);
    const id = shortid.generate();
    yield put({
      type: ADD_POST_SUCCESS,
      data: {
      //action.payload,
      id,
      content: action.payload
      }
    });
    yield put({
      type: ADD_POST_TO_ME,
      data: id
    });
  } catch (err) {
    yield put({
      type: ADD_POST_FAILURE,
      data: 'error',
    });
  }
}

function removePostAPI(data) {
  return axios.delete('/api/post', data);
}

function* removePost(action) {
  try {
    console.log('removePost saga');
    console.table(action);
    yield delay(1000);
    yield put({
      type: REMOVE_POST_SUCCESS,
      data: action.data
    });
    yield put({
      type: REMOVE_POST_OF_ME,
      data: action.data
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: REMOVE_POST_FAILURE,
      data: err
    });
  };
}

function* addComment(action) {

  console.log(action);
  try {
    yield delay(2000);
    yield put({
      type: ADD_COMMENT_SUCCESS,
      data: action.payload,
    });
  } catch (err) {
    yield put({
      type: ADD_COMMENT_FAILURE,
      data: err.response.data,
    });
  }
}


function* watchAddPost() {
  yield takeLatest(ADD_POST_REQUEST, addPost);
}

function* watchRemovePost() {
  yield takeLatest(REMOVE_POST_REQUEST, removePost);
}

function* watchAddComment() {
  yield takeLatest(ADD_COMMENT_REQUEST, addComment);
}


export default function* postSaga() {
  yield all([
    fork(watchAddPost),
    fork(watchRemovePost),
    fork(watchAddComment),
  ]);
}