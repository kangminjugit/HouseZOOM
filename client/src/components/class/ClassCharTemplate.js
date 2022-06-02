import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import palette from '../../lib/styles/palette';
import ClassCharList from './ClassCharList';
import client from '../../axiosConfig';

// 화면 전체 style
const ClassCharTemplateBlock = styled.div`
  position: flex;
  left: 10px;
  right: 10px;
  top: 10px;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const CharacterBox = styled.div`
  margin: 1rem;
  display: flex;
  position: flex;
  width: 100%;
  flex-direction: row;
`;

const HeaderBox = styled.div`
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.025);
  padding: 2rem;
  width: 100%;
  height: 100px;
  //background: ${palette.gray[0]};
  font-weight: bold;
  font-size: 1.5rem;
  border-radius: 10px;
  flex-direction: row;
  display: flex;
  align-items: center;
  justify-content: space-between;
  outline: solid 1px ${palette.gray[3]};
`;

const null_arr = [''];

const ClassCharTemplate = () => {
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState();
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const url =
        '/api/avatar/class?classId=' + localStorage.getItem('classId');
      try {
        const response = await client.get(url);
        console.log(response);
        setStudents(response.data.data.result);
      } catch (err) {
        console.log(err);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return <div>로딩중</div>;
  }
  if (!students) return;

  return (
    <ClassCharTemplateBlock>
      <HeaderBox style={{ marginTop: '1rem' }}>우리반 캐릭터 페이지</HeaderBox>
      <CharacterBox>
        {students.map((student, index) => (
          <ClassCharList
            key={index}
            student_name={student.student_name}
            items={student.itemList}
          />
        ))}
      </CharacterBox>

      {/* {students.map((student, index) => (
        <ClassCharList
          key={index}
          student_name={student.student_name}
          items={student.itemList}
        />
      ))} */}
    </ClassCharTemplateBlock>
  );
};

export default ClassCharTemplate;
