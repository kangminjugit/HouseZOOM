import React from 'react';
import palette from '../../lib/styles/palette';
import styled from 'styled-components';
import { useState, useEffect } from 'react';
import client from '../../axiosConfig';

const StudentTableBlock = styled.div`
  margin-top: 1rem;
  margin-left: 6rem;
  margin-right: 6rem;
  color: ${palette.gray[8]};
`;
const StudentTableTitle = styled.div`
  font-family: 'Pretendard Bold';

  font-size: 1.2rem;
  // 정렬
  display: flex;
  align-items: center;
`;

const StudentTableHeader = styled.div`
  width: 100%;
  height: 3rem;
  border-top: 1px solid ${palette.mint[3]};
  border-bottom: 1px solid ${palette.mint[3]};
  font-family: 'Pretendard Bold';
  display: flex;
  flex-direction: row;
  background-color: ${palette.mint[5]};
`;

const StudentTableRow = styled.div`
  width: 100%;
  height: 3rem;
  border-bottom: 1px solid ${palette.mint[3]};

  display: flex;
  flex-direction: row;
`;

const FirstBlock = styled.div`
  border-right: 1px dotted ${palette.mint[3]};
  // 정렬
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledInput = styled.input`
  height: 2rem;
  margin-right: 0.5rem;
  border: 1px solid ${palette.mint[4]};
  border-radius: 4px;
  outline: none;
  padding-left: 0.5rem;

  &:focus {
    border: 1px solid ${palette.mint[2]};
  }
`;

const StyledButton = styled.button`
  height: 2rem;
  width: 3rem;
  outline: none;
  border: none;
  border-radius: 4px;
  background-color: ${palette.mint[4]};
  &:hover {
    background-color: ${palette.mint[2]};
  }
`;
const StudentTableNew = () => {
  const [studentName, setStudentName] = useState();
  const [point, setPoint] = useState(0);
  const [studentList, setStudentList] = useState();

  // 토큰
  const token = JSON.parse(localStorage.getItem('teacher_user'));
  const accessClient = client.create({
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  const handleClick = (id) => {
    console.log(point);
    console.log(id);
    const url = '/api/point';

    accessClient
      .post(url, {
        studentId: id,
        point: point,
      })
      .then(function (res) {
        alert('포인트 제공 성공');
        window.location.reload();
      })
      .catch(function (err) {
        console.log(err);
        alert('error');
      });
  };

  const handleChange = (e) => {
    const { value } = e.target;
    setPoint(value);
  };

  useEffect(() => {
    const url = '/api/point/class?classId=' + localStorage.getItem('classId');
    accessClient
      .get(url)
      .then(function (res) {
        setStudentList(res.data.data.studentPointArr);
      })
      .catch(function (err) {
        console.log(err.message);
      });
  }, []);

  if (!studentList) return <div></div>;
  return (
    <StudentTableBlock>
      <StudentTableTitle>
        <img src="/icon/list.svg" style={{ height: '1.2rem' }} alt="list" />
        &nbsp; 학생 리스트
      </StudentTableTitle>
      <StudentTableHeader style={{ marginTop: '1rem' }}>
        <FirstBlock style={{ width: '10%' }}>번호</FirstBlock>
        <FirstBlock style={{ width: '30%' }}>이름</FirstBlock>
        <FirstBlock style={{ width: '30%' }}>포인트</FirstBlock>
        <FirstBlock style={{ width: '30%', border: 'none' }}>
          포인트 추가
        </FirstBlock>
      </StudentTableHeader>
      {studentList.map((student, index) => (
        <StudentTableRow key={index}>
          <FirstBlock style={{ width: '10%' }}>{index + 1}</FirstBlock>
          <FirstBlock style={{ width: '30%' }}>{student.name}</FirstBlock>
          <FirstBlock style={{ width: '30%' }}>{student.point} 콩</FirstBlock>
          <FirstBlock style={{ width: '30%', border: 'none' }}>
            <StyledInput placeholder="포인트" onChange={handleChange} />
            <StyledButton
              onClick={() => {
                handleClick(student.id);
              }}
            >
              확인
            </StyledButton>
          </FirstBlock>
        </StudentTableRow>
      ))}
    </StudentTableBlock>
  );
};

export default StudentTableNew;
