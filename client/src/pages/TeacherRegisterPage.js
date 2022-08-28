import React from 'react';
import AuthTemplate from '../components/auth/AuthTemplate';
import TeacherRegisterForm from '../containers/auth/TeacherRegisterForm';
import LandingHeader from '../components/base/LandingHeader';

const TeacherRegisterPage = () => {
  return (
    <div>
      <LandingHeader type="teacher_register" />
      <AuthTemplate>
        <TeacherRegisterForm />
      </AuthTemplate>
    </div>
  );
};

export default TeacherRegisterPage;
