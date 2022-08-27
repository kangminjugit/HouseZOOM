import React from 'react';
import TeacherHeader from '../../components/base/TeacherHeader';
import ClassSelect from '../../components/class/ClassSelect';

const ClassGenerationPage = () => {
  return (
    <div>
      <TeacherHeader type="반 생성하기" />
      <ClassSelect />
    </div>
  );
};

export default ClassGenerationPage;
