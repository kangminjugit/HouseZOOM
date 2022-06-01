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
  const classId = localStorage.getItem('classId');

  const history = useHistory();

  if (teacher_user && classId) {
    history.push('/teacherMyPage');
  } else if (student_user) {
    history.push('/studentMyPage');
  } else {
    return (
      <>
        <Header type="landing" />
        <LandingTemplateBlock>
          <BigButton
            indigo
            to="/studentLogin"
            url="/icon/free-icon-student-257651.png"
            type="학생"
          />
          <BigButton
            indigo
            to="/teacherLogin"
            url="/icon/free-icon-teacher-1995574.png"
            type="선생님"
          />
        </LandingTemplateBlock>
      </>
    );
  }
};

export default LandingPage;
