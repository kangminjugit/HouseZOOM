import styled, { css } from 'styled-components';
import React, { useEffect, useState } from 'react';
import palette from '../../../lib/styles/palette';
import client from '../../../axiosConfig';

const ItemBox = styled.div`
  flex-direction: row;
  display: flex;
  align-items: center;
  justify-content: space-between;

  box-shadow: 0 0 8px rgba(0, 0, 0, 0.01);
  padding: 2rem;
  width: 100%;
  height: 100px;
  /* background: ${palette.gray[0]}; */
  border-radius: 4px;
  /* outline: solid 1px ${palette.gray[3]}; */
  border-bottom: solid 1px ${palette.mint[5]};

  font-size: 1rem;
  font-family: 'Pretendard Medium';
`;

const LeftBlock = styled.div`
  flex-direction: row;
  display: flex;
  align-items: center;
`;

const StyledButton = styled.button`
  font-family: 'Pretendard Bold';
  color: ${palette.gray[8]};
  outline: none;
  border: none;
  border-radius: 4px;
  height: 2rem;
  background-color: ${palette.mint[4]};
  &:hover {
    background-color: ${palette.mint[2]};
  }
`;

const ItemList = ({ item_id, item_name, item_price, item_url }) => {
  // 토큰
  const token = JSON.parse(localStorage.getItem('student_user'));
  const accessClient = client.create({
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  const handleClick = () => {
    const item_arr = [item_id];
    if (item_arr !== []) {
      accessClient
        .delete('/api/shopping-basket', { data: item_arr })
        .then(function (res) {
          console.log(res);
          alert('삭제하기 완료');
          window.location.reload();
        })
        .catch(function (err) {
          console.log(err);
        });
    }
  };
  return (
    <ItemBox>
      <LeftBlock>
        <img
          className="img"
          alt="item"
          src={item_url}
          style={{
            height: '100px',
            marginRight: '2rem',
          }}
        />
        <div style={{ paddingRight: '2rem' }}>{item_name}</div>
        <div>{item_price}콩</div>
      </LeftBlock>
      <StyledButton onClick={handleClick}>삭제하기</StyledButton>
    </ItemBox>
  );
};

export default ItemList;
