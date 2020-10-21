import React from 'react';
import { useSelector } from 'react-redux';
import AppLayout from '../components/AppLayout';
import { Card, Avatar } from 'antd';
import wrapper from '../store/configureStore';
import { LOAD_USER_REQUEST } from '../reducers/user';
import { END } from 'redux-saga';
import Head from 'next/head';
import axios from 'axios';

const About = () => {
  const { userInfo } = useSelector((state) => state.user);

  return (
    <AppLayout>
      <Head>
        <title>은기</title>
        {userInfo
          ? (
            <Card
              actions={[
                <div key="twit">
                  짹짹
                  <br />
                  {userInfo.Posts}
                </div>,
                <div key="following">
                  팔로잉
                  <br />
                  {userInfo.Followings}
                </div>,
                <div key="follower">
                  팔로워
                  <br />
                  {userInfo.Followers}
                </div>,
              ]}
            >
              <Card.Meta 
                avatar={<Avatar>{userInfo.nickname[0]}</Avatar>}
                title={userInfo.nickname}
                description="노드버드 매니아"
              />
            </Card>
          ) :
          null
        }
      </Head>
    </AppLayout>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
  console.log('getServerSideProps start');
  console.log(context.req.headers);

  const cookie = context.req ? context.req.headers.cookie : '';
  axios.defaults.headers.Cookie = '';
  if (context.req && cookie) {
    axios.defaults.headers.Cookie = cookie;
  }

  context.store.dispatch({
    type: LOAD_USER_REQUEST,
    data: 6,
  });
  context.store.dispatch(END);
  await context.store.sagaTask.toPromise(); // 그냥 사용방법이니 외우기
})

export default About;