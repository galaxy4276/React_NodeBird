import React, { useCallback } from 'react';
import { Card, Avatar, Button } from 'antd';


const UserProfile = ({ setIsLoggedIn }) => {
  const onLogOut = useCallback(() => {
    setIsLoggedIn(false);
  }, []);

  return (
    <Card
      actions={[
        <div key="twit">응기잇<br />0</div>,
        <div key="followings">팔로잉<br />0</div>,
        <div key="followers">팔로워<br />0</div>,
      ]}
    >
      <Card.Meta 
        avatar={<Avatar>GL</Avatar>}
        title="galaxy"
      />
      <Button onClick={onLogOut}>로그아웃</Button>
    </Card>
  );
};


export default UserProfile;