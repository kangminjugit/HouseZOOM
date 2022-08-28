import React, { useEffect, useState } from 'react';
import client from '../../axiosConfig';
import styled, { css } from 'styled-components';
import palette from '../../lib/styles/palette';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
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

const ClassSelectBlock = styled.div`
  position: absolute;
  width: 100%;
  height: 90%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const InputBlock = styled.div`
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.025);
  padding: 2rem;
  background: ${palette.gray[0]};
  /* border: 4px solid ${palette.gray[7]};
  border-radius: 15px; */
  width: 30rem;
  flex-direction: column;
  justify-content: center;
  align-items: center;

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

const StyledButton = styled.button`
  border: none;
  // border-radius: 4px;
  // border: 4px solid ${palette.gray[7]};
  border-radius: 10px;
  font-size: 1rem;
  font-weight: bold;
  padding: 0.25rem 1rem;
  color: black;
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
      background: ${palette.mint[3]};

      &:hover {
        background: ${palette.mint[0]};
      }
    `}
`;

export default function NativeSelectDemo() {
  const { form, auth, authError, user_token } = useSelector(
    ({ auth, user }) => ({
      form: auth.teacher_login,
      auth: auth.auth,
      authError: auth.authError,
      user_token: user.user_token,
    }),
  );

  const history = useHistory();
  const dispatch = useDispatch();

  // 토큰
  const token = JSON.parse(localStorage.getItem('teacher_user'));
  const accessClient = client.create({
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  //const [token, setToken] = useState();
  const [city, setCity] = useState(null);
  const [className, setClassName] = useState(null);
  const [authCode, setAuthCode] = useState(null);
  const [year, setYear] = useState(0);
  const [loading, setLoading] = useState(false);
  const [schoolList, setSchoolList] = useState();
  const [schoolCode, setSchoolCode] = useState();

  // event handler
  const handleChangeSelect_city = (e) => {
    setCity(e.label);
  };
  const handleChangeSelect_school = (e) => {
    setSchoolCode(e.value);
  };
  const handleChange_input = (e) => {
    const { value } = e.target;
    setClassName(value);
  };
  const handleChange_auth = (e) => {
    const { value } = e.target;
    setAuthCode(value);
  };
  const handleChangeSelect_year = (e) => {
    setYear(e.value);
  };

  // 학교 생성하기 버튼
  const onClick = (e) => {
    console.log(schoolCode, className, authCode, year);

    if (!schoolCode || !className || !authCode || !year) {
      alert('빈 칸을 모두 입력하세요!');
      return;
    } else {
      accessClient
        .post('/api/class', {
          school_code: schoolCode,
          name: className,
          auth_code: authCode,
          year: year,
        })
        .then(function (response) {
          console.log(response);
          localStorage.setItem(
            'classId',
            JSON.stringify(response.data.data.class_id),
          );
          alert('반이 생성되었습니다.');
          history.push('/teacherMyPage');
        })
        .catch(function (error) {
          console.log(error);
        });
    }
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

  // 리턴 !!!!!!!!!
  return (
    <ClassSelectBlock>
      <InputBlock>
        <h2>반 생성하기</h2>
        {/* 도시 */}
        <div>
          <Select
            styles={customStyles}
            // width="8rem"
            options={cityList}
            placeholder={'도시'}
            onChange={handleChangeSelect_city}
          />
        </div>
        {/* 학교 */}
        <div style={{ marginTop: '1rem' }}>
          <Select
            styles={customStyles}
            options={schoolList}
            placeholder={'학교'}
            onChange={handleChangeSelect_school}
          />
        </div>

        {/* 학년 */}
        <div style={{ marginTop: '1rem' }}>
          <Select
            styles={customStyles}
            options={years}
            placeholder={'학년'}
            onChange={handleChangeSelect_year}
          />
        </div>

        <StyledInput
          className="margin_top"
          autoComplete="class_name"
          style={{ marginTop: '1rem' }}
          placeholder="반 이름"
          onChange={handleChange_input}
        />
        <StyledInput
          autoComplete="auth_code"
          name="auth_code"
          placeholder="인증코드"
          onChange={handleChange_auth}
        />

        <StyledButton
          indigo
          fullWidth
          className="margin_top"
          onClick={onClick}
          style={{ marginTop: '1rem' }}
        >
          확인
        </StyledButton>
      </InputBlock>
    </ClassSelectBlock>
  );
}
