import React, { useCallback, useRef, useEffect } from 'react';
import { Form, Input, Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { addPostRequest } from '../reducers/post';
import useInput from '../hooks/useInput';


const PostForm = () => {
  const [text, onChangeText, setText] = useInput('');
  const { imagePaths, addPostDone, addPostLoading } = useSelector((state) => state.post);

  const imageInput = useRef();

  const dispatch = useDispatch();

  const onClickImageUpload = useCallback(() => {
    imageInput.current.click();
  }, [imageInput.current]);

  useEffect(() => {
    if (addPostDone) {
      setText('');
    }
  }, [addPostDone]);

  const onSubmit = useCallback(() => {  
    dispatch(addPostRequest(text));
  }, [text]);

  return (
    <Form style={{ margin: '10px 0 20px' }} encType="multipart/form-data" onFinish={onSubmit}>
      <Input.TextArea 
        value={text}
        onChange={onChangeText}
        maxLength={140}
        placeholder="어떤 신기한 일이 있었나요?"
      />
      <div>
        <input type="file" multiple hidden ref={imageInput} />
        <Button onClick={onClickImageUpload}>이미지 업로드</Button>
        <Button 
          type="primary" 
          style={{ float: 'right' }} 
          htmlType="submit"
          loading={addPostLoading}
        >짹짹
        </Button>
      </div>
      <div>
        {imagePaths.map((v) => (
          <div key={v} style={{ display: 'inline-block' }}>
            <img src={v} style={{ width: '200px' }} alt={v} />
            <div>
              <Button>제거</Button>   
            </div>
          </div>
        ))}
      </div>
    </Form>
  );
};


export default PostForm;