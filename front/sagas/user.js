import { all, fork, takeLatest, delay, put } from "redux-saga/effects";
import { LOG_IN_REQUEST, LOG_IN_SUCCESS, LOG_IN_FAILURE,
    LOG_OUT_FAILURE, LOG_OUT_REQUEST, LOG_OUT_SUCCESS } from '../reducers/user';

function* logIn(action) {
  console.log('saga logIn');
  try {
    yield delay(1000);
    yield put({
      type: LOG_IN_SUCCESS,
      payload: action.payload
    });
  } catch (err) {
    yield put({
      type: LOG_IN_FAILURE,
    });
  }
}

function* logOut() {
  try {
    yield delay(1000);
    yield put({
      type: LOG_OUT_SUCCESS,
    });
  } catch (err) {
    yield put({
      type: LOG_OUT_FAILURE,
    });
  }
}

function* watchLogIn() {
  yield takeLatest(LOG_IN_REQUEST, logIn); // Event Listener 역할
}

function* watchLogOut() {
  yield takeLatest(LOG_OUT_REQUEST, logOut);
}


export default function* userSaga() {
  yield all([
    fork(watchLogIn),
    fork(watchLogOut),
  ])
}

console.log('user.js on sagas');