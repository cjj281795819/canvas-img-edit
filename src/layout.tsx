import React, { SFC } from 'react';
import { SmileTwoTone } from '@ant-design/icons'
import styled from 'styled-components';

const Container = styled.div`
  margin: 0 auto;
  padding: 25px;
  width: 1080px;
  height: 650px;
  border-radius: 5px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 1px 6px;
  user-select: none;

  .title-box {
    font-size: 16px;
    display: flex;
    align-items: center;

    .anticon-smile {
      margin-right: 5px;
      font-size: 20px;
    }
  }

  .content {
    margin-top: 25px;
    display: flex;
    justify-content: center;
  }
`;

type IndexProps = {
  event: {
    onMouseUp: () => void
  }
};

const Index: SFC<IndexProps> = ({ children, event }) => {
  return (
    <Container {...event}>
      <div className="title-box">
        <SmileTwoTone />
        图片裁剪工具
      </div>
      <div className="content">
        {children}
      </div>
    </Container>
  )
};

export default Index;