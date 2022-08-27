import React, { useState } from 'react';
import palette from '../../lib/styles/palette';
import styled from 'styled-components';
import Select from 'react-select';
import client from '../../axiosConfig';
import { useHistory } from 'react-router-dom';

const Days = [
  { label: '월', value: 'MON' },
  { label: '화', value: 'TUE' },
  { label: '수', value: 'WED' },
  { label: '목', value: 'THU' },
  { label: '금', value: 'FRI' },
];

const Period = [
  { label: 1, value: 1 },
  { label: 2, value: 2 },
  { label: 3, value: 3 },
  { label: 4, value: 4 },
  { label: 5, value: 5 },
  { label: 6, value: 6 },
  { label: 7, value: 7 },
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
    height: '2rem',
    // This line disable the blue border
    boxShadow: state.isFocused ? 0 : 0,
    '&:hover': {
      border: state.isFocused ? '1px solid  #84dac2' : '1px solid #c4ede0',
    },
    border: state.isFocused ? '1px solid  #84dac2' : '1px solid #c4ede0',
  }),

  singleValue: (provided, state) => {
    const opacity = state.isDisabled ? 0.5 : 1;
    const transition = 'opacity 300ms';

    return { ...provided, opacity, transition };
  },
};

const PostTimeTableBlock = styled.div`
  margin-top: 1rem;
  margin-left: 6rem;
  margin-right: 6rem;
  color: ${palette.gray[8]};
`;

const TitleStyle = styled.div`
  font-family: 'Pretendard Bold';

  font-size: 1.2rem;
  margin-left: 0.5rem;
  // 정렬
  display: flex;
  align-items: center;
`;

const PostTimeTableHeader = styled.div`
  width: 100%;
  height: 2.5rem;
  font-family: 'Pretendard Bold';
  display: flex;
  flex-direction: row;
  margin-top: 1rem;

  border-top: 1px solid ${palette.mint[3]};
  border-bottom: 1px solid ${palette.mint[3]};
`;

const PostTimeTableRow = styled.div`
  width: 100%;
  height: 3rem;
  border-bottom: 1px solid ${palette.mint[3]};

  display: flex;
  flex-direction: row;
`;

const FirstBlock = styled.div`
  border-right: 1px dotted ${palette.mint[3]};
  // 정렬
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledInput = styled.input`
  border: 1px solid ${palette.mint[4]};
  border-radius: 4px;
  outline: none;

  margin-left: 0.5rem;
  padding-left: 0.5rem;
  width: 100%;
  height: 100%;

  &:focus {
    border: 1px solid ${palette.mint[2]};
  }
`;

const StyledButton = styled.button`
  font-family: 'Pretendard Bold';
  color: ${palette.gray[8]};
  outline: none;
  border: none;
  border-radius: 4px;
  background-color: ${palette.mint[4]};
  &:hover {
    background-color: ${palette.mint[2]};
  }
`;

const PostTimeTable = () => {
  const [day_post, setDay_post] = useState();
  const [day_show, setDay_show] = useState();
  const [period, setPeriod] = useState();
  const [subject, setSubject] = useState('');
  const [zoom_url, setZoom_url] = useState('');
  const [valueDay, setValueDay] = useState();
  const [valuePeriod, setValuePeriod] = useState('');

  const [timeTable_show, setTimeTable_show] = useState([]);
  const [timeTable_post, setTimeTable_post] = useState([]);

  // event handler
  const handleChangeSelect_day = (e) => {
    setDay_show(e.label);
    setDay_post(e.value);
    setValueDay({ label: e.label, value: e.value });
  };
  const handleChangeSelect_period = (e) => {
    setPeriod(e.value);
    setValuePeriod({ label: e.label, value: e.value });
  };
  const handleChange_subject = (e) => {
    const { value } = e.target;
    setSubject(value);
  };
  const handleChange_zoom = (e) => {
    const { value } = e.target;
    setZoom_url(value);
  };

  const handleClick = (e) => {
    // console.log(day, day_show, period, subject, zoom_url);
    if (!day_post || !period || !subject) {
      alert('다시 입력하세요');
    } else {
      const table_show = {
        day: day_show,
        period: period,
        subject: subject,
        zoom_url: zoom_url,
      };
      const table_post = {
        day: day_post,
        period: period,
        subject: subject,
        zoom_url: zoom_url,
      };
      setTimeTable_show((timeTable_show) => [...timeTable_show, table_show]);
      setTimeTable_post((timeTable_post) => [...timeTable_post, table_post]);
    }
    // set Clear
    setValueDay({ label: '', value: '' });
    setValuePeriod({ label: '', value: '' });
    setSubject('');
    setZoom_url('');
  };

  // 토큰
  const token = JSON.parse(localStorage.getItem('teacher_user'));
  const accessClient = client.create({
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  const classId = parseInt(localStorage.getItem('classId'));
  const history = useHistory();

  const handleClickPost = () => {
    console.log(timeTable_post);
    if (timeTable_post) {
      accessClient
        .post('/api/time-table', {
          classId: classId,
          timeTable: timeTable_post,
        })
        .then(function (res) {
          alert('시간표 생성 완료!');
          history.push('/teacherMyPage');
        })
        .catch(function (e) {
          console.log(e);
        });
    }
  };
  return (
    <PostTimeTableBlock>
      <TitleStyle>
        <img
          src="/icon/calendar.png"
          style={{ height: '1.2rem' }}
          alt="timetable"
        />
        &nbsp; 시간표 생성
      </TitleStyle>
      <PostTimeTableHeader style={{ border: 'none' }}>
        <FirstBlock style={{ width: '10%', border: 'none' }}>
          <Select
            styles={customStyles}
            options={Days}
            width="7rem"
            placeholder={'요일'}
            onChange={handleChangeSelect_day}
            value={valueDay}
          />
        </FirstBlock>
        <FirstBlock style={{ width: '10%', border: 'none' }}>
          <Select
            styles={customStyles}
            options={Period}
            width="7rem"
            placeholder={'시간'}
            onChange={handleChangeSelect_period}
            value={valuePeriod}
          />
        </FirstBlock>
        <FirstBlock style={{ width: '30%', border: 'none' }}>
          <StyledInput
            name="subject"
            placeholder="과목"
            onChange={handleChange_subject}
            value={subject}
          />
        </FirstBlock>
        <FirstBlock style={{ width: '40%', border: 'none' }}>
          <StyledInput
            name="zoom_url"
            placeholder="ZOOM 링크"
            onChange={handleChange_zoom}
            value={zoom_url}
          />
        </FirstBlock>
        <StyledButton
          style={{ width: '10%', marginLeft: '0.5rem' }}
          onClick={handleClick}
        >
          확인
        </StyledButton>
      </PostTimeTableHeader>
      <PostTimeTableHeader style={{ backgroundColor: palette.mint[5] }}>
        <FirstBlock style={{ width: '10%' }}>요일</FirstBlock>
        <FirstBlock style={{ width: '10%' }}>시간</FirstBlock>
        <FirstBlock style={{ width: '30%' }}>과목</FirstBlock>
        <FirstBlock style={{ width: '50%' }}>ZOOM 링크</FirstBlock>
      </PostTimeTableHeader>
      {timeTable_show.map((table, index) => (
        <PostTimeTableRow key={index}>
          <FirstBlock style={{ width: '10%' }}>{table.day}</FirstBlock>
          <FirstBlock style={{ width: '10%' }}>{table.period}교시</FirstBlock>
          <FirstBlock style={{ width: '30%' }}>{table.subject}</FirstBlock>
          <FirstBlock style={{ width: '50%' }}>
            <div style={{ textAlign: 'center' }}>{table.zoom_url}</div>
          </FirstBlock>
        </PostTimeTableRow>
      ))}
      <StyledButton
        style={{ width: '100%', height: '2rem', marginTop: '1rem' }}
        onClick={handleClickPost}
      >
        시간표 생성하기
      </StyledButton>
    </PostTimeTableBlock>
  );
};

export default PostTimeTable;
