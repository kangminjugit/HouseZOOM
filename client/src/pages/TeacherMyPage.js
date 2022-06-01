import React from 'react';
import Header from '../components/base/Header';
// import MyPageTemplate from '../components/mypage/MyPageTemplate';
import TeacherMyPageTemplate from '../components/mypage/TeacherMyPageTemplate';

const TeacherMyPage = () => {
  const teacher_user = localStorage.getItem('teacher_user');
  if (!teacher_user) {
    return (
      <div>
        <h2> 4️⃣0️⃣3️⃣ FORBIDDEN</h2>
      </div>
    );
  }
  return (
    <>
      <Header type="teacher" />
      <TeacherMyPageTemplate />
    </>
  );
};

export default TeacherMyPage;
