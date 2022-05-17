import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import palette from '../../lib/styles/palette';
import Button from '../common/Button';

const StyledLink = styled.div`
  color: ${palette.gray[7]};
  .link {
    font-size: 1rem;
    font-weight: bold;
    padding: 1.5rem;
  }
`;

const HeaderLink = ({ type }) => {
  return (
    <div>
      {type === 'student' && (
        <StyledLink>
          <Link to="/studentMyPage" className="link">
            마이페이지
          </Link>
          <Link to="/student/CharPage" className="link">
            나의 캐릭터
          </Link>
          <Link to="/student/StorePage" className="link">
            캐릭터 상점
          </Link>
          <Link to="/studentMyPage" className="link">
            우리반 페이지
          </Link>
          <Button indigo logout_student>
            로그아웃
          </Button>
        </StyledLink>
      )}
      {type === 'teacher' && (
        <StyledLink>
          <Link to="/teacherMyPage" className="link">
            마이페이지
          </Link>
          <Link to="/teacher/ClassGenerationPage" className="link">
            반 생성하기
          </Link>
          <Link to="/teacher/ManageStudentPage" className="link">
            학생 관리
          </Link>
          {/* <Link to="/teacherMyPage" className="link">
            수업 관리
          </Link> */}
          <Link to="/teacherMyPage" className="link">
            우리반 페이지
          </Link>
          <Button indigo logout_teacher>
            로그아웃
          </Button>
        </StyledLink>
      )}
    </div>
  );
};

export default HeaderLink;
