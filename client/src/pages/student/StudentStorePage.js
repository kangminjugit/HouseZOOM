import React from 'react';
import StudentHeader from '../../components/base/StudentHeader';
import StoreNew from '../../components/student/char/StoreNew';

const StudentStorePage = () => {
  return (
    <>
      <StudentHeader type="캐릭터 상점" />
      <StoreNew />
    </>
  );
};

export default StudentStorePage;
