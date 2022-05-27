import React, { useEffect, useState } from 'react';
// import axios from 'axios';
import client from '../../axiosConfig';
// import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

// function createData(
//   name: string,
//   calories: number,
//   fat: number,
//   carbs: number,
//   protein: number,
// ) {
//   return { name, calories, fat, carbs, protein };
// }

const null_arr = [''];

function createData(id: number, name: string, point: number) {
  return { id, name, point };
}

// const rows = [
//   createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
//   createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
//   createData('Eclair', 262, 16.0, 24, 6.0),
//   createData('Cupcake', 305, 3.7, 67, 4.3),
//   createData('Gingerbread', 356, 16.0, 49, 3.9),
// ];

const StudentTable = () => {
  const [loading, setLoading] = useState(false);
  //   const [students, setStudents] = useState();
  const [rows, setRows] = useState();

  // 토큰
  const token = JSON.parse(localStorage.getItem('teacher_user'));
  const accessClient = client.create({
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  const create_row = (arr) => {
    const row = [];
    for (let j = 0; j < arr.length; j++) {
      row.push(createData(j + 1, arr[j].name, arr[j].point));
    }
    console.log(row);
    return row;
  };
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      accessClient
        .get('/api/point/class?classId=23')
        .then(function (response) {
          console.log(response);
          //   setStudents(response.data.data.studentPointArr);
          console.log(response.data.data.studentPointArr);
          setRows(create_row(response.data.data.studentPointArr));
        })
        .catch(function (err) {
          console.log(err);
        });
      setLoading(false);
    };
    fetchData();
  }, []);
  //   if (loading) {
  //     return <div>로딩중</div>;
  //   }
  //   if (!students) return setStudents(null_arr);
  if (!rows) return setRows(null_arr);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            {/* <TableCell>Dessert (100g serving)</TableCell> */}
            <TableCell align="right">번호</TableCell>
            <TableCell align="right">이름</TableCell>
            <TableCell align="right">포인트 현황</TableCell>
            {/* <TableCell align="right">Protein&nbsp;(g)</TableCell> */}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow
              key={index}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              {/* <TableCell component="th" scope="row">
                {row.name}
              </TableCell> */}
              <TableCell align="right">{row.id}</TableCell>
              <TableCell align="right">{row.name}</TableCell>
              <TableCell align="right">{row.point}</TableCell>
              {/* <TableCell align="right">{row.protein}</TableCell> */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default StudentTable;
