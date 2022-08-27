import React from 'react';
import AuthTemplate from '../components/auth/AuthTemplate';
import LandingHeader from '../components/base/LandingHeader';
import StudentLoginForm from '../containers/auth/StudentLoginForm';
import { Link } from 'react-router-dom';

const StudentLoginPage = () => {
  return (
    <>
      <LandingHeader type="student_login" />
      <AuthTemplate>
        <StudentLoginForm />
      </AuthTemplate>
    </>
  );
};

export default StudentLoginPage;
