import styled, { css } from 'styled-components';
import palette from '../../lib/styles/palette';
import { withRouter } from 'react-router-dom';

const StyledButton = styled.button`
  border: none;
  border-radius: 4px;
  font-size: 1.25rem;
  font-weight: bold;
  height: 10rem;
  width: 10rem;
  margin: 1rem;
  padding: 0.25rem 1rem;
  color: white;
  outline: none;
  cursor: pointer;
  align-items: center;

  background: ${palette.gray[9]};
  &:hover {
    background: ${palette.gray[7]};
  }

  ${(props) =>
    props.fullWidth &&
    css`
      padding-top: 0.75rem;
      padding-bottom: 0.75rem;
      width: 100%;
      font-size: 1.125rem;
    `}

  ${(props) =>
    props.indigo &&
    css`
      background: ${palette.indigo[9]};
      &:hover {
        background: ${palette.indigo[7]};
      }
    `}
`;
const BigButton = ({ to, history, ...rest }) => {
  const onClick = (e) => {
    if (to) {
      //to page로 이동
      history.push(to);
    }
    if (rest.onClick) {
      rest.onClick(e);
    }
  };
  return <StyledButton {...rest} onClick={onClick} />;
};

export default withRouter(BigButton);
