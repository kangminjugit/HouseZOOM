// api 함수 작성
import client from './client';

export const login = ({ id, password }) =>
  client.post('/api/login/teacher', { id, password });

// 학생 로그인
export const student_login = ({ id, password }) =>
  client.post('/api/login/student', { id, password });

// 선생님 로그인
export const teacher_login = ({ id, password }) =>
  client.post('/api/login/teacher', { id, password });

// 학생 회원가입
export const student_register = ({ id, name, password, class_id, auth_code }) =>
  client.post('/api/register/student', {
    id,
    name,
    password,
    class_id,
    auth_code,
  });

// 선생님 회원가입
export const teacher_register = ({ id, name, password }) =>
  client.post('/api/register/teacher', {
    id,
    name,
    password,
  });

// 로그인 상태 확인
//export const check = () => client.get('/api/auth/check');
