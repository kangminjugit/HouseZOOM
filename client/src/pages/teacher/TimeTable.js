import React from 'react';
import TeacherHeader from '../../components/base/TeacherHeader';
import TimeTableTemplate from '../../components/teacher/TimeTableTemplate';
import PostTimeTable from '../../components/teacher/PostTimeTable';

const TimeTable = () => {
  return (
    <>
      <TeacherHeader type="시간표 생성" />
      <PostTimeTable />
    </>
  );
};

export default TimeTable;
