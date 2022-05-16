import React from 'react';
import Header from '../../components/base/Header';
import ClassSelect from '../../components/class/ClassSelect';

const ClassGenerationPage = () => {
  return (
    <div>
      <Header type="teacher" />
      <ClassSelect />
    </div>
  );
};

export default ClassGenerationPage;
