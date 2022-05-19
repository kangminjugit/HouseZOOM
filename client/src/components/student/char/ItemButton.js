import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import palette from '../../../lib/styles/palette';
import axios from 'axios';

const StyledButton = styled.button`
  width: 75px;
  height: 75px;
  border-radius: 10px;
  .img {
    height: 100%;
    width: 100%;
    object-fit: contain;
  }
  margin: 0.5rem;

  ${(props) =>
    props.indigo &&
    css`
      background: ${palette.indigo[2]};
    `}
`;

const ItemButton = ({ url, item_id, item_toggle }) => {
  // 토큰
  const token = JSON.parse(localStorage.getItem('student_user'));
  const accessClient = axios.create({
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  const [toggle, setToggle] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setToggle(item_toggle);
      setLoading(false);
      //console.log(toggle);
      console.log(typeof item_toggle, typeof toggle, typeof 1);
    };
    fetchData();
  }, []);

  if (loading) return <div>로딩중</div>;

  const handleClick = () => {
    console.log('Clicked');

    if (toggle === 0) {
      setToggle(1);
      console.log(toggle);
      const url = '/api/avatar/put-on?itemId=' + item_id;
      accessClient
        .post(url)
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });
    } else {
      setToggle(0);
      console.log(toggle);
      const url = '/api/avatar/take-off?itemId=' + item_id;
      accessClient
        .post(url)
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  };

  return toggle === 1 ? (
    <StyledButton indigo onClick={handleClick}>
      <img className="img" alt="button" src={url} />
    </StyledButton>
  ) : (
    <StyledButton onClick={handleClick}>
      <img className="img" alt="button" src={url} />
    </StyledButton>
  );
};

export default ItemButton;
