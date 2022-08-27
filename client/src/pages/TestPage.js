import React from 'react';
import StudentHeader from '../components/base/StudentHeader';
import TeacherHeader from '../components/base/TeacherHeader';
import LandingHeader from '../components/base/LandingHeader';
import AuthForm from '../components/auth/AuthForm';
import Select from 'react-select';
import palette from '../lib/styles/palette';
import styled from 'styled-components';
import Character from '../components/student/char/Character';
import TimeTableNew from '../components/mypage/TimeTable_new';
import StudentTableNew from '../components/teacher/StudentTableNew';
import PostTimeTable from '../components/teacher/PostTimeTable';
import ClassCharNew from '../components/class/ClassCharNew';
import StoreNew from '../components/student/char/StoreNew';

const TestTemplateBlock = styled.div`
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
  width: 100%;
  height: 2rem;
  font-size: 1.25rem;
  text-align: center;

  // 정렬
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  margin-top: 1rem;
  margin-bottom: 1rem;
  /* background-color: bisque; */
`;

const TestPage = () => {
  return (
    <>
      <StudentHeader type="캐릭터 상점" />
      <StoreNew />
    </>
  );
};

export default TestPage;
