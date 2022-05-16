import React from 'react';
import AuthTemplate from '../components/auth/AuthTemplate';
import Header from '../components/base/Header';
import TeacherLoginForm from '../containers/auth/TeacherLoginForm';

const TeacherLoginPage = () => {
  return (
    <div>
      <Header type="teacherLogin" />
      <AuthTemplate>
        <TeacherLoginForm />
      </AuthTemplate>
    </div>
  );
};

export default TeacherLoginPage;
