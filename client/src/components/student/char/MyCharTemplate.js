import styled, { css } from 'styled-components';
import React, { useEffect, useState } from 'react';
import palette from '../../../lib/styles/palette';
import Character from './Character';
import ItemButton from './ItemButton';
import Button from '../../common/Button';
import axios from 'axios';

const null_arr = [''];

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
  position: relative;
  margin: 6rem;
  margin-left: 8rem;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.025);
  padding: 2rem;
  width: 320px;
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
  const [loading, setLoading] = useState(false);
  const [hairs, setHairs] = useState();
  const [tops, setTops] = useState();
  const [bottoms, setBottoms] = useState();
  // 토큰
  const token = JSON.parse(localStorage.getItem('student_user'));
  const accessClient = axios.create({
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  // const rendering = () => {
  //   const result = [];
  //   for (let i = 0; i < 4; i++) {
  //     result.push(<ItemButton url="/puang_img/puang_gibon.png" />);
  //   }
  //   return result;
  // };

  // useEffect(() => {
  //   const fetchData = async () => {
  //     setLoading(true);
  //     const url_hair = '/api/avatar/my-item?type=hair';
  //     const url_top = '/api/avatar/my-item?type=top';
  //     const url_bottom = '/api/avatar/my-item?type=bottom';

  //     accessClient
  //       .get(url_hair)
  //       .then(function (response) {
  //         console.log(response.data.data.items);
  //         setHairs(response.data.data.items);
  //       })
  //       .catch(function (error) {
  //         console.log(error);
  //       });

  //     accessClient
  //       .get(url_top)
  //       .then(function (response) {
  //         console.log(response.data.data.items);
  //         setTops(response.data.data.items);
  //       })
  //       .catch(function (error) {
  //         console.log(error);
  //       });

  //     accessClient
  //       .get(url_bottom)
  //       .then(function (response) {
  //         console.log(response.data.data.items);
  //         setBottoms(response.data.data.items);
  //       })
  //       .catch(function (error) {
  //         console.log(error);
  //       });
  //     setLoading(false);
  //   };
  //   fetchData();
  // }, []);

  if (loading) {
    return <div>로딩중</div>;
  }

  if (!hairs) return setHairs(null_arr);
  if (!tops) return setTops(null_arr);
  if (!bottoms) return setBottoms(null_arr);

  return (
    <MyCharTemplateBlock>
      <CharBox>
        {/* <img className="img" alt="character" src="/puang_img/puang_gibon.png" /> */}
        <Character />
      </CharBox>
      <ItemBox>
        <SubItemBox>
          <div className="headline">헤어</div>
          <ItemButton url="https://housezoombucket.s3.ap-northeast-2.amazonaws.com/1651027698618_IMG_3755.PNG" />
          {/* {hairs.map((hair, index) => (
            <ItemButton key={index} url={hair.image} />
          ))} */}
        </SubItemBox>
        <SubItemBox>
          <div className="headline">상의</div>
          <ItemButton url="https://housezoombucket.s3.ap-northeast-2.amazonaws.com/1651027893201_IMG_3756.PNG" />
          {/* {tops.map((top, index) => (
            <ItemButton key={index} url={top.image} />
          ))} */}
        </SubItemBox>
        <SubItemBox>
          <div className="headline">하의</div>
          <ItemButton url="https://housezoombucket.s3.ap-northeast-2.amazonaws.com/1651028135275_IMG_3758.PNG" />
          {/* {bottoms.map((bottom, index) => (
            <ItemButton key={index} url={bottom.image} />
          ))} */}
        </SubItemBox>
        <Button fullWidth indigo>
          장착하기
        </Button>
      </ItemBox>
    </MyCharTemplateBlock>
  );
};

export default MyCharTemplate;
