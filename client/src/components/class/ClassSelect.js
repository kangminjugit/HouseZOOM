import React, { useEffect, useState } from 'react';
import { Box } from '@material-ui/core/index';
import { InputLabel } from '@material-ui/core/index';
import { FormControl } from '@material-ui/core/index';
import { NativeSelect } from '@material-ui/core/index';
import axios from 'axios';
import styled, { css } from 'styled-components';
import palette from '../../lib/styles/palette';

const cities = [
  '강원도',
  '경기도',
  '경상남도',
  '경상북도',
  '광주광역시',
  '대구광역시',
  '대전광역시',
  '부산광역시',
  '서울특별시',
  '세종특별자치시',
  '울산광역시',
  '인천광역시',
  '전라남도',
  '전라북도',
  '제주특별자치도',
  '충청남도',
  '충청북도',
];
const null_arr = ['도시를 입력하세요'];

const ClassSelectBlock = styled.div`
  position: absolute;
  left: 0;
  //top: 0;
  //bottom: 0;
  right: 0;
  width: 100%;
  height: 100%;
  //background: ${palette.gray[0]};
  display: flex;
  //flex-direction: column;
  justify-content: center;
  align-items: center;
  .pad {
    padding: 1rem;
  }
  .margin {
    margin: 1rem;
  }
  .margin_top {
    margin-top: 1rem;
  }
`;

const InputBlock = styled.div`
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.025);
  padding: 2rem;
  background: ${palette.gray[0]};
  border-radius: 15px;
  width: 300px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const StyledInput = styled.input`
  font-size: 1rem;
  border: none;
  border-bottom: 1px solid ${palette.gray[5]};
  border-radius: 4px;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  outline: none;
  width: 100%;
  &:focus {
    color: $oc-teal-7;
    border-bottom: 1px solid ${palette.gray[7]};
  }

  & + & {
    margin-top: 1rem;
  }
`;

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

export default function NativeSelectDemo() {
  const [city, setCity] = useState(null);
  const [className, setClassName] = useState(null);
  const [authCode, setAuthCode] = useState(null);
  const [year, setYear] = useState(0);
  const [loading, setLoading] = useState(false);
  const [schoolList, setSchoolList] = useState();
  const [schoolNameList, setSchoolNameList] = useState();
  const [schoolName, setSchoolName] = useState();

  // 토큰
  const token = JSON.parse(localStorage.getItem('teacher_user'));
  const accessClient = axios.create({
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  // event handler
  const handleChange_city = (e) => {
    const { value } = e.target;
    setCity(value);
  };
  const handleChange_school = (e) => {
    const { value } = e.target;
    setSchoolName(value);
  };
  const handleChange_input = (e) => {
    const { value } = e.target;
    setClassName(value);
  };
  const handleChange_auth = (e) => {
    const { value } = e.target;
    setAuthCode(value);
  };
  const handleChange_year = (e) => {
    const { value } = e.target;
    setYear(value);
  };

  // 학교 이름으로 학교 코드 알아내기
  const find_school_code = (arr, name) => {
    for (let j = 0; j < arr.length; j++) {
      if (arr[j]['school_name'] === name) {
        return arr[j]['school_code'];
      }
    }
  };

  // 학교 생성하기 버튼
  const onClick = (e) => {
    console.log(schoolName);
    if (schoolName) {
      const code = find_school_code(schoolList, schoolName);
      console.log(code, className, authCode, year);
      accessClient
        .post('/api/class', {
          school_code: code,
          name: className,
          auth_code: authCode,
          year: year,
        })
        .then(function (response) {
          console.log(response);
          alert('반이 생성되었습니다.');
          localStorage.setItem(
            'classId',
            JSON.stringify(response.data.data.class_id),
          );
        })
        .catch(function (error) {
          console.log(error);
        });
    } else {
      console.log('error');
    }
  };

  // 도시에 있는 학교 이름 리스트 만들기
  const create_school_name = (arr) => {
    const school_names = [];
    for (let i = 0; i < arr.length; i++) {
      school_names.push(arr[i]['school_name']);
    }
    return school_names;
  };

  // 도시에 있는 학교 리스트 서버에서 가져오기
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/api/school/location', {
          params: {
            school_location: city,
          },
        });
        setSchoolList(response.data.data.school_list);
        console.log('fetch');
        setSchoolNameList(create_school_name(response.data.data.school_list));
      } catch (e) {
        console.log(e);
      }
      setLoading(false);
    };
    if (city) {
      fetchData();
    }
  }, [city]);

  if (!schoolNameList) return setSchoolNameList(null_arr);

  // 리턴 !!!!!!!!!
  return (
    <ClassSelectBlock>
      <InputBlock>
        <Box sx={{ maxWidth: 300 }}>
          <FormControl fullWidth>
            <InputLabel variant="standard" htmlFor="uncontrolled-native">
              City
            </InputLabel>
            <NativeSelect
              //defaultValue={30}
              onChange={handleChange_city}
              inputProps={{
                name: 'city',
                id: 'uncontrolled-native',
              }}
            >
              {cities.map((city) => (
                <option key={city} vaule={city}>
                  {city}
                </option>
              ))}
            </NativeSelect>
          </FormControl>
        </Box>

        <Box className="margin_top" sx={{ maxWidth: 300 }}>
          <FormControl fullWidth>
            <InputLabel variant="standard" htmlFor="uncontrolled-native">
              School
            </InputLabel>
            <NativeSelect
              //defaultValue={'school'}
              onChange={handleChange_school}
              inputProps={{
                name: 'school',
                id: 'uncontrolled-native',
              }}
            >
              {schoolNameList.map((school, index) => (
                <option key={index} vaule={school}>
                  {school}
                </option>
              ))}
            </NativeSelect>
          </FormControl>
        </Box>

        <StyledInput
          className="margin_top"
          autoComplete="class_name"
          name="class_name"
          placeholder="반 이름"
          onChange={handleChange_input}
        ></StyledInput>
        <StyledInput
          autoComplete="auth_code"
          name="auth_code"
          placeholder="인증코드"
          onChange={handleChange_auth}
        ></StyledInput>
        <StyledInput
          autoComplete="year"
          name="year"
          placeholder="학년"
          onChange={handleChange_year}
        ></StyledInput>
        <StyledButton indigo fullWidth className="margin_top" onClick={onClick}>
          확인
        </StyledButton>
      </InputBlock>
    </ClassSelectBlock>
  );
}
