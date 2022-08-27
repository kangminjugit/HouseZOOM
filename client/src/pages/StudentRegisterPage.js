import React from 'react';
import StudentRegister from '../components/student/StudentRegister';
import LandingHeader from '../components/base/LandingHeader';
import AuthTemplate from '../components/auth/AuthTemplate';

const StudentRegisterPage = () => {
  return (
    <div>
      <LandingHeader type="student_register" />
      <AuthTemplate>
        <StudentRegister />
      </AuthTemplate>
    </div>
  );
};

export default StudentRegisterPage;
