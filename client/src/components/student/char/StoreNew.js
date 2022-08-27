import React, { useState, useEffect } from 'react';
import palette from '../../../lib/styles/palette';
import styled from 'styled-components';
import client from '../../../axiosConfig';
import Item from './Item';
import { useHistory } from 'react-router-dom';

const StoreBlock = styled.div`
  margin-top: 1rem;
  margin-left: 6rem;
  margin-right: 6rem;
  color: ${palette.gray[8]};
`;
const TitleStyle = styled.div`
  font-family: 'Pretendard Bold';

  font-size: 1.2rem;
  margin-left: 0.5rem;
  // 정렬
  display: flex;
  align-items: center;
`;

const RowBlock = styled.div`
  margin-top: 1rem;
  height: 200px;
  border-top: 1px solid ${palette.mint[5]};
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
const ItemBlock = styled.div`
  flex-direction: row;
  display: flex;
`;

const StoreNew = () => {
  const [loading, setLoading] = useState(false);
  const [hairs, setHairs] = useState();
  const [tops, setTops] = useState();
  const [bottoms, setBottoms] = useState();
  const [point, setPoint] = useState(0);
  const history = useHistory();

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
        type_hair.push(arr[i]);
      } else if (arr[i].type === 'top') {
        type_top.push(arr[i]);
      } else if (arr[i].type === 'bottom') {
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
        const url_all = '/api/item?type=*';
        const url_point = '/api/point';

        accessClient
          .get(url_all)
          .then(function (response) {
            divide_type(response.data.data.items);
          })
          .catch(function (error) {
            console.log(error);
          });

        accessClient
          .get(url_point)
          .then(function (response) {
            console.log(response.data.data);
            setPoint(response.data.data.point);
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

  const items_arr = make_item_arr(hairs, tops, bottoms);

  const getItemToggle = (id, t) => {
    items_toggle[id] = t;
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
          history.push('/student/ShoppingPage');
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  };

  return (
    <StoreBlock>
      <TitleStyle style={{ justifyContent: 'space-between' }}>
        <div>캐릭터 상점</div>
        <div>{point}콩</div>
        <div>
          <StyledButton onClick={handleClick}>장바구니</StyledButton>
        </div>
      </TitleStyle>
      <RowBlock>
        <TitleStyle style={{ paddingTop: '0.5rem' }}>
          헤어&nbsp;&nbsp;
          <img
            className="hair"
            alt="hair"
            src="/icon/hair.png"
            style={{ position: 'relative', height: '1.5rem' }}
          />
        </TitleStyle>
        <ItemBlock>
          {hairs.map((hair, index) => (
            <Item
              key={index}
              item_name={hair.name}
              item_point={hair.price}
              item_url={hair.image}
              item_toggle={getItemToggle}
              item_id={hair.id}
            />
          ))}
        </ItemBlock>
      </RowBlock>
      <RowBlock>
        <TitleStyle style={{ paddingTop: '0.5rem' }}>
          상의&nbsp;&nbsp;
          <img
            className="tshirts"
            alt="tshirts"
            src="/icon/tshirts.png"
            style={{ position: 'relative', height: '1.5rem' }}
          />
        </TitleStyle>
        <ItemBlock>
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
        </ItemBlock>
      </RowBlock>
      <RowBlock style={{ borderBottom: '1px solid #e2f6ef' }}>
        <TitleStyle style={{ paddingTop: '0.5rem' }}>
          하의&nbsp;&nbsp;
          <img
            className="shorts"
            alt="shorts"
            src="/icon/shorts.png"
            style={{ position: 'relative', height: '1.5rem' }}
          />
        </TitleStyle>
        <ItemBlock>
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
        </ItemBlock>
      </RowBlock>
    </StoreBlock>
  );
};

export default StoreNew;
