import React from 'react';
import BigButton from '../components/landing/BigButton';
import Header from '../components/base/Header';
import styled from 'styled-components';
import palette from '../lib/styles/palette';

// 화면 전체 style
const TeacherLandingTemplateBlock = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  //background: ${palette.gray[0]};
  display: flex;
  flex-direction: rows;
  justify-content: center;
  align-items: center;
`;

const TeacherLandingPage = () => {
  return (
    <>
      <Header type="landing" />
      <TeacherLandingTemplateBlock>
        <BigButton indigo to="/teacherLogin">
          로그인
        </BigButton>
        <BigButton indigo to="/teacherRegister">
          선생님 회원가입
        </BigButton>
      </TeacherLandingTemplateBlock>
    </>
  );
};

export default TeacherLandingPage;
