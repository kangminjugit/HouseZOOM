import styled, { css } from 'styled-components';
import React, { useEffect, useState } from 'react';
import palette from '../../lib/styles/palette';
import ClassCharacter from './ClassCharacter';

const ItemBox = styled.div`
  flex-direction: row;
  display: flex;
  justify-content: space-between;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.025);
  padding: 2rem;
  width: 100%;
  height: 250px;
  background: ${palette.gray[0]};
  border-radius: 10px;
  outline: solid 1px ${palette.gray[3]};
  .div {
    flex-direction: row;
    display: flex;
  }
`;

const CharBox = styled.div`
  position: relative;
  //margin: 1rem;
  //margin-left: 2rem;
  //box-shadow: 0 0 8px rgba(0, 0, 0, 0.025);
  //padding: 2rem;
  width: 170px;
  height: 180px;
  background: ${palette.gray[0]};
  font-weight: bold;
  font-size: 1.5rem;
  border-radius: 10px;
  flex-direction: column;
  align-items: center;
  //outline: solid 1px ${palette.gray[8]};
  .img {
    height: 100%;
    width: 100%;
    object-fit: contain;
  }
`;

const ItemText = styled.div`
  flex-direction: column;
  display: flex;
  justify-content: center;
  font-weight: bold;
  font-size: 1.3rem;
  text-align: center;
  //box-shadow: 0 0 8px rgba(0, 0, 0, 0.025);
  //padding: 2rem;
  width: 170px;
  height: 50px;
  background: ${palette.gray[0]};
  border-radius: 10px;
  //outline: solid 1px ${palette.gray[3]};
`;

const ClassCharList = ({ student_name, items }) => {
  return (
    <div
      style={{
        margin: '1rem',
        outline: 'solid 2px gray',
        borderRadius: '10px',
      }}
    >
      <CharBox>
        <ClassCharacter items={items} />
      </CharBox>
      <ItemText>{student_name}</ItemText>
    </div>
  );
};

export default ClassCharList;
