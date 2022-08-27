import React, { useState, useEffect } from 'react';
import palette from '../../../lib/styles/palette';
import styled from 'styled-components';
import client from '../../../axiosConfig';
import ItemList from './ItemList';
import { useHistory } from 'react-router-dom';

const ShoppingBlock = styled.div`
  margin-top: 1rem;
  margin-left: 6rem;
  margin-right: 6rem;
  color: ${palette.gray[8]};
`;

const StyledButton = styled.button`
  font-family: 'Pretendard Bold';
  color: ${palette.gray[8]};
  outline: none;
  border: none;
  border-radius: 4px;
  width: 10rem;
  height: 2rem;
  background-color: ${palette.mint[4]};
  &:hover {
    background-color: ${palette.mint[2]};
  }
`;

const TitleStyle = styled.div`
  font-family: 'Pretendard Bold';

  font-size: 1.2rem;
  margin-left: 0.5rem;
  // 정렬
  display: flex;
  align-items: center;
`;

const ShoppingNew = () => {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState();
  const [price, setPrice] = useState(0);
  const [point, setPoint] = useState(0);
  const history = useHistory();

  // 토큰
  const token = JSON.parse(localStorage.getItem('student_user'));
  const accessClient = client.create({
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  const countPrice = (arr) => {
    console.log('count price function');
    var p = 0;
    for (let j = 0; j < arr.length; j++) {
      p += arr[j].price;
      //setPrice(price + arr[j].price);
    }
    //console.log(p);
    setPrice(p);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      accessClient
        .get('/api/shopping-basket')
        .then(function (response) {
          console.log(response.data.data.items);
          setItems(response.data.data.items);
          countPrice(response.data.data.items);
        })
        .catch(function (error) {
          console.log(error);
        });
      accessClient
        .get('/api/point')
        .then(function (response) {
          console.log(response);
          setPoint(response.data.data.point);
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
  if (!items) return <></>;

  const handleClick = (e) => {
    accessClient
      .post('/api/shopping-basket/buy')
      .then(function (response) {
        console.log(response);
        alert('구입 완료!');
        history.push('/studentMyPage');
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  return (
    <ShoppingBlock>
      <TitleStyle style={{ marginBottom: '2rem' }}>장바구니</TitleStyle>
      {items.map((item, index) => (
        <div style={{ marginTop: '1rem' }} key={index}>
          <ItemList
            key={index}
            item_name={item.name}
            item_price={item.price}
            item_url={item.image}
            item_id={item.id}
          ></ItemList>
        </div>
      ))}
      <TitleStyle
        style={{ justifyContent: 'space-between', marginTop: '1rem' }}
      >
        <div>
          총 가격 : {price}콩 / 현재 포인트 : {point}콩
        </div>
        <StyledButton onClick={handleClick}>구입하기</StyledButton>
      </TitleStyle>
    </ShoppingBlock>
  );
};

export default ShoppingNew;
