import React from 'react';
import StudentHeader from '../components/base/StudentHeader';
import TeacherHeader from '../components/base/TeacherHeader';
import ClassCharTemplate from '../components/class/ClassCharTemplate';
import ClassCharNew from '../components/class/ClassCharNew';

const ClassCharPage = () => {
  const teacher_user = localStorage.getItem('teacher_user');
  const student_user = localStorage.getItem('student_user');

  if (teacher_user) {
    return (
      <>
        <TeacherHeader type="우리반 페이지" />
        <ClassCharNew />
      </>
    );
  } else if (student_user) {
    return (
      <>
        <StudentHeader type="우리반 페이지" />
        <ClassCharNew />
      </>
    );
  }
};

export default ClassCharPage;
