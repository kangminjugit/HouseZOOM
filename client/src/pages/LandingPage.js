import React from 'react';
import BigButton from '../components/landing/BigButton';
import Header from '../components/base/Header';
import styled from 'styled-components';
import palette from '../lib/styles/palette';
import { useHistory } from 'react-router-dom';

// 화면 전체 style
const LandingTemplateBlock = styled.div`
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

const LandingPage = () => {
  const teacher_user = localStorage.getItem('teacher_user');
  const student_user = localStorage.getItem('student_user');

  const history = useHistory();

  if (teacher_user) {
    history.push('/teacherMyPage');
  } else if (student_user) {
    history.push('/studentMyPage');
  } else {
    return (
      <>
        <Header type="landing" />
        <LandingTemplateBlock>
          <BigButton indigo to="/studentLanding">
            학생
          </BigButton>
          <BigButton indigo to="/teacherLanding">
            선생님
          </BigButton>
        </LandingTemplateBlock>
      </>
    );
  }
};

export default LandingPage;
