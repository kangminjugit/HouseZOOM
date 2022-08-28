import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import palette from '../../lib/styles/palette';

const StyledButton = styled.button`
  width: 10px;
  height: 20px;
  border-radius: 4px;
  outline: none;
  border: 1px solid ${palette.gray[7]};

  ${(props) =>
    props.fullWidth &&
    css`
      width: 100%;
      font-size: 12px;
    `}

  ${(props) =>
    props.indigo &&
    css`
      background: ${palette.mint[4]};

      &:hover {
        background: ${palette.mint[3]};
      }
    `}
`;

const ToggleButton = ({ txt, getToggle }) => {
  const [toggle, setToggle] = useState(false);

  const handleClick = (e) => {
    setToggle(!toggle);
    getToggle(!toggle);
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
