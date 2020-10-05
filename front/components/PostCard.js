import React, { useCallback, useState } from 'react';
import { Card, Button, Popover, List, Comment, Avatar } from 'antd';
import { EllipsisOutlined, HeartOutlined, 
  MessageOutlined, RetweetOutlined, HeartTwoTone } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import PostImages from './PostImages';
import CommentForm from './CommentForm';
import styled from 'styled-components';
import PostCardContent from './PostCardContent';
import { REMOVE_POST_REQUEST } from '../reducers/post';

const CardWrapper = styled.div`
  margin-bottom: 20px;
`;


const PostCard = ({ post }) => {
  const [liked, setLiked] = useState(false);
  const [commentFormOpened, setCommentFormOpened] = useState(false);

  const dispatch = useDispatch();

  const id = useSelector((state) => state.user.me?.id);
  const { removePostLoading } = useSelector((state) => state.post);
  // const id = me?.id;  // me && me.id;
  const onToggleLike = useCallback(() => {
    setLiked(prev => !prev); // 이전 데이터가 들어가 있음. 
  }, []);

  const onToggleComment = useCallback(() => {
    setCommentFormOpened(prev => !prev); // 이전 데이터가 들어가 있음.
  }, []);

  const onRemovePost = useCallback(() => {
    dispatch({
      type: REMOVE_POST_REQUEST,
      data: post.id,
    })
  }, []);

  return (
    <CardWrapper key={post.id} >
      <Card
        cover={post.Images[0] && <PostImages images={post.Images} />}
        actions={[
          <RetweetOutlined key="retweet" />,
          liked
            ? <HeartTwoTone twoToneColor="#eb2f96" key="heart" onClick={onToggleLike} />
            : <HeartOutlined key="heart" onClick={onToggleLike} />,
          <MessageOutlined key="comment" onClick={onToggleComment} />,
          <Popover 
            key="more" 
            content={(
            <Button.Group>
              {id && post.User.id === id 
              ? (
                  <>
                    <Button>수정</Button>
                    <Button 
                      type="danger" 
                      onClick={onRemovePost}
                      loading={removePostLoading}
                      >
                      삭제
                      </Button>
                  </>
                )
              : <Button>신고</Button>}
            </Button.Group>
          )}
          >
            <EllipsisOutlined />
          </Popover>
        ]}
      >
        <Card.Meta
          avatar={<Avatar>{post.User.nickname[0]}</Avatar>}
          title={post.User.nickname}
          description={<PostCardContent postData={post.content} />}
        />
      </Card>
      {commentFormOpened && (
        <>
          <CommentForm post={post} />
          <List
            header={`${post.Comments.length}개의 댓글`}
            itemLayout="horizontal"
            dataSource={post.Comments}
            renderItem={(item) => (
              <li>
                <Comment
                  author={item.User.nickname}
                  avatar={<Avatar>{item.User.nickname[0]}</Avatar>}
                  content={item.content}
                />
              </li>
            )}
          />
        </>
      )}
    </CardWrapper>
  );
};

PostCard.propTypes = { 
  post: PropTypes.shape({
    id: PropTypes.string,
    User: PropTypes.object,
    content: PropTypes.string,
    createdAt: PropTypes.object,
    Comments: PropTypes.arrayOf(PropTypes.object), // 객체들의 배열
    Images: PropTypes.arrayOf(PropTypes.object), // 객체들의 배열
  }).isRequired,
};
// shape는 object 요소를 모두 정의


export default PostCard;