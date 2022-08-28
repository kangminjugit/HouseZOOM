import React from 'react';
import styled, { css } from 'styled-components';
import palette from '../../lib/styles/palette';
import Button from '../common/Button';
import { Link } from 'react-router-dom';

const HeaderBlock = styled.div`
  // 가운데 정렬
  display: flex;
  align-items: center;
  justify-content: center;
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

const LinkStyle = styled.div`
  margin-left: 3rem;
  height: 4rem;

  // 정렬
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: ${palette.mint[0]};
  }

  ${(props) =>
    props.mint &&
    css`
      color: ${palette.mint[0]};
    `}
`;

const LogoutStyle = styled.div`
  width: 10rem;
  height: 4rem;
  color: ${palette.gray[6]};

  // 정렬
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StudentHeader = ({ type }) => {
  return (
    <HeaderBlock>
      <HeaderStyle>
        <LeftStyle>
          <LogoStyle>
            <img className="logo" alt="집zoom" src="/icon/logo_new.png" />
          </LogoStyle>
          {type === '마이페이지' ? (
            <LinkStyle mint>
              <Link to="/studentMyPage" className="link">
                마이페이지
              </Link>
            </LinkStyle>
          ) : (
            <LinkStyle>
              <Link to="/studentMyPage" className="link">
                마이페이지
              </Link>
            </LinkStyle>
          )}
          {type === '나의 캐릭터' ? (
            <LinkStyle mint>
              <Link to="/student/CharPage" className="link">
                나의 캐릭터
              </Link>
            </LinkStyle>
          ) : (
            <LinkStyle>
              <Link to="/student/CharPage" className="link">
                나의 캐릭터
              </Link>
            </LinkStyle>
          )}
          {type === '캐릭터 상점' ? (
            <LinkStyle mint>
              <Link to="/student/StorePage" className="link">
                캐릭터 상점
              </Link>
            </LinkStyle>
          ) : (
            <LinkStyle>
              <Link to="/student/StorePage" className="link">
                캐릭터 상점
              </Link>
            </LinkStyle>
          )}
          {type === '우리반 페이지' ? (
            <LinkStyle mint>
              <Link to="/ClassCharPage" className="link">
                우리반 페이지
              </Link>
            </LinkStyle>
          ) : (
            <LinkStyle>
              <Link to="/ClassCharPage" className="link">
                우리반 페이지
              </Link>
            </LinkStyle>
          )}
        </LeftStyle>
        <LogoutStyle>
          <Button logout_student>
            <img
              alt="logout"
              src="/icon/nav_log-in.png"
              style={{ width: '1rem', marginRight: '0.5rem' }}
            />
            로그아웃
          </Button>
        </LogoutStyle>
      </HeaderStyle>
    </HeaderBlock>
  );
};

export default StudentHeader;
