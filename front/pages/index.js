import React, { useEffect } from "react";
import AppLayout from "../components/AppLayout";
import { useDispatch, useSelector } from 'react-redux';
import PostForm from '../components/PostForm';
import PostCard from '../components/PostCard';
import { LOAD_POST_REQUEST } from "../reducers/post";
import { LOAD_MY_INFO_REQUEST } from "../reducers/user";
import wrapper from '../store/configureStore';
import { END } from "redux-saga";
import axios from 'axios';


const Home = () => {
  const { me } = useSelector((state) => state.user);
  const { mainPosts, hasMorePost, loadPostLoading, retweetError } = useSelector((state) => state.post);

  const dispatch = useDispatch();

  useEffect(() => {
    if (retweetError) {
      alert(retweetError);
    }
  }, [retweetError]);



  // useEffect(() => {
  //   dispatch({
  //     type: LOAD_MY_INFO_REQUEST,
  //   });
  //   dispatch({
  //     type: LOAD_POST_REQUEST,
  //   });
  // }, []);

  useEffect(() => {
    function onScroll() {
      // console.log(window.scrollY, document.documentElement.clientHeight, document.documentElement.scrollHeight);
      if ((window.scrollY + document.documentElement.clientHeight
        > document.documentElement.scrollHeight - 300) && !loadPostLoading) {
          if (hasMorePost && !loadPostLoading) {
            const lastId = mainPosts[mainPosts.length - 1]?.id;
            dispatch({
              type: LOAD_POST_REQUEST,
              lastId,
            });
          }
        }
    }

    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
    }
  }, [hasMorePost, loadPostLoading, mainPosts]);

  return (
    <AppLayout>
      {me && <PostForm />}
      {mainPosts.map((post) => <PostCard key={post.id} post={post} />)}
    </AppLayout>
  );
};

// 서버 쪽에서 수행되는 코드 영역이다. export default Home 제외
export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
  console.log('context');
  console.log(context.req.headers);
  const cookie = context.req ? context.req.headers.cookie : ''; // cookie 정보가 여기에 들어있따.
  axios.defaults.headers.Cookie = '';
  if (context.req && cookie) {
    axios.defaults.headers.Cookie = cookie;
  }

  context.store.dispatch({
    type: LOAD_MY_INFO_REQUEST,
  });
  context.store.dispatch({
    type: LOAD_POST_REQUEST,
  });

  context.store.dispatch(END);
  await context.store.sagaTask.toPromise();
}) // 이 부분이 Home 보다 먼저 실행된다.
// 존재하면 화면을 그리기 전에 알아서 Home 보다 먼저 수행된다.
// context 내부에 스토어가 들어있다.

export default Home;
