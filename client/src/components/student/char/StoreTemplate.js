import styled, { css } from 'styled-components';
import React, { useEffect, useState } from 'react';
import palette from '../../../lib/styles/palette';
import Item from './Item';
import Button from '../../common/Button';

import axios from 'axios';
//import ToggleButton from '../../common/ToggleButton';

const null_arr = [''];

// 화면 전체 style
const StoreTemplateBlock = styled.div`
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

const StoreTemplate = () => {
  const [loading, setLoading] = useState(false);
  const [hairs, setHairs] = useState();
  const [tops, setTops] = useState();
  const [bottoms, setBottoms] = useState();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const url_hair = '/api/item?type=hair';
        const url_top = '/api/item?type=top';
        const url_bottom = '/api/item?type=bottom';

        const response_hair = await axios.get(url_hair);
        const response_top = await axios.get(url_top);
        const response_bottom = await axios.get(url_bottom);

        setHairs(response_hair.data.data.items);
        setTops(response_top.data.data.items);
        setBottoms(response_bottom.data.data.items);
      } catch (e) {
        console.log(e);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return <div>로딩중</div>;
  }

  if (!hairs) return setHairs(null_arr);
  if (!tops) return setTops(null_arr);
  if (!bottoms) return setBottoms(null_arr);

  return (
    <StoreTemplateBlock>
      <HeaderBox>
        <div>캐릭터 상점</div>
        <Button indigo>내 장바구니</Button>
      </HeaderBox>
      <ItemBox>
        {hairs.map((hair, index) => (
          <Item
            key={index}
            item_name={hair.name}
            item_point={hair.price}
            item_url={hair.image}
          ></Item>
        ))}
      </ItemBox>
      <ItemBox>
        {tops.map((top, index) => (
          <Item
            key={index}
            item_name={top.name}
            item_point={top.price}
            item_url={top.image}
          ></Item>
        ))}
      </ItemBox>
      <ItemBox>
        {bottoms.map((bottom, index) => (
          <Item
            key={index}
            item_name={bottom.name}
            item_point={bottom.price}
            item_url={bottom.image}
          ></Item>
        ))}
      </ItemBox>
    </StoreTemplateBlock>
  );
};

export default StoreTemplate;
