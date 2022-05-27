import React from 'react';
import StudentRegister from '../components/student/StudentRegister';
import AuthTemplate from '../components/auth/AuthTemplate';
import Header from '../components/base/Header';

const StudentRegisterPage = () => {
  return (
    <div>
      <Header type="studentRegister" />
      <AuthTemplate>
        <StudentRegister />
      </AuthTemplate>
    </div>
  );
};

export default StudentRegisterPage;
