import styled, { css } from 'styled-components';
import React, { useEffect, useState } from 'react';
import client from '../../../axiosConfig';

const null_arr = [''];

const Character = () => {
  const [myitems, setMyitems] = useState();
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
      const url = '/api/avatar/cur-item?';
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
        style={{
          position: 'absolute',
          zIndex: '1',
          top: '1.5rem',
        }}
        alt="body"
        src="https://housezoombucket.s3.ap-northeast-2.amazonaws.com/1653650799828_IMG_3787.PNG"
      />
      {myitems.map((item, index) => (
        <img
          style={{
            position: 'absolute',
            zIndex: '2',
            top: '1.5rem',
          }}
          key={index}
          alt={item.type}
          src={item.image}
        />
      ))}
    </div>
  );
};

export default Character;
