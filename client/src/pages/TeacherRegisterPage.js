import React from 'react';
import AuthTemplate from '../components/auth/AuthTemplate';
import TeacherRegisterForm from '../containers/auth/TeacherRegisterForm';
import Header from '../components/base/Header';

const TeacherRegisterPage = () => {
  return (
    <div>
      <Header type="teacherRegister" />
      <AuthTemplate>
        <TeacherRegisterForm />
      </AuthTemplate>
    </div>
  );
};

export default TeacherRegisterPage;
