import { React, useState, useEffect } from 'react';
import palette from '../../lib/styles/palette';
import styled from 'styled-components';
import client from '../../axiosConfig';

const TimeTableTemplate = styled.div`
  width: 720px;
  height: 520px;
  color: ${palette.gray[7]};

  // 정렬
  position: relative;
  display: flex;
  border-radius: 1rem;
  background-color: ${palette.mint[6]};
`;
const ColumnTemplate = styled.div`
  width: 120px;
  height: 520px;
`;
const BlockTemplate = styled.div`
  width: 120px;
  height: 65px;
  border-right: 1px dotted ${palette.mint[0]};
  border-bottom: 1px dotted ${palette.mint[0]};

  // 정렬
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Period = ['', 1, 2, 3, 4, 5, 6, 7];
const Mon = [
  { subject: '월', zoom_url: '' },
  { subject: '', zoom_url: '' },
  { subject: '', zoom_url: '' },
  { subject: '', zoom_url: '' },
  { subject: '', zoom_url: '' },
  { subject: '', zoom_url: '' },
  { subject: '', zoom_url: '' },
  { subject: '', zoom_url: '' },
];
const Tue = [
  { subject: '화', zoom_url: '' },
  { subject: '', zoom_url: '' },
  { subject: '', zoom_url: '' },
  { subject: '', zoom_url: '' },
  { subject: '', zoom_url: '' },
  { subject: '', zoom_url: '' },
  { subject: '', zoom_url: '' },
  { subject: '', zoom_url: '' },
];
const Wed = [
  { subject: '수', zoom_url: '' },
  { subject: '', zoom_url: '' },
  { subject: '', zoom_url: '' },
  { subject: '', zoom_url: '' },
  { subject: '', zoom_url: '' },
  { subject: '', zoom_url: '' },
  { subject: '', zoom_url: '' },
  { subject: '', zoom_url: '' },
];
const Thur = [
  { subject: '목', zoom_url: '' },
  { subject: '', zoom_url: '' },
  { subject: '', zoom_url: '' },
  { subject: '', zoom_url: '' },
  { subject: '', zoom_url: '' },
  { subject: '', zoom_url: '' },
  { subject: '', zoom_url: '' },
  { subject: '', zoom_url: '' },
];
const Fri = [
  { subject: '금', zoom_url: '' },
  { subject: '', zoom_url: '' },
  { subject: '', zoom_url: '' },
  { subject: '', zoom_url: '' },
  { subject: '', zoom_url: '' },
  { subject: '', zoom_url: '' },
  { subject: '', zoom_url: '' },
  { subject: '', zoom_url: '' },
];

const TimeTableNew = () => {
  const [loading, setLoading] = useState(false);

  const createTimeTable = (arr) => {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].day === 'MON') {
        Mon[arr[i].period].subject = arr[i].subject;
        Mon[arr[i].period].zoom_url = arr[i].zoom_url;
      } else if (arr[i].day === 'TUE') {
        Tue[arr[i].period].subject = arr[i].subject;
        Tue[arr[i].period].zoom_url = arr[i].zoom_url;
      } else if (arr[i].day === 'WED') {
        Wed[arr[i].period].subject = arr[i].subject;
        Wed[arr[i].period].zoom_url = arr[i].zoom_url;
      } else if (arr[i].day === 'THU') {
        Thur[arr[i].period].subject = arr[i].subject;
        Thur[arr[i].period].zoom_url = arr[i].zoom_url;
      } else if (arr[i].day === 'FRI') {
        Fri[arr[i].period].subject = arr[i].subject;
        Fri[arr[i].period].zoom_url = arr[i].zoom_url;
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const classId = localStorage.getItem('classId');
        const url = '/api/time-table?classId=' + classId;
        const response = await client.get(url);
        createTimeTable(response.data.data.time_table);
      } catch (e) {
        console.log(e);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return <div>로딩중</div>;
  }

  return (
    <TimeTableTemplate>
      <ColumnTemplate>
        {Period.map((time, index) =>
          index === 0 ? (
            <BlockTemplate
              key={index}
              style={{
                borderTopLeftRadius: '1rem',
                backgroundColor: palette.mint[5],
              }}
            >
              {time}
            </BlockTemplate>
          ) : index === 7 ? (
            <BlockTemplate
              key={index}
              style={{
                borderBottom: 'none',
                borderBottomLeftRadius: '1rem',
                fontFamily: 'Pretendard Bold',
              }}
            >
              {time}
            </BlockTemplate>
          ) : (
            <BlockTemplate
              key={index}
              style={{ fontFamily: 'Pretendard Bold' }}
            >
              {time}
            </BlockTemplate>
          ),
        )}
      </ColumnTemplate>
      <ColumnTemplate>
        {Mon.map((time, index) =>
          index === 0 ? (
            <BlockTemplate
              key={index}
              style={{
                fontFamily: 'Pretendard Bold',
                backgroundColor: palette.mint[5],
              }}
            >
              {time.subject}
            </BlockTemplate>
          ) : index === 7 ? (
            <BlockTemplate key={index} style={{ borderBottom: 'none' }}>
              <a href={time.zoom_url}>{time.subject}</a>
            </BlockTemplate>
          ) : (
            <BlockTemplate key={index}>
              <a href={time.zoom_url}>{time.subject}</a>
            </BlockTemplate>
          ),
        )}
      </ColumnTemplate>
      <ColumnTemplate>
        {Tue.map((time, index) =>
          index === 0 ? (
            <BlockTemplate
              key={index}
              style={{
                fontFamily: 'Pretendard Bold',
                backgroundColor: palette.mint[5],
              }}
            >
              {time.subject}
            </BlockTemplate>
          ) : index === 7 ? (
            <BlockTemplate key={index} style={{ borderBottom: 'none' }}>
              <a href={time.zoom_url}>{time.subject}</a>
            </BlockTemplate>
          ) : (
            <BlockTemplate key={index}>
              <a href={time.zoom_url}>{time.subject}</a>
            </BlockTemplate>
          ),
        )}
      </ColumnTemplate>
      <ColumnTemplate>
        {Wed.map((time, index) =>
          index === 0 ? (
            <BlockTemplate
              key={index}
              style={{
                fontFamily: 'Pretendard Bold',
                backgroundColor: palette.mint[5],
              }}
            >
              {time.subject}
            </BlockTemplate>
          ) : index === 7 ? (
            <BlockTemplate key={index} style={{ borderBottom: 'none' }}>
              <a href={time.zoom_url}>{time.subject}</a>
            </BlockTemplate>
          ) : (
            <BlockTemplate key={index}>
              <a href={time.zoom_url}>{time.subject}</a>
            </BlockTemplate>
          ),
        )}
      </ColumnTemplate>
      <ColumnTemplate>
        {Thur.map((time, index) =>
          index === 0 ? (
            <BlockTemplate
              key={index}
              style={{
                fontFamily: 'Pretendard Bold',
                backgroundColor: palette.mint[5],
              }}
            >
              {time.subject}
            </BlockTemplate>
          ) : index === 7 ? (
            <BlockTemplate key={index} style={{ borderBottom: 'none' }}>
              <a href={time.zoom_url}>{time.subject}</a>
            </BlockTemplate>
          ) : (
            <BlockTemplate key={index}>
              <a href={time.zoom_url}>{time.subject}</a>
            </BlockTemplate>
          ),
        )}
      </ColumnTemplate>
      <ColumnTemplate style={{ borderTopRightRadius: '4px' }}>
        {Fri.map((time, index) =>
          index === 0 ? (
            <BlockTemplate
              key={index}
              style={{
                fontFamily: 'Pretendard Bold',
                backgroundColor: palette.mint[5],
                borderRight: 'none',
                borderTopRightRadius: '1rem',
              }}
            >
              {time.subject}
            </BlockTemplate>
          ) : index === 7 ? (
            <BlockTemplate
              key={index}
              style={{
                borderRight: 'none',
                borderBottom: 'none',
                borderBottomRightRadius: '1rem',
              }}
            >
              <a href={time.zoom_url}>{time.subject}</a>
            </BlockTemplate>
          ) : (
            <BlockTemplate key={index} style={{ borderRight: 'none' }}>
              <a href={time.zoom_url}>{time.subject}</a>
            </BlockTemplate>
          ),
        )}
      </ColumnTemplate>
    </TimeTableTemplate>
  );
};

export default TimeTableNew;
