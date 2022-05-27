import styled from 'styled-components';
import palette from '../../lib/styles/palette';
import StudentTable from './StudentTable';

// 화면 전체 style
const StudentManageTemplateBlock = styled.div`
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

const HeaderBox = styled.div`
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.025);
  padding: 3rem;
  width: 100%;
  height: 100px;
  //background: ${palette.gray[0]};
  font-weight: bold;
  font-size: 1.5rem;
  border-radius: 10px;
  flex-direction: row;
  display: flex;
  //align-items: center;
  justify-content: space-between;
  outline: solid 1px ${palette.gray[3]};
`;

const StudentManageTemplate = () => {
  return (
    <StudentManageTemplateBlock>
      <HeaderBox>우리 반 학생 관리</HeaderBox>
      <StudentTable />
    </StudentManageTemplateBlock>
  );
};

export default StudentManageTemplate;
