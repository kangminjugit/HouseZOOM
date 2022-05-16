import styled, { css } from 'styled-components';
import React, { useState } from 'react';
import palette from '../../../lib/styles/palette';
//import Character from './Character';
import ItemButton from './ItemButton';
import Button from '../../common/Button';

// 화면 전체 style
const MyCharTemplateBlock = styled.div`
  position: flex;
  left: 10px;
  right: 10px;
  top: 10px;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const CharBox = styled.div`
  margin: 6rem;
  margin-left: 8rem;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.025);
  padding: 2rem;
  width: 300px;
  height: 550px;
  background: ${palette.gray[0]};
  font-weight: bold;
  font-size: 1.5rem;
  border-radius: 10px;
  flex-direction: column;
  align-items: center;
  outline: solid 1px ${palette.gray[3]};
  .img {
    height: 100%;
    width: 100%;
    object-fit: contain;
  }
`;

const ItemBox = styled.div`
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.025);
  padding: 2rem;
  width: 800px;
  height: 550px;
  background: ${palette.gray[0]};
  border-radius: 10px;
  flex-direction: column;
  justify-content: center;
  outline: solid 1px ${palette.gray[3]};
  .img {
    height: 100%;
    width: 100%;
    object-fit: contain;
  }
`;

const SubItemBox = styled.div`
  //box-shadow: 0 0 8px rgba(0, 0, 0, 0.025);
  padding: 1rem;
  width: 750px;
  height: 150px;
  background: ${palette.gray[0]};
  border-radius: 10px;
  flex-direction: row;
  //outline: solid 1px ${palette.gray[3]};
  align-items: center;
  .headline {
    padding-left: 10px;
    font-weight: bold;
    font-size: 1rem;
  }
`;

const MyCharTemplate = () => {
  const rendering = () => {
    const result = [];
    for (let i = 0; i < 4; i++) {
      result.push(<ItemButton url="/puang_img/puang_gibon.png" />);
    }
    return result;
  };

  return (
    <MyCharTemplateBlock>
      <CharBox>
        <img className="img" alt="character" src="/puang_img/puang_gibon.png" />
      </CharBox>
      <ItemBox>
        <SubItemBox>
          <div className="headline">헤어</div>
          <div>{rendering()}</div>
        </SubItemBox>
        <SubItemBox>
          <div className="headline">상의</div>
          <div>{rendering()}</div>
        </SubItemBox>
        <SubItemBox>
          <div className="headline">하의</div>
          <div>{rendering()}</div>
        </SubItemBox>
        <Button fullWidth indigo>
          장착하기
        </Button>
      </ItemBox>
    </MyCharTemplateBlock>
  );
};

export default MyCharTemplate;
