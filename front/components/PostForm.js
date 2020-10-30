import React, { useCallback, useRef, useEffect } from 'react';
import { Form, Input, Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { UPLOAD_IMAGES_REQUEST, REMOVE_IMAGE, ADD_POST_REQUEST } from '../reducers/post';
import useInput from '../hooks/useInput';
import { backUrl } from '../config/config';


const PostForm = () => {
  const [text, onChangeText, setText] = useInput('');
  const { imagePaths, addPostDone, addPostLoading } = useSelector((state) => state.post);

  const imageInput = useRef();

  const dispatch = useDispatch();

  const onClickImageUpload = useCallback(() => {
    imageInput.current.click();
  }, [imageInput.current]);

  const onChangeImages = useCallback((e) => {
    console.log('images', e.target.files); // array 가아닌 유사 배열 형태
    const imageFormData = new FormData(); // multipart 형식
    [].forEach.call(e.target.files, (f) => { // 배열을 빌려쓰는 것
      imageFormData.append('image', f);
    });
    dispatch({
      type: UPLOAD_IMAGES_REQUEST,
      data: imageFormData,
    });
  });

  const onRemoveImage = useCallback((index) => () => {
    dispatch({
      type: REMOVE_IMAGE,
      data: index,
    });
  }, []);

  useEffect(() => {
    if (addPostDone) {
      setText('');
    }
  }, [addPostDone]);

  const onSubmit = useCallback(() => {  
    if (!text || !text.trim()) {
      return alert('게시글을 작성하세요!');
    }
    const formData = new FormData(); //for practice on multer.
    imagePaths.forEach((p) => { // 이미지와 콘텐트를 합침
      formData.append('image', p); // req.body.image
    });
    formData.append('content', text); // req.body.content
    return dispatch({
      type: ADD_POST_REQUEST,
      data: formData,
    });
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
        <input 
          type="file"
          name="image" 
          multiple hidden 
          ref={imageInput} 
          onChange={onChangeImages}
          />
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
        {imagePaths.map((v, i) => (
          <div key={v} style={{ display: 'inline-block' }}>
            <img src={`${backUrl}/${v}`} style={{ width: '200px' }} alt={v} />
            <div>
              <Button onClick={onRemoveImage(i)}>제거</Button>   
            </div>
          </div>
        ))}
      </div>
    </Form>
  );
};


export default PostForm;