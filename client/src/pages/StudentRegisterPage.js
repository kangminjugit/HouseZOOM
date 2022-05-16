import React from 'react';
import AuthTemplate from '../components/auth/AuthTemplate';
import StudentRegisterForm from '../containers/auth/StudentRegisterForm';
import Header from '../components/base/Header';

const StudentRegisterPage = () => {
  return (
    <div>
      <Header type="studentRegister" />
      <AuthTemplate>
        <StudentRegisterForm />
      </AuthTemplate>
    </div>
  );
};

export default StudentRegisterPage;
