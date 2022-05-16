import React from 'react';
import styled from 'styled-components';
import palette from '../../lib/styles/palette';
import Button from '../common/Button';

const textMap = {
  login: '로그인',
  student_register: '학생 회원가입',
  teacher_register: '선생님 회원가입',
};

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
    margin-bottom: 1rem;
    text-align: center;
    font-weight: bold;
  }
`;
// input styling
const StyledInput = styled.input`
  font-size: 1rem;
  border: none;
  border-bottom: 1px solid ${palette.gray[5]};
  border-radius: 4px;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  outline: none;
  width: 100%;

  &:focus {
    color: $oc-teal-7;
    border-bottom: 1px solid ${palette.gray[7]};
  }

  & + & {
    margin-top: 1rem;
  }
`;

// button
const ButtonWithMarginTop = styled(Button)`
  margin-top: 1rem;
`;

const AuthForm = ({ type, form, onChange, onSubmit, error }) => {
  const text = textMap[type];
  return (
    <AuthFormBlock>
      <h2>{text}</h2>
      <form onSubmit={onSubmit}>
        <StyledInput
          autoComplete="id"
          name="id"
          placeholder="아이디"
          onChange={onChange}
          value={form.id}
        />
        {type !== 'login' && (
          <StyledInput
            autoComplete="name"
            name="name"
            placeholder="이름"
            onChange={onChange}
            value={form.name}
          />
        )}
        <StyledInput
          autoComplete="new-password"
          name="password"
          placeholder="비밀번호"
          type="password"
          onChange={onChange}
          value={form.password}
        />
        {type !== 'login' && (
          <StyledInput
            autoComplete="new-password"
            name="passwordConfirm"
            placeholder="비밀번호 확인"
            type="password"
            onChange={onChange}
            value={form.passwordConfirm}
          />
        )}
        {type === 'student_register' && (
          <StyledInput
            autoComplete="class_id"
            name="class_id"
            placeholder="학교/반 찾기"
            onChange={onChange}
            value={form.class_id}
          />
        )}
        {type === 'student_register' && (
          <StyledInput
            autoComplete="auth_code"
            name="auth_code"
            placeholder="인증코드"
            type="password"
            onChange={onChange}
            value={form.auth_code}
          />
        )}
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <ButtonWithMarginTop indigo fullWidth>
          확인
        </ButtonWithMarginTop>
      </form>
    </AuthFormBlock>
  );
};

export default AuthForm;
