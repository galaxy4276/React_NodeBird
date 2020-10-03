import { all, call, delay, put, takeEvery } from 'redux-saga/effects';
// import axios from 'axios';

// function logInAPI() {
//   return axios.post('/api/login');
// }

function* logIn() {
  try {
    yield delay(1000);
    yield put({
      type: 'LOG_IN_SUCCESS',
    });
  } catch (err) {
    yield put({
      type: 'LOG_IN_FAILURE',
      data: err.response.data
    });
  }
}

function* logOut() {
  try {
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

function* addPost() {
  try {
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



function* watchLogIn() {
    yield takeEvery('LOG_IN_REQUEST', logIn);
}

function* watchLogOut() {
    yield takeEvery('LOG_OUT_REQUEST', logOut);
}

function* watchAddPost() {
    yield takeEvery('ADD_POST_REQUEST', addPost);
}

export default function* rootSaga() {
  yield all([
    call(watchLogIn),
    call(watchLogOut).
    call(watchAddPost),
  ]);
}

// put -> dispatch
// fork -> 비동기 함수 호출, 안기다림 논블로킹
// call -> 동기 함수 호출 , 기다림 블로킹
// take 이벤트를 감시. 근데 한번 밖에 실행을 안한다. ( while (true) 로 감싸서 해결 )
// takeEvery 로 해결이 가능하지만 비동기적으로 동작한다. while (true) take 는 동기적 동작
// takeLatest 마지막 건만 처리 동시 로딩만 처리한다.
// throttle n초 안에는 요청을 한 번만 보내도록 처리한다.