import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import palette from '../../../lib/styles/palette';

const StyledButton = styled.button`
  width: 75px;
  height: 75px;
  border-radius: 10px;
  .img {
    height: 100%;
    width: 100%;
    object-fit: contain;
  }
  margin: 0.5rem;

  ${(props) =>
    props.indigo &&
    css`
      background: ${palette.indigo[2]};
    `}
`;

const ItemButton = ({ url }) => {
  const [toggle, setToggle] = useState(false);

  const handleClick = (e) => {
    console.log('Clicked');
    setToggle(!toggle);
  };

  return (
    // <StyledButton onClick={handleClick}>
    //   <img className="img" alt="button" src={url} />
    // </StyledButton>
    toggle ? (
      <StyledButton indigo onClick={handleClick}>
        <img className="img" alt="button" src={url} />
      </StyledButton>
    ) : (
      <StyledButton onClick={handleClick}>
        <img className="img" alt="button" src={url} />
      </StyledButton>
    )
  );
};

export default ItemButton;
