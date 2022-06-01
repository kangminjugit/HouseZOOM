import React from 'react';
import Header from '../components/base/Header';
import ClassCharTemplate from '../components/class/ClassCharTemplate';

const ClassCharPage = () => {
  const teacher_user = localStorage.getItem('teacher_user');
  const student_user = localStorage.getItem('student_user');

  if (teacher_user) {
    return (
      <>
        <Header type="teacher" />
        <ClassCharTemplate />
      </>
    );
  } else if (student_user) {
    return (
      <>
        <Header type="student" />
        <ClassCharTemplate />
      </>
    );
  }
};

export default ClassCharPage;
