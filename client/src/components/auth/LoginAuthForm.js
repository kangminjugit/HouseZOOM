import React from 'react';
import styled from 'styled-components';
import palette from '../../lib/styles/palette';
import Button from '../common/Button';

const ErrorMessage = styled.div`
  color: red;
  text-align: center;
  font-size: 0.875rem;
  margin-top: 1rem;
`;

const AuthFormBlock = styled.div`
  h2 {
    margin: 0;
    color: ${palette.gray[8]};
    font-family: 'Pretendard Bold';
    font-size: 1.6rem;

    margin-bottom: 2rem;
    text-align: center;
    font-weight: bold;
  }
`;
// input styling
const StyledInput = styled.input`
  height: 3rem;
  width: 100%;

  border: none;
  outline: none;
  border-bottom: 1px solid ${palette.mint[4]};
  border-radius: 4px;

  font-size: 1rem;
  padding-inline-start: 1rem;

  &:focus {
    border-bottom: 1px solid ${palette.mint[2]};
  }

  & + & {
    margin-top: 1rem;
  }
`;

// button
const ButtonWithMarginTop = styled(Button)`
  margin-top: 1rem;
`;

const LoginAuthForm = ({ type, form, onChange, onSubmit, error }) => {
  return (
    <AuthFormBlock>
      <h2>{type}</h2>
      <form onSubmit={onSubmit}>
        <StyledInput
          autoComplete="id"
          name="id"
          placeholder="아이디"
          onChange={onChange}
          value={form.id}
        />
        <StyledInput
          autoComplete="new-password"
          name="password"
          placeholder="비밀번호"
          type="password"
          onChange={onChange}
          value={form.password}
        />
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <ButtonWithMarginTop indigo fullWidth>
          확인
        </ButtonWithMarginTop>
      </form>
    </AuthFormBlock>
  );
};

export default LoginAuthForm;
