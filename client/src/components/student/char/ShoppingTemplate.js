import styled, { css } from 'styled-components';
import React, { useEffect, useState } from 'react';
import palette from '../../../lib/styles/palette';
import Button from '../../common/Button';
import ItemList from './ItemList';

// 화면 전체 style
const ShoppingTemplateBlock = styled.div`
  position: flex;
  left: 10px;
  right: 10px;
  top: 10px;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const HeaderBox = styled.div`
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.025);
  padding: 2rem;
  width: 100%;
  height: 100px;
  //background: ${palette.gray[0]};
  font-weight: bold;
  font-size: 1.5rem;
  border-radius: 10px;
  flex-direction: row;
  display: flex;
  //align-items: center;
  justify-content: space-between;
  outline: solid 1px ${palette.gray[3]};
`;

const ItemBox = styled.div`
  flex-direction: row;
  display: flex;
  //justify-content: center;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.025);
  padding: 2rem;
  width: 100%;
  height: 200px;
  background: ${palette.gray[0]};
  border-radius: 10px;
  outline: solid 1px ${palette.gray[3]};
`;

const ShoppingTemplate = () => {
  return (
    <ShoppingTemplateBlock>
      <HeaderBox>
        <div>내 장바구니</div>
      </HeaderBox>
      <ItemList
        item_name="헤어"
        item_price="100콩"
        item_url="/puang_img/puang_gibon.png"
      />
      <HeaderBox>
        <div>총 가격</div>
        <Button indigo>구입하기</Button>
      </HeaderBox>
    </ShoppingTemplateBlock>
  );
};

export default ShoppingTemplate;
