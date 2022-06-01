import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  initializeForm,
  changeField,
  teacherRegister,
} from '../../modules/auth';
import { initializeAuth } from '../../modules/auth';
import AuthForm from '../../components/auth/AuthForm';
//import user, { check } from '../../modules/user';
import { useHistory } from 'react-router-dom';
import { teacher_register } from '../../lib/api/auth';

const TeacherRegisterForm = () => {
  const [error, setError] = useState(null);
  //const [success, setSuccess] = useState(false);

  const dispatch = useDispatch();
  const history = useHistory();
  const { form, auth, authError } = useSelector(({ auth }) => ({
    form: auth.teacher_register,
    auth: auth.auth,
    authError: auth.authError,
  }));

  // input event handler
  const onChange = (e) => {
    const { value, name } = e.target;
    dispatch(
      changeField({
        form: 'teacher_register',
        key: name,
        value,
      }),
    );
  };

  // 폼 등록 event handler
  const onSubmit = (e) => {
    e.preventDefault();
    const { id, name, password, passwordConfirm } = form;
    // 빈 칸이 있을 때
    if ([id, name, password, passwordConfirm].includes('')) {
      setError('빈 칸을 모두 입력하시오.');
      return;
    }
    // 비밀번호가 일치하지 않을 때
    if (password !== passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.');
      dispatch(
        changeField({ form: 'teacher_register', key: 'password', value: '' }),
      );
      dispatch(
        changeField({
          form: 'teacher_register',
          key: 'passwordConfirm',
          value: '',
        }),
      );
      return;
    }
    dispatch(teacherRegister({ id, name, password }));
  };

  // 처음 렌더링될 때 form 초기화
  useEffect(() => {
    dispatch(initializeForm('teacher_register'));
  }, [dispatch]);

  // 회원가입 성공 / 실패 처리
  useEffect(() => {
    if (authError) {
      if (authError.response.status === 422) {
        setError('이미 존재하는 아이디입니다.');
        return;
      }
      setError('회원가입 실패');
      return;
    }
    if (auth) {
      console.log('회원가입 성공');
      console.log(auth);
      //setSuccess(true);
      alert('회원가입 성공');
      const { id, name, password, passwordConfirm } = form;
      console.log(id, password);
      try {
        localStorage.setItem('teacher_id', id);
        localStorage.setItem('teacher_password', password);
      } catch (err) {
        console.log(err);
      }
      dispatch(initializeAuth());
      history.push('/teacher/ClassGenerationPage');
    }
  }, [auth, authError, history, dispatch]);

  return (
    <AuthForm
      type="teacher_register"
      form={form}
      onChange={onChange}
      onSubmit={onSubmit}
      error={error}
    />
  );
};

export default TeacherRegisterForm;
