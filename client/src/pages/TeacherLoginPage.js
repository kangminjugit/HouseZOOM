import React from 'react';
import AuthTemplate from '../components/auth/AuthTemplate';
import LandingHeader from '../components/base/LandingHeader';
import TeacherLoginForm from '../containers/auth/TeacherLoginForm';

const TeacherLoginPage = () => {
  return (
    <div>
      <LandingHeader type="teacher_login" />
      <AuthTemplate>
        <TeacherLoginForm />
      </AuthTemplate>
    </div>
  );
};

export default TeacherLoginPage;
