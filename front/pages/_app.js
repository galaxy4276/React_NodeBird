import React from "react";
import "antd/dist/antd.css";
import PropTypes from 'prop-types';
import Head from 'next/head';

import wrapper from "../store/configureStore";

// 모든 페이지의 공통 페이지
const NodeBird = ({ Component }) => {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <title>NodeBird</title>
      </Head>
      <Component /> 
    </>
  ); 
};
  

NodeBird.propTypes = {
  Component: PropTypes.elementType.isRequired,
}


export default wrapper.withRedux(NodeBird);