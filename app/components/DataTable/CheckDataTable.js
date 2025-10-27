/* eslint-disable react/button-has-type */
import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import styled from 'styled-components';

const CustomCell = styled(TableCell)`
  min-width: 10vh;
  background: #fafbff;
  text-align: center;
  border-bottom: 1px solid #e4e4e4;
  border: 0px white;
  border-color: #f2f2f2;
  font-weight: 500;
  border: 0px white;
`;
const CustomBodyCell = styled(TableCell)`
  color: #8e929b !important;
`;

export default function CheckedTable(Data) {
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const handleClick = name => {
    let newSelected = '';

    newSelected = newSelected.concat(name);

    Data.setValue(newSelected);
    setSelected(newSelected);
  };

  const isSelected = name => selected.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - Data.rowData.length) : 0;

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
            <TableHead
              sx={{ background: '#fafbff', borderBottom: '1px solid #E4E4E4' }}
            >
              <TableRow>
                <CustomCell padding="checkbox" />
                {Data.headerData.map(headCell => (
                  <CustomCell key={headCell} align="left" padding="normal">
                    {headCell}
                  </CustomCell>
                ))}
                {Data.functionButton && <CustomCell>delete</CustomCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                 rows.sort(getComparator(order, orderBy)).slice() */}
              {Data.rowData.map(row => {
                const isItemSelected = isSelected(row[0]);
                const labelId = row[0];

                return (
                  <TableRow
                    hover
                    onClick={() => handleClick(row[0])}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row[0]}
                    selected={isItemSelected}
                  >
                    <CustomBodyCell padding="checkbox">
                      {Data.check && (
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            'aria-labelledby': labelId,
                          }}
                        />
                      )}
                    </CustomBodyCell>

                    {row.map((d, index) =>
                      index === 0 ? (
                        <CustomBodyCell
                          component="th"
                          id={labelId}
                          scope="row"
                          padding="none"
                          align="left"
                        >
                          {row[0]}
                        </CustomBodyCell>
                      ) : (
                        <CustomBodyCell align="left">{d}</CustomBodyCell>
                      ),
                    )}
                    {Data.functionButton && (
                      <CustomBodyCell>
                        <button
                          onClick={event => {
                            event.stopPropagation();
                            Data.functionButton(Object.values(row)[Data.count]);
                          }}
                        >
                          delete
                        </button>
                      </CustomBodyCell>
                    )}
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow>
                  <TableCell colSpan={9} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {/* {Data.rowData.length > 10 && (
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={Data.rowData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        )} */}
      </Paper>
    </Box>
  );
}
