import { all, delay, put, takeEvery, fork } from "redux-saga/effects";



function* addPost() {
  try {
    yield delay(1000);
    yield put({
      type: 'LOG_OUT_SUCCESS',
    });
  } catch (err) {
    yield put({
      type: 'LOG_OUT_FAILURE',
      data: err.response.data
    });
  }
}


function* watchAddPost() {
    yield takeEvery('ADD_POST_REQUEST', addPost);
}


export default function* postSaga() {
  yield all([
    fork(watchAddPost),
  ]);
}