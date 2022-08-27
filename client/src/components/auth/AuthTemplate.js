import styled from 'styled-components';
import palette from '../../lib/styles/palette';
import LandingHeader from '../base/LandingHeader';

// 화면 전체 style

const AuthTemplateBlock = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  width: 100%;
  height: 90%;
  //background: ${palette.gray[0]};
  font-family: 'Pretendard Regular';
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

// White Box
const WhiteBox = styled.div`
  /* box-shadow: 0 0 8px rgba(0, 0, 0, 0.025); */
  font-weight: bold;
  padding: 2rem;
  width: 30rem;
  border-radius: 15px;
`;

const AuthTemplate = ({ children }) => {
  return (
    <AuthTemplateBlock>
      <WhiteBox>{children}</WhiteBox>
    </AuthTemplateBlock>
  );
};

export default AuthTemplate;
