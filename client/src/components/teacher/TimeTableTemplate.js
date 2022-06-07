import React, { useEffect, useState } from 'react';
import { Box } from '@material-ui/core/index';
import { InputLabel } from '@material-ui/core/index';
import { FormControl } from '@material-ui/core/index';
import { NativeSelect } from '@material-ui/core/index';
import styled, { css } from 'styled-components';
import {
  Input,
  TableSortLabel,
} from '../../../node_modules/@material-ui/core/index';
import palette from '../../lib/styles/palette';
import { useHistory } from 'react-router-dom';
import Button from '../common/Button';
import client from '../../axiosConfig';

// 화면 전체 style
const TimeTableBlock = styled.div`
  position: flex;
  left: 10px;
  right: 10px;
  top: 10px;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const InputBlock = styled.div`
  //margin-top: 1rem;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.025);
  padding: 2rem;
  background: ${palette.gray[0]};
  border-radius: 15px;
  width: 100%;
  height: 100px;
  flex-direction: row;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledInput = styled.input`
  font-size: 1rem;
  border: none;
  border-bottom: 1px solid ${palette.gray[5]};
  border-radius: 4px;
  //padding-top: 0.5rem;
  //padding-bottom: 0.5rem;
  margin: 0.5rem;
  outline: none;
  width: 300px;
  height: 50px;
  &:focus {
    color: $oc-teal-7;
    border-bottom: 1px solid ${palette.gray[7]};
  }
`;

const StyledDiv = styled.div`
  font-size: 1rem;
  //border: none;
  border: 1px solid ${palette.gray[5]};
  text-align: center;
  line-height: 45px;
  border-radius: 4px;
  //padding-top: 0.5rem;
  //padding-bottom: 0.5rem;
  margin: 0.5rem;
  outline: none;
  width: 300px;
  height: 50px;
`;

const StyledButton = styled.button`
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: bold;
  margin: 0.5rem;
  width: 100px;
  height: 50px;
  //padding: 0.25rem 1rem;
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
const tables = [];
const null_table = { day: '', period: null, subject: '', zoom_url: '' };
const days = ['요일', 'MON', 'TUE', 'WED', 'THU', 'FRI'];
const periods = ['교시', 1, 2, 3, 4, 5, 6, 7];

const TimeTableTemplate = () => {
  const history = useHistory();
  const [table, setTable] = useState({
    day: '',
    period: 0,
    subject: '',
    zoom_url: '',
  });
  const [loading, setLoading] = useState(false);
  const [day, setDay] = useState('');
  const [period, setPeriod] = useState(0);
  const [subject, setSubject] = useState('');
  const [zoom, setZoom] = useState('');

  // 토큰
  const token = JSON.parse(localStorage.getItem('teacher_user'));
  const accessClient = client.create({
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  // event handler
  const handleChange_day = (e) => {
    const { value } = e.target;
    setDay(value);
  };
  const handleChange_period = (e) => {
    const { value } = e.target;
    setPeriod(parseInt(value));
  };
  const handleChange_subject = (e) => {
    const { value } = e.target;
    setSubject(value);
  };
  const handleChange_zoom = (e) => {
    const { value } = e.target;
    setZoom(value);
  };
  const handleClick = (e) => {
    setTable({
      day: day,
      period: period,
      subject: subject,
      zoom_url: zoom,
    });
    console.log(day, period, subject, zoom);

    // tables.push(table);
    // setTable(null_table);
  };

  // 서버에 보내기
  const handleClick_submit = (e) => {
    console.log('제출');
    console.log(tables);

    accessClient
      .post('/api/time-table', {
        classId: parseInt(localStorage.getItem('classId')),
        timeTable: tables,
      })
      .then(function (response) {
        console.log(response);
        tables.pop();
        for (let i = 0; i < tables.length; i++) {
          tables.pop();
        }
        alert('시간표 생성 완료!');
        history.push('/teacherMyPage');
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  useEffect(() => {
    const fetchData = async () => {
      if (table.period !== 0) {
        setLoading(true);
        tables.push(table);
        setLoading(false);
        //alert('ok!');
      }
    };
    fetchData();
    setDay('');
    setPeriod(null);
    setSubject('');
    setZoom('');
    console.log(tables);
  }, [table]);

  if (loading) {
    return <div>로딩중</div>;
  }

  return (
    <TimeTableBlock>
      <InputBlock style={{ marginTop: '1rem' }}>
        <NativeSelect
          //defaultValue={30}
          style={{ width: '300px', height: '50px', margin: '0.5rem' }}
          onChange={handleChange_day}
          inputProps={{
            name: 'day',
            //id: 'uncontrolled-native',
          }}
        >
          {days.map((city, index) => (
            <option key={index} vaule={city}>
              {city}
            </option>
          ))}
        </NativeSelect>
        <NativeSelect
          //defaultValue={30}
          style={{ width: '300px', height: '50px', margin: '0.5rem' }}
          onChange={handleChange_period}
          inputProps={{
            name: 'period',
            //id: 'uncontrolled-native',
          }}
        >
          {periods.map((city, index) => (
            <option key={index} vaule={city}>
              {city}
            </option>
          ))}
        </NativeSelect>
        {/* <StyledInput
          className="margin_top"
          autoComplete="day"
          name="day"
          placeholder="day"
          onChange={handleChange_day}
        ></StyledInput> */}
        {/* <StyledInput
          className="margin_top"
          autoComplete="period"
          name="period"
          placeholder="period"
          onChange={handleChange_period}
        ></StyledInput> */}
        <StyledInput
          className="margin_top"
          autoComplete="subject"
          name="subject"
          placeholder="subject"
          onChange={handleChange_subject}
        ></StyledInput>
        <StyledInput
          className="margin_top"
          autoComplete="zoom_url"
          name="zoom_url"
          placeholder="zoom_url"
          onChange={handleChange_zoom}
        ></StyledInput>
        <StyledButton onClick={handleClick}>추가</StyledButton>
      </InputBlock>
      {tables.map((tb, index) => (
        <InputBlock key={index}>
          <StyledDiv>{tb.day}</StyledDiv>
          <StyledDiv>{tb.period}</StyledDiv>
          <StyledDiv>{tb.subject}</StyledDiv>
          <StyledDiv style={{ fontSize: '0.75rem', lineHeight: '20px' }}>
            {tb.zoom_url}
          </StyledDiv>
        </InputBlock>
      ))}
      <Button fullWidth indigo onClick={handleClick_submit}>
        제출 완료
      </Button>
    </TimeTableBlock>
  );
};

export default TimeTableTemplate;
