import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { initializeForm, changeField, teacherLogin } from '../../modules/auth';
import AuthForm from '../../components/auth/AuthForm';
import { setUser } from '../../modules/user';
import { useHistory } from 'react-router-dom';

const TeacherLoginForm = () => {
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const history = useHistory();

  const { form, auth, authError, user_token } = useSelector(
    ({ auth, user }) => ({
      form: auth.teacher_login,
      auth: auth.auth,
      authError: auth.authError,
      user_token: user.user_token,
    }),
  );

  // input event handler
  const onChange = (e) => {
    const { value, name } = e.target;
    dispatch(
      changeField({
        form: 'teacher_login',
        key: name,
        value,
      }),
    );
  };

  // form 등록 event handler
  const onSubmit = (e) => {
    e.preventDefault();
    const { id, password } = form;
    dispatch(teacherLogin({ id, password }));
  };

  // 처음 렌더링될 때 form 초기화
  useEffect(() => {
    dispatch(initializeForm('teacher_login'));
  }, [dispatch]);

  // 에러 처리
  useEffect(() => {
    if (authError) {
      if (authError.response.status === 400) {
        setError('빈칸을 채우세요!');
        return;
      }
      if (authError.response.status === 401) {
        setError('아이디가 없거나 비밀번호가 틀렸습니다.');
        dispatch(initializeForm('teacher_login'));
        return;
      }
      console.log('오류 발생');
      console.log(authError);
      setError('로그인 실패');
      return;
    }
    if (auth) {
      console.log('로그인 성공');
      localStorage.setItem('classId', JSON.stringify(auth.data.classId[0]));
      dispatch(setUser(auth.data.accessToken));
    }
  }, [auth, authError, dispatch]);

  //  로그인 성공하면 mypage로 이동
  useEffect(() => {
    //console.log(user_token);
    if (user_token) {
      history.push('/teacherMyPage');
      try {
        localStorage.setItem('teacher_user', JSON.stringify(user_token));
      } catch (e) {
        console.log('ERROR');
      }
    }
  }, [history, user_token]);

  return (
    <AuthForm
      type="login"
      form={form}
      onChange={onChange}
      onSubmit={onSubmit}
      error={error}
    />
  );
};

export default TeacherLoginForm;
