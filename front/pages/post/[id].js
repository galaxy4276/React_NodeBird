// post/[id].js
import { useRouter } from 'next/router';
import wrapper from '../../store/configureStore';
import axios from 'axios';
import { END } from 'redux-saga';
import { LOAD_MY_INFO_REQUEST } from '../../reducers/user';
import { LOAD_ONE_POST_REQUEST } from '../../reducers/post';
import AppLayout from '../../components/AppLayout';
import PostCard from '../../components/PostCard';
import { useSelector } from 'react-redux';
import Head from 'next/head';

const Post = () => {
  const router = useRouter(); 
  const {id} = router.query;
  const { singlePost } = useSelector((state) => state.post);

  if (router.isFallback) {
    return <div>로딩 중...</div>;
  }

  return (
    <AppLayout>
      <Head>
        <title>
          {singlePost.User.nickname}
          님의 글
        </title>
        <meta name="description" content={singlePost.content} />
        <meta property="og:title" content={`${singlePost.User.nickname}님의 게시글`} />
        <meta property="og:image" content={singlePost.Images[0] ? singlePost.Images[0].src : 'http://localhost/favicon.ico'} />
        <meta property="og:url" content={`http://localhost/post/${id}`} />
      </Head>
      <PostCard post={singlePost} />
    </AppLayout>
  )
};

export async function getStaticPaths() {
  return {
    paths: [
      { params: { id: '61' }},
      { params: { id: '63' }},
      { params: { id: '64' }},
    ],
    fallback: true,
  }
} 

export const getStaticProps = wrapper.getStaticProps(async (context) => {
  const cookie = context.req ? context.req.headers.cookie : '';
  console.log(context);
  axios.defaults.headers.Cookie = '';

  if (context.req && cookie) {
    axios.defaults.headers.Cookie = cookie;
  }

  context.store.dispatch({
    type: LOAD_MY_INFO_REQUEST,
  });

  context.store.dispatch({
    type: LOAD_ONE_POST_REQUEST,
    data: context.params.id,
  });

  context.store.dispatch(END);
  await context.store.sagaTask.toPromise(); // 그냥 외우자.
})

export default Post;