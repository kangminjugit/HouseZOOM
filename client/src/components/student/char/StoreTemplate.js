import styled, { css } from 'styled-components';
import React, { useEffect, useState } from 'react';
import palette from '../../../lib/styles/palette';
import Item from './Item';
import Button from '../../common/Button';

// import axios from 'axios';
//import ToggleButton from '../../common/ToggleButton';
import client from '../../../axiosConfig';

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
  // const [all, setAll] = useState();

  const make_item_dict = (arr1, arr2, arr3) => {
    const dict = {};
    for (let j = 0; j < arr1.length; j++) {
      dict[arr1[j].id] = false;
    }
    for (let j = 0; j < arr2.length; j++) {
      dict[arr2[j].id] = false;
    }
    for (let j = 0; j < arr3.length; j++) {
      dict[arr3[j].id] = false;
    }

    return dict;
  };

  const make_item_arr = (arr1, arr2, arr3) => {
    const arr = [];
    for (let j = 0; j < arr1.length; j++) {
      arr.push(arr1[j].id);
    }
    for (let j = 0; j < arr2.length; j++) {
      arr.push(arr2[j].id);
    }
    for (let j = 0; j < arr3.length; j++) {
      arr.push(arr3[j].id);
    }

    return arr;
  };
  // 토큰
  const token = JSON.parse(localStorage.getItem('student_user'));
  const accessClient = client.create({
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  const divide_type = (arr) => {
    const type_hair = [];
    const type_top = [];
    const type_bottom = [];
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].type === 'hair') {
        console.log(arr[i]);
        type_hair.push(arr[i]);
      } else if (arr[i].type === 'top') {
        console.log(arr[i]);
        type_top.push(arr[i]);
      } else if (arr[i].type === 'bottom') {
        console.log(arr[i]);
        type_bottom.push(arr[i]);
      }
    }
    setHairs(type_hair);
    setTops(type_top);
    setBottoms(type_bottom);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // const url_hair = '/api/item?type=hair';
        // const url_top = '/api/item?type=top';
        // const url_bottom = '/api/item?type=bottom';

        // const response_hair = await axios.get(url_hair);
        // const response_top = await axios.get(url_top);
        // const response_bottom = await axios.get(url_bottom);

        // setHairs(response_hair.data.data.items);
        // setTops(response_top.data.data.items);
        // setBottoms(response_bottom.data.data.items);
        const url_all = '/api/item?type=*';

        accessClient
          .get(url_all)
          .then(function (response) {
            console.log(response.data.data.items);
            //setAll(response.data.data.items);
            divide_type(response.data.data.items);
            console.log(hairs);
            console.log(tops);
            console.log(bottoms);
          })
          .catch(function (error) {
            console.log(error);
          });
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

  if (!hairs) return;
  if (!tops) return;
  if (!bottoms) return;

  const items_toggle = make_item_dict(hairs, tops, bottoms);
  console.log(items_toggle);

  const items_arr = make_item_arr(hairs, tops, bottoms);
  console.log(items_arr);

  const getItemToggle = (id, t) => {
    items_toggle[id] = t;
    console.log(items_toggle);
  };

  const getItemArray = (dict, arr) => {
    const id = [];
    for (let i = 0; i < arr.length; i++) {
      if (dict[arr[i]] === true) {
        id.push(arr[i]);
      }
    }
    return id;
  };

  const handleClick = (e) => {
    const items_id = getItemArray(items_toggle, items_arr);

    console.log(items_id);
    if (items_id !== []) {
      accessClient
        .post('/api/shopping-basket', items_id)
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  };

  return (
    <StoreTemplateBlock>
      <HeaderBox>
        <div>캐릭터 상점</div>
        <Button indigo onClick={handleClick} to="/student/ShoppingPage">
          내 장바구니
        </Button>
      </HeaderBox>
      <ItemBox>
        {hairs.map((hair, index) => (
          <Item
            key={index}
            item_name={hair.name}
            item_point={hair.price}
            item_url={hair.image}
            item_toggle={getItemToggle}
            item_id={hair.id}
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
            item_toggle={getItemToggle}
            item_id={top.id}
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
            item_toggle={getItemToggle}
            item_id={bottom.id}
          ></Item>
        ))}
      </ItemBox>
    </StoreTemplateBlock>
  );
};

export default StoreTemplate;
