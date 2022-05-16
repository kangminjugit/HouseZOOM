import { createAction, handleActions } from 'redux-actions';
//import axios from 'axios';

// 액션 타입 정의
const SET_USER = 'user/SET_USER';

// 액션 타입 반환하는 함수 만들기
export const setUser = createAction(SET_USER, (token) => token);

// 초기 상태 작성
const initialState = {
  user_token: null,
};

const user = handleActions(
  {
    [SET_USER]: (state, { payload: token }) => ({
      ...state,
      user_token: token,
    }),
  },
  initialState,
);

export default user;
