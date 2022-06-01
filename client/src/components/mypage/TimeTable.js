//import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import React, { useEffect, useState } from 'react';
// import axios from 'axios';
import client from '../../axiosConfig';

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
});

const TimeTable = () => {
  const classes = useStyles();
  const [time_table, setTime_table] = useState(null);
  const [loading, setLoading] = useState(false);

  const create_row = (arr) => {
    const rows = [];
    for (let i = 0; i < 7; i++) {
      var a = [];

      for (let j = 0; j < arr.length; j++) {
        if (arr[j]['period'] === i + 1 && arr[j]['day'] === 'MON') {
          a.push(arr[j]['subject']);
          break;
        } else if (j === arr.length - 1) {
          a.push('');
        }
      }

      for (let j = 0; j < arr.length; j++) {
        if (arr[j]['period'] === i + 1 && arr[j]['day'] === 'TUE') {
          a.push(arr[j]['subject']);
          break;
        } else if (j === arr.length - 1) {
          a.push('');
        }
      }
      for (let j = 0; j < arr.length; j++) {
        if (arr[j]['period'] === i + 1 && arr[j]['day'] === 'WED') {
          a.push(arr[j]['subject']);
          break;
        } else if (j === arr.length - 1) {
          a.push('');
        }
      }
      for (let j = 0; j < arr.length; j++) {
        if (arr[j]['period'] === i + 1 && arr[j]['day'] === 'THU') {
          a.push(arr[j]['subject']);
          break;
        } else if (j === arr.length - 1) {
          a.push('');
        }
      }
      for (let j = 0; j < arr.length; j++) {
        if (arr[j]['period'] === i + 1 && arr[j]['day'] === 'FRI') {
          a.push(arr[j]['subject']);
          break;
        } else if (j === arr.length - 1) {
          a.push('');
        }
      }
      //console.log(a);
      rows.push(createData(a[0], a[1], a[2], a[3], a[4]));
    }
    //console.log(rows);
    return rows;
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        //const response = await axios.get('/api/time-table?classId=23');
        const url =
          '/api/time-table?classId=' + localStorage.getItem('classId');
        const response = await client.get(url);
        setTime_table(create_row(response.data.data.time_table));
      } catch (e) {
        console.log(e);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return <div>로딩중</div>;
  }
  if (!time_table) return null;

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell align="center">Mon</StyledTableCell>
            <StyledTableCell align="center">TUE</StyledTableCell>
            <StyledTableCell align="center">WED</StyledTableCell>
            <StyledTableCell align="center">THUR</StyledTableCell>
            <StyledTableCell align="center">FRI</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {time_table.map((row, index) => (
            <StyledTableRow key={index}>
              <StyledTableCell align="center">{row.name}</StyledTableCell>
              <StyledTableCell align="center">{row.calories}</StyledTableCell>
              <StyledTableCell align="center">{row.fat}</StyledTableCell>
              <StyledTableCell align="center">{row.carbs}</StyledTableCell>
              <StyledTableCell align="center">{row.protein}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TimeTable;
