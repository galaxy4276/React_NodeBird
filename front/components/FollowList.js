import React from 'react';
import { Button, Card, List } from 'antd';
import PropTypes from 'prop-types';
import { StopOutlined } from '@ant-design/icons';


const FollowList = ({ header, data }) => {
  return (
    <List 
      style={{ marginBottom: 20 }} // 스타일
      grid={{ gutter: 4, xs: 2, md: 3 }} // 간격 4px, 모바일 2/24, 데스크탑 3/24 both Column.
      size="small" // 사이즈 
      header={<div>{header}</div>} // 최상단 데이터
      loadMore={<div style={{ textAlign: 'center', margin: '10px 0' }}><Button>더 보기</Button></div>}
      bordered
      dataSource={data} // 배열 데이터를 헤더 아래, 푸터 위에 순서대로 그린다.
      renderItem={(item) => (  // 배열 데이터를 어떻게 처리하는 지.
        <List.Item style={{ marginTop: 20 }}>  
          <Card actions={[<StopOutlined key="stop" />]}> 
            <Card.Meta description={item.nickname} />
          </Card>
        </List.Item>
        /*
          List.Item은 리스트의 한 노드를 칭함.
          Card => actions = Array of Type, action list shows at the bottom of the Card
          Card.Meta => description = Description content
        */
      )}
    />
  );
};


FollowList.propTypes = {
  header: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
};


export default FollowList;