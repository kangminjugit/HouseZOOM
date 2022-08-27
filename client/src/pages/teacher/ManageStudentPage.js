import React from 'react';
import TeacherHeader from '../../components/base/TeacherHeader';
import StudentManageTemplate from '../../components/teacher/StudentManageTemplate';
import StudentTableNew from '../../components/teacher/StudentTableNew';

const ManageStudentPage = () => {
  return (
    <div>
      <TeacherHeader type="학생 관리" />
      <StudentTableNew />
    </div>
  );
};

export default ManageStudentPage;
