import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import palette from '../../../lib/styles/palette';
import ToggleButton from '../../common/ToggleButton';

const ItemBlock = styled.div`
  width: 75px;
  height: 75px;
  border-radius: 10px;
  flex-direction: column;
  align-items: center;
  margin: 0.5rem;
  outline: solid 1px ${palette.gray[3]};
  .img {
    height: 100%;
    width: 100%;
    object-fit: contain;
  }
  .div {
    text-align: center;
    font-size: 12px;
  }
`;

const Item = ({ item_name, item_price, item_url }) => {
  return (
    <ItemBlock>
      <img className="img" alt="character" src={item_url} />
      <div className="div">{item_name}</div>
      <div className="div">{item_price}</div>
      <ToggleButton txt="장바구니" />
    </ItemBlock>
  );
};

export default Item;
