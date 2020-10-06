import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

// Evaluate string component
const PostCardContent = ({ postData }) => { // 첫 번째 게시글 #해시태ㅐ그 #익스프레스
  return (
    <div>
      {postData && postData.split(/(#[^\s#]+)/g).map((v, i) => {
        if (v.match(/(#[^\s#]+)/)) {
          return (<Link href={`/hashtag/${v.slice(1)}`} key={i}><a>{v}</a></Link>);
        }
        return v;
      })}
    </div>
  );
};

PostCardContent.propTypes = {
  postData: PropTypes.string.isRequired,
};


export default PostCardContent;