import React from 'react';
// import MyPageTemplate from '../components/mypage/MyPageTemplate';
import StudentMyPageTemplate from '../components/mypage/StudentMyPageTemplate';
import StudentHeader from '../components/base/StudentHeader';

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
      <StudentHeader type="마이페이지" />
      <StudentMyPageTemplate />
    </>
  );
};

export default StudentMyPage;
