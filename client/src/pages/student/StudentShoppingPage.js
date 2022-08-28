import React from 'react';
import StudentHeader from '../../components/base/StudentHeader';
import ShoppingNew from '../../components/student/char/ShoppingNew';
import ShoppingTemplate from '../../components/student/char/ShoppingTemplate';

const StudentShoppingPage = () => {
  return (
    <>
      <StudentHeader type="캐릭터 상점" />
      <ShoppingNew />
    </>
  );
};

export default StudentShoppingPage;
