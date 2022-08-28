import React from 'react';
import styled from 'styled-components';
import palette from '../../lib/styles/palette';
import TimeTableNew from './TimeTable_new';

// 화면 전체 style
const MyPageTemplateBlock = styled.div`
  position: absolute;
  width: 100%;
  height: 90%;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;
const LeftBlock = styled.div`
  width: 320px;
  height: 650px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`;
const TopBlock = styled.div`
  width: 100%;
  height: 150px;
  border-radius: 0.25rem;
  background-color: ${palette.background[1]};
  box-shadow: 0px 0px 10px rgba(51, 51, 51, 0.1);

  display: flex;
  align-items: center;
  justify-content: center;
`;

const BottomBlock = styled.div`
  width: 100%;
  height: 450px;
  border-radius: 0.25rem;
  background-color: ${palette.background[1]};
  box-shadow: 0px 0px 4px rgba(51, 51, 51, 0.1);
`;

const RightBlock = styled.div`
  margin-inline-start: 5rem;
  width: 800px;
  height: 650px;
  border-radius: 0.25rem;
  background-color: ${palette.background[1]};
  box-shadow: 0px 0px 10px rgba(51, 51, 51, 0.1);
`;

const TitleBlock = styled.div`
  font-family: 'Pretendard Bold';
  font-size: 1.25rem;
  text-align: center;
  // 정렬
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  margin-top: 1rem;
  margin-bottom: 1rem;
`;

const TeacherMyPageTemplate = () => {
  return (
    <MyPageTemplateBlock>
      <LeftBlock>
        <TopBlock>
          <TitleBlock>수업들어가기</TitleBlock>
        </TopBlock>
      </LeftBlock>
      <RightBlock>
        <TitleBlock>
          시간표&nbsp;
          <img
            className="timetable"
            alt="timetable"
            src="/icon/calendar.png"
            style={{ position: 'relative', height: '1.5rem' }}
          />
        </TitleBlock>
        <div
          style={{
            display: 'flex',
            marginTop: '2rem',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <TimeTableNew />
        </div>
      </RightBlock>
    </MyPageTemplateBlock>
  );
};

export default TeacherMyPageTemplate;
