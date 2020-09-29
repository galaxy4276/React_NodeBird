import React, { useMemo } from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import { Menu, Input, Row, Col } from "antd"; // Grid System: Row, Col

import UserProfile from '../components/UserProfile';
import LoginForm from '../components/LoginForm';
import { useSelector } from 'react-redux';


// const SearchInput = styled(Input.Search)`
//   vertical-align: middle;
// `;


const AppLayout = ({ children }) => {
  const { isLoggedIn } = useSelector((state) => state.user);

  const style = useMemo(() => ({ marginTop: 10 }), []);
  
  return (
    <div>
      <Menu mode="horizontal">
        <Menu.Item>
          <Link href="/">
            <a>노드버드</a>
          </Link>
        </Menu.Item>
        <Menu.Item>
          <Link href="/profile">
            <a>프로필</a>
          </Link>
        </Menu.Item>
        <Menu.Item>
          <Input.Search enterButton style={style} />
        </Menu.Item>
        <Menu.Item>
          <Link href="/signup">
            <a>회원가입</a>
          </Link>
        </Menu.Item>
      </Menu>
      <Row gutter={8}>
        <Col xs={24} md={6} >
          {isLoggedIn ? <UserProfile /> : <LoginForm />}
        </Col>
        <Col xs={24} md={12} >
          {children}
        </Col>
        <Col xs={24} md={6} >
          <a href="https://github.com/galaxy4276" target="_blank" rel="noreferrer noopener">galaxy4276 | Github</a>
        </Col>
      </Row>
    </div>
  );
};

AppLayout.propTypes = {
  children: PropTypes.node.isRequired,
  // 화면에 그릴 수 있는 모든 것들이 node 이다.
  // return 안에 들어갈 수 있는 모든 것 node.
};

export default AppLayout;