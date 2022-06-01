import React from 'react';
import Header from '../../components/base/Header';
import TimeTableTemplate from '../../components/teacher/TimeTableTemplate';

const TimeTable = () => {
  return (
    <>
      <Header type="teacher" />
      <TimeTableTemplate />
    </>
  );
};

export default TimeTable;
