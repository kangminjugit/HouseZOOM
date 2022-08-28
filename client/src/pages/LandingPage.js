import React from 'react';
import BigButton from '../components/landing/BigButton';
import styled from 'styled-components';
import palette from '../lib/styles/palette';
import { useHistory, Link } from 'react-router-dom';

// 화면 전체 style
const LandingTemplateBlock = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const LogoBlock = styled.div`
  width: 15rem;
  margin-bottom: 1rem;

  // 정렬
  display: flex;
  align-items: center;
  justify-content: center;

  .img {
    width: 10rem;
  }
`;

const ButtonBlock = styled.div`
  display: flex;
  flex-direction: row;
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
        {/* <Header type="landing" /> */}

        <LandingTemplateBlock>
          <LogoBlock>
            <img className="img" alt="집zoom" src="/icon/logo_new.png" />
          </LogoBlock>
          <ButtonBlock>
            <BigButton
              indigo
              to="/studentLogin"
              url="/icon/free-icon-student-257651.png"
              type="학생 로그인"
            />
            <BigButton
              indigo
              to="/teacherLogin"
              url="/icon/free-icon-teacher-1995574.png"
              type="선생님 로그인"
            />
          </ButtonBlock>
          <div
            style={{
              fontSize: '10px',
              fontFamily: 'Pretendard Light',
              textDecoration: 'underline',
            }}
          >
            <Link to="/license">image from Flaticon</Link>
          </div>
        </LandingTemplateBlock>
      </>
    );
  }
};

export default LandingPage;
