import React, { useCallback, useEffect, useState } from 'react';
import { Card, Button, Popover, List, Comment, Avatar } from 'antd';
import { EllipsisOutlined, HeartOutlined, 
  MessageOutlined, RetweetOutlined, HeartTwoTone } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import PostImages from './PostImages';
import CommentForm from './CommentForm';
import styled from 'styled-components';
import PostCardContent from './PostCardContent';
import { REMOVE_POST_REQUEST,
  LIKE_POST_REQUEST, UNLIKE_POST_REQUEST, RETWEET_REQUEST
} from '../reducers/post';
import FollowButton from './FollowButton';
import Link from 'next/link';
import moment from 'moment';


moment.locale('ko'); 

const CardWrapper = styled.div`
  margin-bottom: 20px;
`;


const PostCard = ({ post }) => {
  const [commentFormOpened, setCommentFormOpened] = useState(false);

  const dispatch = useDispatch();

  const id = useSelector((state) => state.user.me?.id);
  const { removePostLoading, retweetError } = useSelector((state) => state.post);
  // const id = me?.id;  // me && me.id;




  const onLike = useCallback(() => {
    if (!id) {
      return alert('로그인이 필요합니다!');
    }
    return dispatch({
      type: LIKE_POST_REQUEST,
      data: post.id
    });
  }, []);

  const onUnlike = useCallback(() => {
    if (!id) {
      return alert('로그인이 필요합니다!');
    }
    return dispatch({
      type: UNLIKE_POST_REQUEST,
      data: post.id,
    });
  }, []);

  const onToggleComment = useCallback(() => {
    setCommentFormOpened(prev => !prev); // 이전 데이터가 들어가 있음.
  }, []);

  const onRemovePost = useCallback(() => {
    if (!id) {
      return alert('로그인이 필요합니다!');
    }
    return dispatch({
      type: REMOVE_POST_REQUEST,
      data: post.id,
    })
  }, []);

  const onRetweet = useCallback(() => {
    if (!id) {
      return alert('로그인이 필요합니다.');
    }
    return dispatch({
      type: RETWEET_REQUEST,
      data: post.id,
    });
  }, [id]);

  const liked = post.Likers.find((v) => v.id === id);

  return (
    <CardWrapper key={post.id} >
      <Card
        cover={post.Images[0] && <PostImages images={post.Images} />}
        actions={[
          <RetweetOutlined key="retweet" onClick={onRetweet} />,
          liked
            ? <HeartTwoTone twoToneColor="#eb2f96" key="heart" onClick={onUnlike} />
            : <HeartOutlined key="heart" onClick={onLike} />,
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
        title={post.RetweetId ? `${post.User.nickname}님이 리트윗 하셨습니다.` : null}
        extra={id && <FollowButton post={post} />}
      >
        {post.RetweetId && post.Retweet
          ? (
            <Card
              cover={post.Retweet.Images[0] && <PostImages images={post.Retweet.Images} />}
            >
              <div style={{ float: 'right' }}>{moment(post.createdAt).format('YYYY.MM.DD')}</div>
              <Card.Meta
                avatar={<Link href={`/user/${post.User.id}`}><a><Avatar>{post.Retweet.User.nickname[0]}</Avatar></a></Link>}
                title={post.Retweet.User.nickname}
                description={<PostCardContent postData={post.Retweet.content} />}
              />
            </Card>
          )
          : (
          <>
            <div style={{ float: 'right' }}>{moment(post.createdAt).format('YYYY.MM.DD')}</div>
            <Card.Meta
              avatar={<Link
                href={`/user/${post.User.id}`}>
                  <a>
                    <Avatar>
                      {post.User.nickname[0]}
                    </Avatar>
                  </a>
                  </Link>}
              title={post.User.nickname}
              description={<PostCardContent postData={post.content} />}
            />
          </>)
        }
      </Card>
      {commentFormOpened && (
        <>
          <CommentForm post={post} />
          <List
            header={`${post.Comments.length}개의 댓글`}
            itemLayout="horizontal"
            dataSource={post.Comments}
            renderItem={(item) => {
              console.log('item');
              console.log(item);
              return (
              <li>
                <Comment
                  author={item.User.nickname}
                  avatar={<Link href={`/user/${item.User.id}`}><a><Avatar>{item.User.nickname[0]}</Avatar></a></Link>}
                  content={item.content}
                />
              </li>
              )}}
          />
        </>
      )}
    </CardWrapper>
  );
};

PostCard.propTypes = { 
  post: PropTypes.shape({
    id: PropTypes.number,
    User: PropTypes.object,
    content: PropTypes.string,
    createdAt: PropTypes.string,
    Comments: PropTypes.arrayOf(PropTypes.object), // 객체들의 배열
    Images: PropTypes.arrayOf(PropTypes.object), // 객체들의 배열
    Likers: PropTypes.arrayOf(PropTypes.object),
    RetweetId: PropTypes.number,
    Retweet: PropTypes.objectOf(PropTypes.any),
  }).isRequired,
};
// shape는 object 요소를 모두 정의


export default PostCard;