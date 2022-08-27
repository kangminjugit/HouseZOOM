import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
//import { Link } from 'react-router-dom';
import palette from '../../lib/styles/palette';
import Character from '../student/char/Character';
import client from '../../axiosConfig';
import TimeTableNew from './TimeTable_new';

// 화면 전체 style
const MyPageTemplateBlock = styled.div`
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
  height: 650px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`;
const TopBlock = styled.div`
  width: 100%;
  height: 150px;
  border-radius: 0.25rem;
  background-color: ${palette.background[1]};
  box-shadow: 0px 0px 10px rgba(51, 51, 51, 0.1);

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`;

const BottomBlock = styled.div`
  width: 100%;
  height: 450px;
  border-radius: 0.25rem;
  background-color: ${palette.background[1]};
  box-shadow: 0px 0px 4px rgba(51, 51, 51, 0.1);
`;

const RightBlock = styled.div`
  margin-inline-start: 5rem;
  width: 800px;
  height: 650px;
  border-radius: 0.25rem;
  background-color: ${palette.background[1]};
  box-shadow: 0px 0px 10px rgba(51, 51, 51, 0.1);
`;

const TitleBlock = styled.div`
  font-family: 'Pretendard Bold';
  font-size: 1.25rem;
  text-align: center;
  // 정렬
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  margin-top: 1rem;
  margin-bottom: 1rem;
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
      <LeftBlock>
        <TopBlock>
          <TitleBlock>
            현재 포인트
            <img
              className="edamame"
              alt="edamame"
              src="/icon/edamame.png"
              style={{ position: 'relative', height: '1.5rem' }}
            />
          </TitleBlock>
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span
              style={{
                fontFamily: 'Pretendard ExtraBold',
                fontSize: '1.4rem',
                color: palette.mint[0],
              }}
            >
              {point}&nbsp;
            </span>
            콩
          </div>
        </TopBlock>
        <BottomBlock>
          <TitleBlock>
            나의 캐릭터&nbsp;
            <img
              className="character"
              alt="character"
              src="/icon/character.png"
              style={{ position: 'relative', height: '1.5rem' }}
            />
          </TitleBlock>
          <div style={{ position: 'relative' }}>
            <Character />
          </div>
        </BottomBlock>
      </LeftBlock>
      <RightBlock>
        <TitleBlock>
          시간표&nbsp;
          <img
            className="timetable"
            alt="timetable"
            src="/icon/calendar.png"
            style={{ position: 'relative', height: '1.5rem' }}
          />
        </TitleBlock>
        <div
          style={{
            display: 'flex',
            marginTop: '2rem',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <TimeTableNew />
        </div>
      </RightBlock>
    </MyPageTemplateBlock>
  );
};

export default StudentMyPageTemplate;
