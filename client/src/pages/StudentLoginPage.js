import React from 'react';
import AuthTemplate from '../components/auth/AuthTemplate';
import Header from '../components/base/Header';
import StudentLoginForm from '../containers/auth/StudentLoginForm';

const StudentLoginPage = () => {
  return (
    <div>
      <Header type="studentLogin" />
      <AuthTemplate>
        <StudentLoginForm />
      </AuthTemplate>
    </div>
  );
};

export default StudentLoginPage;
