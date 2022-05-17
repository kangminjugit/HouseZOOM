import styled, { css } from 'styled-components';
import React, { useEffect, useState } from 'react';
import palette from '../../../lib/styles/palette';
import Button from '../../common/Button';
import ItemList from './ItemList';
import axios from 'axios';

const null_arr = [''];

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
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState();

  // 토큰
  const token = JSON.parse(localStorage.getItem('student_user'));
  const accessClient = axios.create({
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      accessClient
        .get('/api/shopping-basket')
        .then(function (response) {
          console.log(response.data.data.items);
          setItems(response.data.data.items);
        })
        .catch(function (error) {
          console.log(error);
        });
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return <div>로딩중</div>;
  }
  if (!items) return setItems(null_arr);

  const handleClick = (e) => {
    console.log('구입하기');
    accessClient
      .post('/api/shopping-basket/buy')
      .then(function (response) {
        console.log(response);
        alert('구입 완료!');
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <ShoppingTemplateBlock>
      <HeaderBox>
        <div>내 장바구니</div>
      </HeaderBox>
      {items.map((item, index) => (
        <ItemList
          key={index}
          item_name={item.name}
          item_point={item.price}
          item_url={item.image}
        ></ItemList>
      ))}
      {/* <ItemList
        item_name="헤어"
        item_price="100콩"
        item_url="/puang_img/puang_gibon.png"
      /> */}
      <HeaderBox>
        <div>총 가격</div>
        <Button indigo onClick={handleClick} to="/studentMyPage">
          구입하기
        </Button>
      </HeaderBox>
    </ShoppingTemplateBlock>
  );
};

export default ShoppingTemplate;
