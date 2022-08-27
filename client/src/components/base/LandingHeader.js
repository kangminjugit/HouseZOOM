import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import palette from '../../lib/styles/palette';

const HeaderBlock = styled.div`
  // 가운데 정렬
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
`;

const HeaderStyle = styled.div`
  width: 80rem;
  height: 4rem;
  box-shadow: 0px 0px 10px rgba(51, 51, 51, 0.15);
  border-bottom-right-radius: 1.5rem;
  border-bottom-left-radius: 1.5rem;
  font-family: 'Pretendard Bold';

  display: flex;
  align-items: row;
  justify-content: space-between;
`;

const LeftStyle = styled.div`
  display: flex;
  justify-content: space-between;
  color: ${palette.gray[8]};
`;

const LogoStyle = styled.div`
  margin-left: 3rem;
  width: 10rem;

  // 정렬
  display: flex;
  align-items: center;
  justify-content: center;
  .logo {
    height: 2.5rem;
  }
`;

const LogoutStyle = styled.div`
  width: 10rem;
  height: 4rem;
  color: ${palette.gray[6]};

  // 정렬
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: ${palette.mint[0]};
  }
`;

const LandingHeader = ({ type }) => {
  return (
    <HeaderBlock>
      <HeaderStyle>
        <LeftStyle>
          <LogoStyle>
            <Link to="/">
              <img className="logo" alt="집zoom" src="/icon/logo_new.png" />
            </Link>
          </LogoStyle>
        </LeftStyle>
        <LogoutStyle>
          {type === 'student_login' && (
            <Link to="/studentRegister">학생 회원가입</Link>
          )}
          {type === 'teacher_login' && (
            <Link to="/teacherRegister">선생님 회원가입</Link>
          )}
          {type === 'student_register' && (
            <Link to="/studentLogin">학생 로그인</Link>
          )}
          {type === 'teacher_register' && (
            <Link to="/teacherLogin">선생님 로그인</Link>
          )}
        </LogoutStyle>
      </HeaderStyle>
    </HeaderBlock>
  );
};

export default LandingHeader;
