import React from 'react';
import Header from '../components/base/Header';
import MyPageTemplate from '../components/mypage/MyPageTemplate';

const StudentMyPage = () => {
  const student_user = localStorage.getItem('student_user');
  if (!student_user) {
    return (
      <div>
        <h2> 4️⃣0️⃣3️⃣ FORBIDDEN </h2>
      </div>
    );
  }
  return (
    <>
      <Header type="student" />
      <MyPageTemplate type="student" />
    </>
  );
};

export default StudentMyPage;
