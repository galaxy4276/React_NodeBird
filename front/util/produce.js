// IE9, 10 Com
import produce, { enableES5 } from 'immer';

export default (...args) => {
  enableES5();
  return produce(...args);
  // 기존 프로듀스 실행에 하나의 함수가 더 붙은 것 
}