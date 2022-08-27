import React, { useState, useEffect } from 'react';
import palette from '../../lib/styles/palette';
import styled from 'styled-components';
import ClassCharacter from './ClassCharacter';
import client from '../../axiosConfig';

const ClassCharBlock = styled.div`
  margin-top: 1rem;
  margin-left: 6rem;
  margin-right: 6rem;
  color: ${palette.gray[8]};
`;

const TitleStyle = styled.div`
  font-family: 'Pretendard Bold';

  font-size: 1.2rem;
  margin-left: 0.5rem;
  // 정렬
  display: flex;
  align-items: center;
`;

const ClassCharRow = styled.div`
  width: 100%;
  height: 15rem;
  margin-top: 1.5rem;

  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: row;
`;

const CharacterBlock = styled.div`
  width: 16%;
  height: 16rem;
  border-radius: 0.25rem;
  margin-left: 1rem;
  border: 1px solid ${palette.mint[4]};
  box-shadow: 0px 0px 4px rgba(51, 51, 51, 0.01);
`;

const NameBlock = styled.div`
  font-family: 'Pretendard Bold';

  // 정렬
  text-align: center;
  margin-top: 1rem;
  margin-bottom: 1rem;
`;

const ClassCharNew = () => {
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState();

  const create_student_list = (arr) => {
    const student_list = [];
    if (arr.length === 0) return;
    const row_len = parseInt(arr.length / 6) + 1;
    const remain = parseInt(arr.length % 6);
    for (let i = 0; i < row_len; i++) {
      if (i === parseInt(arr.length / 6)) {
        const temp = i * 6;
        const student_row = [];
        for (let j = 0; j < remain; j++) {
          student_row.push(arr[temp + j]);
        }
        student_list.push(student_row);
      } else {
        const temp = i * 6;
        const student_row = [];
        for (let j = 0; j < 6; j++) {
          student_row.push(arr[temp + j]);
        }
        student_list.push(student_row);
      }
    }
    return student_list;
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const url =
        '/api/avatar/class?classId=' + localStorage.getItem('classId');
      try {
        const response = await client.get(url);
        setStudents(create_student_list(response.data.data.result));
      } catch (err) {
        console.log(err);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  if (!students) return <div></div>;
  //   console.log(students, students.length);

  return (
    <ClassCharBlock>
      <TitleStyle>
        <img
          src="/icon/character.png"
          style={{ height: '1.2rem' }}
          alt="character"
        />
        &nbsp; 우리반 캐릭터
      </TitleStyle>
      {students.map((student_row, index) => (
        <ClassCharRow>
          {student_row.map((student, index) => (
            <CharacterBlock key={index}>
              <NameBlock>{student.student_name}</NameBlock>
              <div
                style={{
                  position: 'relative',
                  marginTop: '0.5rem',
                  marginLeft: '0.2rem',
                  height: '12rem',
                }}
              >
                <ClassCharacter items={student.itemList} />
              </div>
            </CharacterBlock>
          ))}
        </ClassCharRow>
      ))}
    </ClassCharBlock>
  );
};

export default ClassCharNew;
