import { useState, useCallback } from 'react';


export default (initialValue = null) => {
  const [value, setValue] = useState(initialValue);

  const handler = useCallback((e) => {
    setValue(e.target.value);
  }, []);

  return [value, handler];
}


// Custom Hooks 는 범용적으로 사용할 수 있게 커스터마이징이 필요하다.