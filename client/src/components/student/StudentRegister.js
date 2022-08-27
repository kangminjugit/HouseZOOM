import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import palette from '../../lib/styles/palette';
import Button from '../common/Button';
// import axios from 'axios';
import client from '../../axiosConfig';
import { useHistory } from 'react-router-dom';
import Select from 'react-select';

const years = [
  { label: 1, value: 1 },
  { label: 2, value: 2 },
  { label: 3, value: 3 },
  { label: 4, value: 4 },
  { label: 5, value: 5 },
  { label: 6, value: 6 },
];
const cityList = [
  { label: '강원도', value: 1 },
  { label: '경기도', value: 2 },
  { label: '경상남도', value: 3 },
  { label: '경상북도', value: 4 },
  { label: '광주광역시', value: 5 },
  { label: '대구광역시', value: 6 },
  { label: '대전광역시', value: 7 },
  { label: '부산광역시', value: 8 },
  { label: '서울특별시', value: 9 },
  { label: '세종특별자치시', value: 10 },
  { label: '울산광역시', value: 11 },
  { label: '인천광역시', value: 12 },
  { label: '전라남도', value: 13 },
  { label: '전라북도', value: 14 },
  { label: '제주특별자치도', value: 15 },
  { label: '충청남도', value: 16 },
  { label: '충청북도', value: 17 },
];
const customStyles = {
  option: (provided, state) => ({
    ...provided,
    fontFamily: 'Pretendard Regular',
    borderBottom: '1px solid #dee2e6',
    backgroundColor: state.isFocused && palette.mint[3],
    color: state.isSelected ? palette.gray[9] : palette.gray[6],
  }),

  control: (provide, state) => ({
    ...provide,

    fontFamily: 'Pretendard Regular',
    width: state.selectProps.width,
    height: '3rem',
    // This line disable the blue border
    border: state.isFocused ? 0 : 0,
    boxShadow: state.isFocused ? 0 : 0,
    '&:hover': {
      border: state.isFocused ? 0 : 0,
    },
    borderBottom: state.isFocused ? '1px solid  #84dac2' : '1px solid #c4ede0',
  }),

  singleValue: (provided, state) => {
    const opacity = state.isDisabled ? 0.5 : 1;
    const transition = 'opacity 300ms';

    return { ...provided, opacity, transition };
  },
};

const ErrorMessage = styled.div`
  color: red;
  text-align: center;
  font-size: 0.875rem;
  margin-top: 1rem;
`;

const StyledSelect = styled.div`
  // 정렬
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
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

const StudentRegister = () => {
  const history = useHistory();

  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [authcode, setAuthcode] = useState();

  const [city, setCity] = useState(null);
  const [schoolList, setSchoolList] = useState([]);
  const [schoolName, setSchoolName] = useState();
  const [grade, setGrade] = useState('');
  const [classList, setclassList] = useState();
  const [classId, setClassId] = useState();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // event handler
  const handleChange_id = (e) => {
    const { value } = e.target;
    setId(value);
  };
  const handleChange_name = (e) => {
    const { value } = e.target;
    setName(value);
  };
  const handleChange_password = (e) => {
    const { value } = e.target;
    setPassword(value);
  };
  const handleChange_passwordConfirm = (e) => {
    const { value } = e.target;
    setPasswordConfirm(value);
  };
  const handleChangeSelect_city = (e) => {
    setCity(e.label);
  };
  const handleChangeSelect_school = (e) => {
    setSchoolName(e.value);
  };
  const handleChangeSelect_year = (e) => {
    setGrade(e.value);
  };
  const handleChangeSelect_class = (e) => {
    setClassId(e.value);
  };
  const handleChange_authcode = (e) => {
    const { value } = e.target;
    setAuthcode(value);
  };

  // 도시에 있는 학교 리스트 만들기
  const create_school_list = (arr) => {
    const schools = [];
    for (let i = 0; i < arr.length; i++) {
      const school = { label: arr[i].school_name, value: arr[i].school_code };
      schools.push(school);
    }
    return schools;
  };

  // 특정 학교, 학년에 대한 반 리스트 만들기
  const create_class_list = (arr) => {
    const classes = [];

    for (let i = 0; i < arr.length; i++) {
      const temp = { label: arr[i].name, value: arr[i].id };
      classes.push(temp);
    }
    return classes;
  };

  const handleClick_class_id = (e) => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const url = '/api/class?school_code=' + schoolName + '&year=' + grade;
        const response = await client.get(url);
        setclassList(create_class_list(response.data.data.class_list));
      } catch (e) {
        console.log(e);
      }
      setLoading(false);
    };
    fetchData();
  };

  // 도시에 있는 학교 리스트 서버에서 가져오기
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await client.get('/api/school/location', {
          params: {
            school_location: city,
          },
        });
        setSchoolList(create_school_list(response.data.data.school_list));
      } catch (e) {
        console.log(e);
      }
      setLoading(false);
    };
    if (city) {
      fetchData();
    }
  }, [city]);

  const handleClick_ok = (e) => {
    e.preventDefault();
    // 빈 칸이 있을 때
    if (classId === '') {
      return;
    }
    if ([id, name, password, passwordConfirm, classId, authcode].includes('')) {
      setError('빈 칸을 모두 입력하세요!');
      return;
    }
    // 비밀번호가 일치하지 않을 떄
    if (password !== passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }
    console.log(id, name, password, classId, authcode);

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await client.post('/api/register/student', {
          id: id,
          name: name,
          password: password,
          class_id: classId,
          auth_code: authcode,
        });
        console.log(response);
        alert('회원가입 성공');
        history.push('/studentLogin');
      } catch (e) {
        console.log(e);
      }
      setLoading(false);
    };
    fetchData();
  };

  return (
    <AuthFormBlock>
      <h2>학생 회원가입</h2>

      <StyledInput
        autoComplete="id"
        name="id"
        placeholder="아이디"
        onChange={handleChange_id}
        value={id}
      />

      <StyledInput
        autoComplete="name"
        name="name"
        placeholder="이름"
        onChange={handleChange_name}
        value={name}
      />

      <StyledInput
        autoComplete="new-password"
        name="password"
        placeholder="비밀번호"
        type="password"
        onChange={handleChange_password}
        value={password}
      />

      <StyledInput
        autoComplete="new-password"
        name="passwordConfirm"
        placeholder="비밀번호 확인"
        type="password"
        onChange={handleChange_passwordConfirm}
        value={passwordConfirm}
      />

      <StyledSelect>
        {/* 도시 */}
        <Select
          styles={customStyles}
          width="8rem"
          options={cityList}
          placeholder={'도시'}
          onChange={handleChangeSelect_city}
        />
        {/* 학교 */}
        <Select
          styles={customStyles}
          options={schoolList}
          width="11rem"
          placeholder={'학교'}
          onChange={handleChangeSelect_school}
        />
        {/* 학년 */}
        <Select
          styles={customStyles}
          options={years}
          width="6rem"
          placeholder={'학년'}
          onChange={handleChangeSelect_year}
        />
      </StyledSelect>
      <Button
        style={{ marginTop: '1rem', marginBottom: '1rem' }}
        indigo
        fullWidth
        onClick={handleClick_class_id}
      >
        반 찾기
      </Button>
      {/* 반 찾기 버튼 */}

      <Select
        styles={customStyles}
        options={classList}
        placeholder={'반'}
        onChange={handleChangeSelect_class}
      />

      <StyledInput
        style={{ marginTop: '1rem' }}
        autoComplete="auth_code"
        name="auth_code"
        placeholder="인증코드"
        type="password"
        onChange={handleChange_authcode}
        //value={form.auth_code}
      />

      {error && <ErrorMessage>{error}</ErrorMessage>}
      <ButtonWithMarginTop indigo fullWidth onClick={handleClick_ok}>
        확인
      </ButtonWithMarginTop>
    </AuthFormBlock>
  );
};

export default StudentRegister;
