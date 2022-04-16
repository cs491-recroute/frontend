import React from 'react';
import { useTable } from 'react-table';
import { Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Paper } from '@mui/material';

const ApplicantTable = () => {
    const data = React.useMemo(() => [
        {
            col1: 'Hello',
            col2: 'World'
        },
        {
            col1: 'react-table',
            col2: 'rocks'
        },
        {
            col1: 'whatever',
            col2: 'you want'
        }
    ], []);

    const columns = React.useMemo(() => [
        {
            Header: 'Column 2',
            accessor: 'col1'
        },
        {
            Header: 'Column 2',
            accessor: 'col2'
        }
    ] as const, []);

    const { getTableProps, headerGroups, rows, prepareRow, getTableBodyProps } = useTable({ columns, data });

    return <TableContainer component={Paper} style={{ margin: 20 }}>
        <Table {...getTableProps()}>
            <TableHead>
                {headerGroups.map(headerGroup => (
                    <TableRow {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                        {headerGroup.headers.map(column => (
                            <TableCell {...column.getHeaderProps()} key={column.id}>
                                {column.render('Header')}
                            </TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableHead>
            <TableBody {...getTableBodyProps()}>
                {rows.map((row, i) => {
                    prepareRow(row);
                    return (
                        <TableRow {...row.getRowProps()} key={row.id}>
                            {row.cells.map(cell => {
                                return (
                                    <TableCell {...cell.getCellProps()} key={cell.toString()}>
                                        {cell.render('Cell')}
                                    </TableCell>
                                );
                            })}
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    </TableContainer>
};

export default ApplicantTable;