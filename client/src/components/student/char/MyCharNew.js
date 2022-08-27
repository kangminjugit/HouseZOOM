import React, { useState, useEffect } from 'react';
import palette from '../../../lib/styles/palette';
import styled from 'styled-components';
import Character from './Character';
import ItemButton from './ItemButton';
import client from '../../../axiosConfig';
import { useHistory } from 'react-router-dom';

const MyCharNewBlock = styled.div`
  position: absolute;
  width: 100%;
  height: 90%;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const LeftBlock = styled.div`
  width: 320px;
  height: 500px;
  justify-content: space-between;

  background-color: ${palette.background[1]};
  box-shadow: 0px 0px 10px rgba(51, 51, 51, 0.1);
`;

const RightBlock = styled.div`
  margin-inline-start: 5rem;
  width: 800px;
  height: 500px;
  border-radius: 0.25rem;
  background-color: ${palette.background[1]};
  box-shadow: 0px 0px 10px rgba(51, 51, 51, 0.1);

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
`;

const TitleBlock = styled.div`
  font-family: 'Pretendard Bold';
  font-size: 1.2rem;
  text-align: center;
  // 정렬
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
`;

const RowBlock = styled.div`
  height: 150px;
  width: 100%;
  border-bottom: 1px solid ${palette.mint[5]};
  /* border: 1px solid ${palette.mint[4]};
  border-radius: 10px; */
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

const MyCharNew = () => {
  const [loading, setLoading] = useState(false);
  const [hairs, setHairs] = useState();
  const [tops, setTops] = useState();
  const [bottoms, setBottoms] = useState();
  // const [all, setAll] = useState();
  const history = useHistory();
  const handleClick = () => {
    alert('장착하기 완료!');
    history.push('/studentMyPage');
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

      const url_all = '/api/avatar/my-item?type=*';

      accessClient
        .get(url_all)
        .then(function (response) {
          console.log(response.data.data.items);
          divide_type(response.data.data.items);
          console.log(hairs);
          console.log(tops);
          console.log(bottoms);
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

  if (!hairs) return;
  if (!tops) return;
  if (!bottoms) return;

  return (
    <MyCharNewBlock>
      <LeftBlock>
        <TitleBlock>
          현재캐릭터&nbsp;
          <img
            className="character"
            alt="character"
            src="/icon/character.png"
            style={{ position: 'relative', height: '1.5rem' }}
          />
        </TitleBlock>
        <div style={{ position: 'relative', marginTop: '3rem' }}>
          <Character />
        </div>
      </LeftBlock>
      <RightBlock>
        <div
          style={{
            widthbackgroundColor: 'pink',
            width: '100%',
            display: 'flex',
            justifyContent: 'flex-end',
            marginRight: '1rem',
          }}
        >
          <StyledButton onClick={handleClick}>장착하기</StyledButton>
        </div>
        <RowBlock>
          <TitleBlock>
            헤어&nbsp;&nbsp;
            <img
              className="hair"
              alt="hair"
              src="/icon/hair.png"
              style={{ position: 'relative', height: '1.5rem' }}
            />
          </TitleBlock>
          {hairs.map((hair, index) => (
            <ItemButton
              key={index}
              url={hair.image}
              item_id={hair.id}
              item_toggle={hair.isUsed}
            />
          ))}
        </RowBlock>
        <RowBlock>
          <TitleBlock>
            상의&nbsp;&nbsp;
            <img
              className="tshirts"
              alt="tshirts"
              src="/icon/tshirts.png"
              style={{ position: 'relative', height: '1.5rem' }}
            />
          </TitleBlock>
          {tops.map((top, index) => (
            <ItemButton
              key={index}
              url={top.image}
              item_id={top.id}
              item_toggle={top.isUsed}
            />
          ))}
        </RowBlock>
        <RowBlock style={{ border: 'none' }}>
          <TitleBlock>
            하의&nbsp;&nbsp;
            <img
              className="shorts"
              alt="shorts"
              src="/icon/shorts.png"
              style={{ position: 'relative', height: '1.5rem' }}
            />
          </TitleBlock>
          {bottoms.map((bottom, index) => (
            <ItemButton
              key={index}
              url={bottom.image}
              item_id={bottom.id}
              item_toggle={bottom.isUsed}
            />
          ))}
        </RowBlock>
      </RightBlock>
    </MyCharNewBlock>
  );
};

export default MyCharNew;
