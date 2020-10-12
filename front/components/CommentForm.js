import React, { useCallback, useEffect } from 'react';
import { Button, Form, Input } from 'antd';
import useInput from '../hooks/useInput';
import PropTypes from 'prop-types';
import { addCommentRequest } from '../reducers/post';
import { useDispatch, useSelector } from 'react-redux';


const CommentForm = ({ post }) => {
  const [commentText, onChangeCommentText, setCommentText] = useInput('');

  const id = useSelector((state) => state.user.me?.id);
  const { addCommentDone, addCommentLoading } = useSelector((state) => state.post);

  const dispatch = useDispatch();

  useEffect(() => {
    if (addCommentDone) {
      setCommentText('');
    }
  }, [addCommentDone]);

  const onSubmitComment = useCallback(() => {
    console.log(post.id, commentText);
    dispatch(addCommentRequest({
      content: commentText,
      postId: post.id,
      userId: id,
    }));
  }, [commentText, id]);
  //  data: { content: commentText, postId: post.id, userId: id},
  
  return (
    <Form onFinish={onSubmitComment} >
      <Form.Item style={{ position: 'relative', margin: 0 }}> 
        <Input.TextArea value={commentText} onChange={onChangeCommentText} rows={4} />
        <Button 
        type="primary"
        htmlType="submit" 
        loading={addCommentLoading}
        style={{ 
          position: 'absolute',
          right: 0,
          bottom: -40,
          zIndex: 1
          }}>삐약</Button>
      </Form.Item>
    </Form>
  );
};

CommentForm.propTypes = {
  post: PropTypes.object.isRequired,
};


export default CommentForm;
