import React from 'react';
import BigButton from '../components/landing/BigButton';
import Header from '../components/base/Header';
import styled from 'styled-components';
import palette from '../lib/styles/palette';

// 화면 전체 style
const StudentLandingTemplateBlock = styled.div`
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

const StudentLandingPage = () => {
  return (
    <>
      <Header type="landing" />
      <StudentLandingTemplateBlock>
        <BigButton indigo to="/studentLogin">
          로그인
        </BigButton>
        <BigButton indigo to="/studentRegister">
          학생 회원가입
        </BigButton>
      </StudentLandingTemplateBlock>
    </>
  );
};

export default StudentLandingPage;
