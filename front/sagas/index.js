import { all, fork } from 'redux-saga/effects';
import postSaga from './post';
import userSaga from './user';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3065';
axios.defaults.withCredentials = true;


export default function* rootSaga() {
  yield all([
    fork(postSaga),
    fork(userSaga),
  ]);
}

// put -> dispatch
// fork -> 비동기 함수 호출, 안기다림 논블로킹
// call -> 동기 함수 호출 , 기다림 블로킹
// take 이벤트를 감시. 근데 한번 밖에 실행을 안한다. ( while (true) 로 감싸서 해결 )
// takeEvery 로 해결이 가능하지만 비동기적으로 동작한다. while (true) take 는 동기적 동작
// takeLatest 마지막 건만 처리 동시 로딩만 처리한다.
// throttle n초 안에는 요청을 한 번만 보내도록 처리한다.