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

const Item = ({ item_name, item_point, item_url, item_toggle, item_id }) => {
  //const [toggle, setToggle] = useState(false);

  const getToggle = (tg) => {
    item_toggle(item_id, tg);
  };

  return (
    <ItemBlock>
      <img className="img" alt="character" src={item_url} />
      <div className="div">{item_name}</div>
      <div className="div">{item_point}콩</div>
      <ToggleButton txt="장바구니" getToggle={getToggle} />
    </ItemBlock>
  );
};

export default Item;
