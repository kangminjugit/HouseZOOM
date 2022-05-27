import styled, { css } from 'styled-components';
import palette from '../../lib/styles/palette';
import { withRouter } from 'react-router-dom';

const StyledButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  //border: none;
  border: 4px solid ${palette.gray[7]};
  border-radius: 10px;

  font-family: nanum;
  font-size: 1.5rem;
  font-weight: bold;
  height: 15rem;
  width: 15rem;
  margin: 1rem;
  padding: 0.25rem 1rem;

  color: black;
  //outline: none;
  //outline: solid 2px ${palette.gray[7]};
  cursor: pointer;

  background: ${palette.gray[9]};
  &:hover {
    background: ${palette.gray[7]};
  }

  .img {
    margin-top: 1rem;
    height: 100px;
    width: 100px;
    object-fit: contain;
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
      background: ${palette.gray[0]};

      &:hover {
        background: ${palette.mint[3]};
      }
    `}
`;
const BigButton = ({ to, url, type, history, ...rest }) => {
  const onClick = (e) => {
    if (to) {
      //to page로 이동
      history.push(to);
    }
    if (rest.onClick) {
      rest.onClick(e);
    }
  };
  return (
    <StyledButton {...rest} onClick={onClick}>
      <div>{type}</div>
      <img className="img" alt="img" src={url}></img>
    </StyledButton>
  );
};

export default withRouter(BigButton);
