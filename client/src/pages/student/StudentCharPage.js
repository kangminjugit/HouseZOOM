import React from 'react';
import StudentHeader from '../../components/base/StudentHeader';
import MyCharTemplate from '../../components/student/char/MyCharTemplate';
import MyCharNew from '../../components/student/char/MyCharNew';

const StudentCharPage = () => {
  return (
    <>
      <StudentHeader type="나의 캐릭터" />
      <MyCharNew />
    </>
  );
};

export default StudentCharPage;
