import { createAction, handleActions } from 'redux-actions';
import produce from 'immer';

import { takeLatest } from 'redux-saga/effects';
import createRequestSaga from '../lib/createRequestSaga';
import { createRequestActionTypes } from '../lib/createRequestSaga';
import * as authAPI from '../lib/api/auth';

/* 액션 정의 */
const CHANGE_FIELD = 'auth/CHANGE_FIELD';
const INITIALIZE_FORM = 'auth/INITIALIZE_FORM';
const INITIALIZE_AUTH = 'auth/INITIALIZE_AUTH';

const [STUDENT_REGISTER, STUDENT_REGISTER_SUCCESS, STUDENT_REGISTER_FAILURE] =
  createRequestActionTypes('auth/STUDENT_REGISTER');
const [TEACHER_REGISTER, TEACHER_REGISTER_SUCCESS, TEACHER_REGISTER_FAILURE] =
  createRequestActionTypes('auth/TEACHER_REGISTER');
const [LOGIN, LOGIN_SUCCESS, LOGIN_FAILURE] =
  createRequestActionTypes('auth/LOGIN');
const [STUDENT_LOGIN, STUDENT_LOGIN_SUCCESS, STUDENT_LOGIN_FAILURE] =
  createRequestActionTypes('auth/STUDENT_LOGIN');
const [TEACHER_LOGIN, TEACHER_LOGIN_SUCCESS, TEACHER_LOGIN_FAILURE] =
  createRequestActionTypes('auth/TEACHER_LOGIN');

/* 액션 생성 함수 */
export const changeField = createAction(
  CHANGE_FIELD,
  ({ form, key, value }) => ({ form, key, value }),
);
// form : student_register, teacher_register, student_login, teacher_login
// key : id, name, password, passwordConfirm, class_id, auth_code
// value : 실제 바꾸려는 값

export const initializeForm = createAction(INITIALIZE_FORM, (form) => form);
export const initializeAuth = createAction(INITIALIZE_AUTH);

export const studentRegister = createAction(
  STUDENT_REGISTER,
  ({ id, name, password, class_id, auth_code }) => ({
    id,
    name,
    password,
    class_id,
    auth_code,
  }),
);
export const teacherRegister = createAction(
  TEACHER_REGISTER,
  ({ id, name, password }) => ({ id, name, password }),
);
export const login = createAction(LOGIN, ({ id, password }) => ({
  id,
  password,
}));
export const studentLogin = createAction(STUDENT_LOGIN, ({ id, password }) => ({
  id,
  password,
}));
export const teacherLogin = createAction(TEACHER_LOGIN, ({ id, password }) => ({
  id,
  password,
}));

/* 사가 생성 */
const student_registerSaga = createRequestSaga(
  STUDENT_REGISTER,
  authAPI.student_register,
);
const teacher_registerSaga = createRequestSaga(
  TEACHER_REGISTER,
  authAPI.teacher_register,
);
const loginSaga = createRequestSaga(LOGIN, authAPI.login);
const student_loginSaga = createRequestSaga(
  STUDENT_LOGIN,
  authAPI.student_login,
);
const teacher_loginSaga = createRequestSaga(
  TEACHER_LOGIN,
  authAPI.teacher_login,
);

export function* authSaga() {
  yield takeLatest(STUDENT_REGISTER, student_registerSaga);
  yield takeLatest(TEACHER_REGISTER, teacher_registerSaga);
  yield takeLatest(LOGIN, loginSaga);
  yield takeLatest(STUDENT_LOGIN, student_loginSaga);
  yield takeLatest(TEACHER_LOGIN, teacher_loginSaga);
}

/* 초기상태 */
const initialState = {
  student_register: {
    id: '',
    name: '',
    password: '',
    passwordConfirm: '',
    class_id: '',
    auth_code: '',
  },
  teacher_register: {
    id: '',
    name: '',
    password: '',
    passwordConfirm: '',
  },
  login: {
    id: '',
    password: '',
  },
  student_login: {
    id: '',
    password: '',
  },
  teacher_login: {
    id: '',
    password: '',
  },
  auth: null,
  authError: null,
};

const auth = handleActions(
  {
    // input 변화
    [CHANGE_FIELD]: (state, { payload: { form, key, value } }) =>
      produce(state, (draft) => {
        draft[form][key] = value;
      }),
    // login or register
    [INITIALIZE_FORM]: (state, { payload: form }) => ({
      ...state,
      [form]: initialState[form],
      auth: null,
      authError: null,
    }),
    [INITIALIZE_AUTH]: (state, { payload: auth }) => ({
      ...state,
      auth: null,
    }),
    // 학생 회원가입 성공
    [STUDENT_REGISTER_SUCCESS]: (state, { payload: auth }) => ({
      ...state,
      authError: null,
      auth,
    }),
    // 학생 회원가입 실패
    [STUDENT_REGISTER_FAILURE]: (state, { payload: error }) => ({
      ...state,
      authError: error,
    }),
    // 선생님 회원가입 성공
    [TEACHER_REGISTER_SUCCESS]: (state, { payload: auth }) => ({
      ...state,
      authError: null,
      auth,
    }),
    // 선생님 회원가입 실패
    [TEACHER_REGISTER_FAILURE]: (state, { payload: error }) => ({
      ...state,
      authError: error,
    }),
    // 로그인 성공
    [LOGIN_SUCCESS]: (state, { payload: auth }) => ({
      ...state,
      authError: null,
      auth,
    }),
    // 로그인 실패
    [LOGIN_FAILURE]: (state, { payload: error }) => ({
      ...state,
      authError: error,
    }),
    // 학생 로그인 성공
    [STUDENT_LOGIN_SUCCESS]: (state, { payload: auth }) => ({
      ...state,
      authError: null,
      auth,
    }),
    // 학생 로그인 실패
    [STUDENT_LOGIN_FAILURE]: (state, { payload: error }) => ({
      ...state,
      authError: error,
    }),
    // 선생님 로그인 성공
    [TEACHER_LOGIN_SUCCESS]: (state, { payload: auth }) => ({
      ...state,
      authError: null,
      auth,
    }),
    // 선생님 로그인 실패
    [TEACHER_LOGIN_FAILURE]: (state, { payload: error }) => ({
      ...state,
      authError: error,
    }),
  },
  initialState,
);

export default auth;
