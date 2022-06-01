import styled, { css } from 'styled-components';
import React, { useEffect, useState } from 'react';
import palette from '../../../lib/styles/palette';

const ItemBox = styled.div`
  flex-direction: row;
  display: flex;
  justify-content: space-between;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.025);
  padding: 2rem;
  width: 100%;
  height: 200px;
  background: ${palette.gray[0]};
  border-radius: 10px;
  outline: solid 1px ${palette.gray[3]};
  .div {
    flex-direction: row;
    display: flex;
  }
`;
const ItemText = styled.div`
  flex-direction: column;
  display: flex;
  justify-content: center;
  //box-shadow: 0 0 8px rgba(0, 0, 0, 0.025);
  padding: 2rem;
  width: 200px;
  height: 100%;
  background: ${palette.gray[0]};
  border-radius: 10px;
  //outline: solid 1px ${palette.gray[3]};
`;

const ItemList = ({ item_name, item_price, item_url }) => {
  return (
    <ItemBox>
      <div className="div">
        <img className="img" alt="item" src={item_url} />
        <ItemText>
          <div>{item_name}</div>
          <div>{item_price}콩</div>
        </ItemText>
      </div>
      {/* <Button>삭제하기</Button> */}
    </ItemBox>
  );
};

export default ItemList;
