import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  initializeForm,
  changeField,
  studentRegister,
} from '../../modules/auth';
import AuthForm from '../../components/auth/AuthForm';

const StudentRegisterForm = () => {
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const { form, auth, authError } = useSelector(({ auth }) => ({
    form: auth.student_register,
    auth: auth.auth,
    authError: auth.authError,
  }));

  // input event handler
  const onChange = (e) => {
    const { value, name } = e.target;
    dispatch(
      changeField({
        form: 'student_register',
        key: name,
        value,
      }),
    );
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const { id, name, password, passwordConfirm, class_id, auth_code } = form;
    // 빈 칸이 있을 때
    if (
      [id, name, password, passwordConfirm, class_id, auth_code].includes('')
    ) {
      setError('빈 칸을 모두 입력하시오.');
      return;
    }
    // 비밀번호가 일치하지 않을 떄
    if (password !== passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.');
      dispatch(
        changeField({ form: 'student_register', key: 'password', value: '' }),
      );
      dispatch(
        changeField({
          form: 'student_register',
          key: 'passwordConfirm',
          value: '',
        }),
      );
      return;
    }
    dispatch(studentRegister({ id, name, password, class_id, auth_code }));
  };

  // 처음 렌더링될 때 form 초기화
  useEffect(() => {
    dispatch(initializeForm('student_register'));
  }, [dispatch]);

  // 회원가입 성공/실패 처리
  useEffect(() => {
    if (authError) {
      if (authError.response.status === 404) {
        setError('존재하지 않는 반입니다.');
        return;
      }
      if (authError.response.status === 405) {
        setError('인증코드를 다시 입력하세요!');
        return;
      }
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
    }
  }, [auth, authError, dispatch]);

  return (
    <AuthForm
      type="student_register"
      form={form}
      onChange={onChange}
      onSubmit={onSubmit}
      error={error}
    />
  );
};

export default StudentRegisterForm;
