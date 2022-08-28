import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { initializeForm, changeField, studentLogin } from '../../modules/auth';
import AuthForm from '../../components/auth/AuthForm';
import { setUser } from '../../modules/user';
import { useHistory } from 'react-router-dom';
import LoginAuthForm from '../../components/auth/LoginAuthForm';

const StudentLoginForm = () => {
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const history = useHistory();

  const { form, auth, authError, user_token } = useSelector(
    ({ auth, user }) => ({
      form: auth.student_login,
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
        form: 'student_login',
        key: name,
        value,
      }),
    );
  };

  // form 등록 event handler
  const onSubmit = (e) => {
    e.preventDefault();
    const { id, password } = form;
    dispatch(studentLogin({ id, password }));
  };

  // 처음 랜더링될 떄 form 초기화
  useEffect(() => {
    dispatch(initializeForm('student_login'));
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
      console.log('로그인 성공 ');
      //console.log(auth.data.accessToken);
      //console.log(auth.data.classId);
      // local storage에 classID 정보 저장
      localStorage.setItem('classId', JSON.stringify(auth.data.classId)); // classId user에 넣기ㅠㅠ
      dispatch(setUser(auth.data.accessToken));
    }
  }, [auth, authError, dispatch]);

  // 로그인 성공하면 mypage로 이동
  useEffect(() => {
    if (user_token) {
      history.push('/studentMyPage');
      try {
        // localStorage에 user 저장
        localStorage.setItem('student_user', JSON.stringify(user_token));
      } catch (e) {
        console.log('ERROR');
      }
    }
  }, [history, user_token]);

  return (
    <LoginAuthForm
      type="학생 로그인"
      form={form}
      onChange={onChange}
      onSubmit={onSubmit}
      error={error}
    />
    // <AuthForm
    //   type="student_login"
    //   form={form}
    //   onChange={onChange}
    //   onSubmit={onSubmit}
    //   error={error}
    // />
  );
};

export default StudentLoginForm;
