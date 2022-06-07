import React from 'react';
import { Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import StudentRegisterPage from './pages/StudentRegisterPage';
import TeacherRegisterPage from './pages/TeacherRegisterPage';
import StudentMyPage from './pages/StudentMyPage';
import TeacherLoginPage from './pages/TeacherLoginPage';
import StudentLoginPage from './pages/StudentLoginPage';
import TeacherMyPage from './pages/TeacherMyPage';
import ClassGenerationPage from './pages/teacher/ClassGenerationPage';
import ManageStudentPage from './pages/teacher/ManageStudentPage';
import StudentCharPage from './pages/student/StudentCharPage';
import StudentStorePage from './pages/student/StudentStorePage';
import StudentShoppingPage from './pages/student/StudentShoppingPage';
import ClassCharPage from './pages/ClassCharPage';
import TimeTable from './pages/teacher/TimeTable';

const App = () => {
  return (
    <>
      <Route component={LandingPage} path="/" exact />
      <Route component={LoginPage} path="/login" />
      <Route component={StudentLoginPage} path="/studentLogin" />
      <Route component={TeacherLoginPage} path="/teacherLogin" />
      <Route component={StudentRegisterPage} path="/studentRegister" />
      <Route component={TeacherRegisterPage} path="/teacherRegister" />
      <Route component={StudentMyPage} path="/studentMyPage" />
      <Route component={TeacherMyPage} path="/teacherMyPage" />
      <Route
        component={ClassGenerationPage}
        path="/teacher/ClassGenerationPage"
      />
      <Route component={ManageStudentPage} path="/teacher/ManageStudentPage" />
      <Route component={StudentCharPage} path="/student/CharPage" />
      <Route component={StudentStorePage} path="/student/StorePage" />
      <Route component={StudentShoppingPage} path="/student/ShoppingPage" />
      <Route component={ClassCharPage} path="/ClassCharPage" />
      <Route component={TimeTable} path="/teacher/TimeTablePage" />
    </>
  );
};

export default App;
