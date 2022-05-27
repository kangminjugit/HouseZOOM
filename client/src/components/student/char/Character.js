import styled, { css } from 'styled-components';
import React, { useEffect, useState } from 'react';
// import axios from 'axios';
import client from '../../../axiosConfig';

const null_arr = [''];

const Character = () => {
  const [myitems, setMyitems] = useState(null);
  const [loading, setLoading] = useState(null);

  //토큰
  const token = JSON.parse(localStorage.getItem('student_user'));
  const accessClient = client.create({
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const url = 'http://3.35.141.211:3000/api/avatar/cur-item?';
      accessClient
        .get(url)
        .then(function (response) {
          console.log(response);
          setMyitems(response.data.data.items);
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
  if (!myitems) return setMyitems(null_arr);

  return (
    <div>
      <img
        style={{ position: 'absolute', zIndex: '1', top: '100px', left: '0px' }}
        alt="body"
        src="https://housezoombucket.s3.ap-northeast-2.amazonaws.com/1652194871637_avatar_body.png"
      />
      {myitems.map((item, index) => (
        <img
          style={{
            position: 'absolute',
            zIndex: '2',
            top: '100px',
            left: '0px',
          }}
          key={index}
          alt={item.type}
          src={item.image}
        />
      ))}
      {/* <img
        style={{ position: 'absolute', zIndex: '2', top: '100px', left: '0px' }}
        alt="hair"
        src="https://housezoombucket.s3.ap-northeast-2.amazonaws.com/1651027698618_IMG_3755.PNG"
      /> */}
    </div>
  );
};

export default Character;
