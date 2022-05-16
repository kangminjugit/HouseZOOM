import styled, { css } from 'styled-components';
import palette from '../../lib/styles/palette';
import { withRouter } from 'react-router-dom';
import { setUser } from '../../modules/user';
import { useDispatch } from 'react-redux';
import { initializeForm } from '../../modules/auth';

const StyledButton = styled.button`
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: bold;
  padding: 0.25rem 1rem;
  color: white;
  outline: none;
  cursor: pointer;

  background: ${palette.gray[9]};
  &:hover {
    background: ${palette.gray[7]};
  }

  ${(props) =>
    props.fullWidth &&
    css`
      padding-top: 0.75rem;
      padding-bottom: 0.75rem;
      width: 100%;
      font-size: 1.125rem;
    `}

  ${(props) =>
    props.indigo &&
    css`
      background: ${palette.indigo[9]};
      &:hover {
        background: ${palette.indigo[7]};
      }
    `}
`;

const Button = ({ logout_student, logout_teacher, to, history, ...rest }) => {
  const dispatch = useDispatch();

  const onClick = (e) => {
    if (to) {
      //to page로 이동
      history.push(to);
    }
    if (logout_teacher) {
      try {
        //localStorage.removeItem('teacher_user');
        localStorage.clear();
        dispatch(setUser(null));
        dispatch(initializeForm('teacher_login'));
      } catch (e) {
        console.log(e);
      }
      history.push('/');
    }
    if (logout_student) {
      try {
        //localStorage.removeItem('classId');
        //localStorage.removeItem('student_user');
        localStorage.clear();
        dispatch(setUser(null));
        dispatch(initializeForm('student_login'));
      } catch (e) {
        console.log(e);
      }
      history.push('/');
    }
    if (rest.onClick) {
      rest.onClick(e);
    }
  };
  return <StyledButton {...rest} onClick={onClick} />;
};

export default withRouter(Button);
