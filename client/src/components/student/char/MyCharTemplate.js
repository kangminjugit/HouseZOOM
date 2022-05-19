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
  // const [all, setAll] = useState();

  // 토큰
  const token = JSON.parse(localStorage.getItem('student_user'));
  const accessClient = axios.create({
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
      //const url_hair = '/api/avatar/my-item?type=hair';
      //const url_top = '/api/avatar/my-item?type=top';
      //const url_bottom = '/api/avatar/my-item?type=bottom';
      const url_all = '/api/avatar/my-item?type=*';

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

      // accessClient
      //   .get(url_hair)
      //   .then(function (response) {
      //     console.log(response.data.data.items);
      //     setHairs(response.data.data.items);
      //   })
      //   .catch(function (error) {
      //     console.log(error);
      //   });

      // accessClient
      //   .get(url_top)
      //   .then(function (response) {
      //     console.log(response.data.data.items);
      //     setTops(response.data.data.items);
      //   })
      //   .catch(function (error) {
      //     console.log(error);
      //   });

      // accessClient
      //   .get(url_bottom)
      //   .then(function (response) {
      //     console.log(response.data.data.items);
      //     setBottoms(response.data.data.items);
      //   })
      //   .catch(function (error) {
      //     console.log(error);
      //   });

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

  const handleClick = () => {
    alert('완료');
  };

  return (
    <MyCharTemplateBlock>
      <CharBox>
        {/* <img className="img" alt="character" src="/puang_img/puang_gibon.png" /> */}
        <Character />
      </CharBox>
      <ItemBox>
        <SubItemBox>
          <div className="headline">헤어</div>
          {/* <ItemButton url="https://housezoombucket.s3.ap-northeast-2.amazonaws.com/1651027698618_IMG_3755.PNG" /> */}
          {hairs.map((hair, index) => (
            <ItemButton
              key={index}
              url={hair.image}
              item_id={hair.id}
              item_toggle={hair.isUsed}
            />
          ))}
        </SubItemBox>
        <SubItemBox>
          <div className="headline">상의</div>
          {/* <ItemButton url="https://housezoombucket.s3.ap-northeast-2.amazonaws.com/1651027893201_IMG_3756.PNG" /> */}
          {tops.map((top, index) => (
            <ItemButton
              key={index}
              url={top.image}
              item_id={top.id}
              item_toggle={top.isUsed}
            />
          ))}
        </SubItemBox>
        <SubItemBox>
          <div className="headline">하의</div>
          {/* <ItemButton url="https://housezoombucket.s3.ap-northeast-2.amazonaws.com/1651028135275_IMG_3758.PNG" /> */}
          {bottoms.map((bottom, index) => (
            <ItemButton
              key={index}
              url={bottom.image}
              item_id={bottom.id}
              item_toggle={bottom.isUsed}
            />
          ))}
        </SubItemBox>
        <Button onClick={handleClick} fullWidth indigo to="/studentMyPage">
          장착하기
        </Button>
      </ItemBox>
    </MyCharTemplateBlock>
  );
};

export default MyCharTemplate;
