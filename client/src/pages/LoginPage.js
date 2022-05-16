import React from 'react';
import AuthTemplate from '../components/auth/AuthTemplate';
import LoginForm from '../containers/auth/LoginForm';
import Header from '../components/base/Header';

const LoginPage = () => {
  return (
    <div>
      <Header />
      <AuthTemplate>
        <LoginForm />
      </AuthTemplate>
    </div>
  );
};

export default LoginPage;
