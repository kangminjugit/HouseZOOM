import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
//import { Link } from 'react-router-dom';
import palette from '../../lib/styles/palette';
import TimeTable from './TimeTable';
import Character from '../student/char/Character';
import client from '../../axiosConfig';

// 화면 전체 style
const MyPageTemplateBlock = styled.div`
  position: flex;
  left: 10px;
  right: 10px;
  top: 10px;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  //justify-content: center;
  align-items: center;
`;

const LeftBox = styled.div`
  padding: 4rem;
  flex-direction: column;
`;

const FirstBox = styled.div`
  margin: 2rem;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.025);
  width: 320px;
  height: 150px;
  background: ${palette.gray[0]};
  border-radius: 10px;
  text-align: center;
  font-weight: bold;
  font-size: 1.5rem;
  line-height: 150px;
  outline: solid 1px ${palette.gray[3]};
`;

const SecondBoxStudent = styled.div`
  position: relative;
  margin: 2rem;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.025);
  padding: 2rem;
  width: 320px;
  height: 450px;
  background: ${palette.gray[0]};
  font-weight: bold;
  font-size: 1.5rem;
  border-radius: 10px;
  flex-direction: column;
  outline: solid 1px ${palette.gray[3]};
  .img {
    height: 100%;
    width: 100%;
    object-fit: contain;
  }
`;

const SecondBoxTeacher = styled.div`
  margin: 2rem;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.025);
  padding: 2rem;
  width: 320px;
  height: 450px;
  //background: ${palette.gray[0]};
  font-weight: bold;
  font-size: 1.5rem;
  border-radius: 10px;
  //outline: solid 1px ${palette.gray[3]};
`;

const ThirdBox = styled.div`
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.025);
  padding: 2rem;
  width: 800px;
  height: 630px;
  background: ${palette.gray[0]};
  font-weight: bold;
  font-size: 1.5rem;
  border-radius: 10px;
  outline: solid 1px ${palette.gray[3]};
  .div {
    padding: 1rem;
  }
`;

const StudentMyPageTemplate = () => {
  const [point, setPoint] = useState();
  const [loading, setLoading] = useState(false);

  // 토큰
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
      accessClient
        .get('/api/point')
        .then(function (response) {
          console.log(response);
          setPoint(response.data.data.point);
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

  return (
    <MyPageTemplateBlock>
      <LeftBox>
        <FirstBox>현재 포인트 : {point}콩</FirstBox>
        <SecondBoxStudent>
          나의 캐릭터
          <Character />
        </SecondBoxStudent>
      </LeftBox>
      <ThirdBox>
        <div className="div">시간표</div>
        <TimeTable />
      </ThirdBox>
    </MyPageTemplateBlock>
  );
};

export default StudentMyPageTemplate;
