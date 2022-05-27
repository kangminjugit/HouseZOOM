import React, { useEffect, useState } from 'react';
import { Box } from '@material-ui/core/index';
import { InputLabel } from '@material-ui/core/index';
import { FormControl } from '@material-ui/core/index';
import { NativeSelect } from '@material-ui/core/index';
import styled from 'styled-components';
import palette from '../../lib/styles/palette';
import Button from '../common/Button';
// import axios from 'axios';
import client from '../../axiosConfig';
import { useHistory } from 'react-router-dom';

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

const AuthFormBlock = styled.div`
  h2 {
    margin: 0;
    color: ${palette.gray[8]};
    margin-bottom: 1rem;
    text-align: center;
    font-weight: bold;
  }
`;
const ErrorMessage = styled.div`
  color: red;
  text-align: center;
  font-size: 0.875rem;
  margin-top: 1rem;
`;
// input styling
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
  const [loading, setLoading] = useState(false);
  const [schoolList, setSchoolList] = useState();
  const [classList, setclassList] = useState();
  const [classArrayList, setClassArrayList] = useState();
  const [schoolNameList, setSchoolNameList] = useState();
  const [schoolName, setSchoolName] = useState();
  const [className, setclassName] = useState();
  const [grade, setGrade] = useState('');
  const [classId, setClassId] = useState();
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
  const handleChange_city = (e) => {
    const { value } = e.target;
    setCity(value);
  };
  const handleChange_school = (e) => {
    const { value } = e.target;
    setSchoolName(value);
  };
  const handleChange_class = (e) => {
    const { value } = e.target;
    setclassName(value);
  };
  const handleChange_grade = (e) => {
    const { value } = e.target;
    setGrade(value);
  };
  const handleChange_authcode = (e) => {
    const { value } = e.target;
    setAuthcode(value);
  };

  const handleClick_class_id = (e) => {
    console.log('click');
    const code = find_school_code(schoolList, schoolName);
    console.log(schoolList, schoolName, code, grade);
    const fetchData = async () => {
      setLoading(true);
      try {
        const url =
          'http://3.35.141.211:3000/api/class?school_code=' +
          code +
          '&year=' +
          grade;
        const response = await client.get(url);
        console.log(response.data.data.class_list);
        setClassArrayList(response.data.data.class_list);
        setclassList(create_class_name(response.data.data.class_list));
      } catch (e) {
        console.log(e);
      }
      setLoading(false);
    };
    fetchData();
  };

  // const handleClick_ok = (e) => {
  //   //const code = find_school_code(schoolList, schoolName);
  //   //const class_id = find_class_id(classList, className);
  //   setClassId(find_class_id(classArrayList, className));
  //   console.log(classArrayList, className);
  //   console.log(id, name, password, classId, authcode);
  // };

  // 반 이름으로 반 코드 알아내기
  const find_class_id = (arr, name) => {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i]['name'] === name) {
        return arr[i]['id'];
      }
    }
  };
  // 학교 이름으로 학교 코드 알아내기
  const find_school_code = (arr, name) => {
    for (let j = 0; j < arr.length; j++) {
      if (arr[j]['school_name'] === name) {
        return arr[j]['school_code'];
      }
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
  // 학교에 있는 반 이름 리스트 만들기
  const create_class_name = (arr) => {
    const class_names = [];
    for (let i = 0; i < arr.length; i++) {
      class_names.push(arr[i]['name']);
    }
    return class_names;
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
  if (!classList) return setclassList(null_arr);

  const handleClick_ok = (e) => {
    setClassId(find_class_id(classArrayList, className));
    console.log(classArrayList, className);
    console.log(id, name, password, classId, authcode);

    e.preventDefault();
    // 빈 칸이 있을 때
    if (classId === '') {
      return;
    }
    if ([id, name, password, passwordConfirm, classId, authcode].includes('')) {
      setError('빈 칸을 모두 입력하시오.');
      return;
    }
    // 비밀번호가 일치하지 않을 떄
    if (password !== passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }
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
      <h2>회원가입</h2>

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
              //id: 'uncontrolled-native',
            }}
          >
            {cities.map((city, index) => (
              <option key={index} vaule={city}>
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
              //id: 'uncontrolled-native',
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
        autoComplete="grade"
        name="grade"
        placeholder="학년"
        onChange={handleChange_grade}
        value={grade}
      />
      <Button indigo fullWidth onClick={handleClick_class_id}>
        반 찾기
      </Button>

      <Box className="margin_top" sx={{ maxWidth: 300 }}>
        <FormControl fullWidth>
          <InputLabel variant="standard" htmlFor="uncontrolled-native">
            School
          </InputLabel>
          <NativeSelect
            //defaultValue={'school'}
            //onChange={handleChange_school}
            onChange={handleChange_class}
            inputProps={{
              name: 'class',
              //id: 'uncontrolled-native',
            }}
          >
            {classList.map((school, index) => (
              <option key={index} vaule={school}>
                {school}
              </option>
            ))}
          </NativeSelect>
        </FormControl>
      </Box>

      <StyledInput
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
