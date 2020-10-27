import React, { useEffect, useState, useCallback } from 'react';
import Head from 'next/head';
import Router from 'next/router';

import AppLayout from '../components/AppLayout';
import FollowList from '../components/FollowList';
import NicknameEditForm from '../components/NicknameEditForm';
import { useSelector } from 'react-redux';
import useSWR from 'swr';
import axios from 'axios';

const fetcher = url => axios.get(url, { withCredentials: true })
  .then(result => result.data);

const Profile = () => {
  const { me } = useSelector((state) => state.user);
  const [followersLimit, setFollowersLimit] = useState(3);
  const [followingsLimit, setFollowingsLimit] = useState(3);

  const { data: followersData, error: followerError } = useSWR(`http://localhost:3065/user/followers?limit=${followersLimit}`, fetcher);
  const { data: followingsData, error: followingError } = useSWR(`http://localhost:3065/user/followings?limit=${followingsLimit}`, fetcher);
  /* 
    data, error 둘다 없으면 로딩 중..
    둘 중에 하나라도 있으면 성공 || 실패
  */
 
 // useEffect(() => {
   //   dispatch({
     //     type: LOAD_FOLLOWERS_REQUEST,
     //   });
     //   dispatch({
       //     type: LOAD_FOLLOWINGS_REQUEST,
       //   });
       // }, []);
       
  useEffect(() => {
    if (!(me && me.id)) {
      Router.push('/');
    }
  }, [me && me.id]);
  // 어떠한 경우에도 Hooks 는 전부 실행이 되어야 한다는 점을 유의한다.

  const loadMoreFollowings = useCallback(() => {
    setFollowingsLimit((prev) => prev + 3);
  }, []);

  const loadMoreFollowers = useCallback(() => {
    setFollowersLimit((prev) => prev + 3);
  }, []);

  if (!me) {
    return '내 정보 로딩중...';
  }

  if (followerError || followingError) {
    console.error(followerError || followingError);
    return <div>팔로잉/팔로워 로딩 중 에러가 발생합니다.</div>;
  }


  return (
    <>
      <Head>
        <title>내 프로필 | NodeBird</title>
      </Head>
      <AppLayout>
        <NicknameEditForm />
        <FollowList header="팔로잉" data={followingsData} onClickMore={loadMoreFollowings} loading={!followingsData && !followingError}/>
        <FollowList header="팔로워" data={followersData} onClickMore={loadMoreFollowers} loading={!followersData && !followerError}/>
      </AppLayout>
    </>
  );
};


export default Profile; 