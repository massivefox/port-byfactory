/**
 *
 * DataTable
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
// import styled from 'styled-components';
import Tooltip from '@mui/material/Tooltip';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import styled from 'styled-components';
const CaptionH1 = styled.h1`
  min-width: max-content;
`;

function DataTable({ caption, header, data, tooltip }) {
  const valueFuncs = [];
  const columns = header.map(el => {
    let n = el;
    if (typeof el === 'object') {
      n = n.header;
      valueFuncs.push(el.generator);
    } else {
      valueFuncs.push((row, i) => row[i]);
    }

    return {
      id: n.toLowerCase().replace(' ', '-'),
      label: n,
      align: 'center',
    };
  });

  const captionKey = caption.toLowerCase().replace(' ', '-');
  const createData = (row, ind) => {
    const ret = {};
    for (let i = 0; i < header.length; i++) {
      ret[columns[i].id] = valueFuncs[i](row, i);
    }
    ret.rowkey = `${captionKey}-row-${ind}`;

    return ret;
  };
  let rows = {};
  if (data !== undefined) {
    rows = data.map((row, i) => createData(row, i));
  }

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const pagenationCompare = props => {
    if (props > 10) {
      return true;
    }
    return false;
  };
  return (
    <div style={{ textAlign: 'center', width: '100%' }}>
      <CaptionH1>
        {caption}
        {tooltip && (
          <Tooltip
            title={
              <div style={{ whiteSpace: 'pre-line' }}>{tooltip || ''}</div>
            }
            arrow
            placement="right-start"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              viewBox="0 0 256 256"
              style={{ marginLeft: '6px' }}
            >
              <rect width="256" height="256" fill="none" />
              <circle
                cx="128"
                cy="128"
                r="96"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="24"
              />
              <polyline
                points="120 124 128 124 128 176 136 176"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="24"
              />
              <circle cx="126" cy="84" r="16" />
            </svg>
          </Tooltip>
        )}
      </CaptionH1>

      <Paper
        sx={{
          width: '100%',
          overflow: 'hidden',
          /* backgroundColor: 'var(--gray)', */
        }}
      >
        <TableContainer sx={{ maxHeight: 440, backgroundColor: 'var(--gray)' }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map(column => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{
                      minWidth: '10vh',
                      backgroundColor: 'var(--shadows)',
                      color: 'white',
                      textAlign: 'center',
                    }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            {data && (
              <TableBody>
                {rows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map(row => (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.rowkey}
                    >
                      {columns.map(column => {
                        const value = row[column.id];
                        return (
                          <TableCell
                            key={column.id}
                            align={column.align}
                            sx={{ maxWidth: 200 }}
                          >
                            {column.format && typeof value === 'number'
                              ? column.format(value)
                              : value}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
              </TableBody>
            )}
          </Table>
        </TableContainer>
        <div>
          {pagenationCompare(rows.length) ? (
            <TablePagination
              rowsPerPageOptions={[10, 25, 100]}
              component="div"
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          ) : null}
        </div>
      </Paper>
    </div>
  );
}

// Example
// caption: Table name
// header: [id, name, description, {header:'header name', manipulation: row=> row[2] *300}]
// data: [ [1,'name','description'], [2,'name',description] ]
DataTable.propTypes = {
  caption: PropTypes.string.isRequired,
  header: PropTypes.array.isRequired,
  data: PropTypes.arrayOf(PropTypes.array).isRequired,
  tooltip: PropTypes.string.isRequired,
};

export default DataTable;
