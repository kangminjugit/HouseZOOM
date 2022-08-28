import React from 'react';
import styled from 'styled-components';
import palette from '../../lib/styles/palette';
import Button from '../common/Button';

const textMap = {
  student_login: '학생 로그인',
  teacher_login: '선생님 로그인',
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
        {type !== 'student_login ' && type !== 'teacher_login' && (
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
        {type !== 'student_login ' && type !== 'teacher_login' && (
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
