import React from 'react';
import Header from '../../components/base/Header';
import StudentManageTemplate from '../../components/teacher/StudentManageTemplate';

const ManageStudentPage = () => {
  return (
    <div>
      <Header type="teacher" />
      <StudentManageTemplate />
    </div>
  );
};

export default ManageStudentPage;
