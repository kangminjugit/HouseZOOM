import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import palette from '../../lib/styles/palette';

const StyledButton = styled.button`
  width: 10px;
  height: 20px;
  border-radius: 10px;
  outline: 1px ${palette.gray[3]};
  ${(props) =>
    props.indigo &&
    css`
      background: ${palette.indigo[2]};
    `}
  ${(props) =>
    props.fullWidth &&
    css`
      width: 100%;
      font-size: 12px;
    `}
`;

const ToggleButton = ({ txt }) => {
  const [toggle, setToggle] = useState(false);
  const handleClick = (e) => {
    setToggle(!toggle);
  };
  return toggle ? (
    <StyledButton fullWidth indigo onClick={handleClick}>
      {txt}
    </StyledButton>
  ) : (
    <StyledButton fullWidth onClick={handleClick}>
      {txt}
    </StyledButton>
  );
};

export default ToggleButton;
