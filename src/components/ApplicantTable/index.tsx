/* eslint-disable react/jsx-key */
import React, { useEffect, useMemo } from 'react';
import { useTable, useSortBy } from 'react-table';
import { Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Paper, styled, tableCellClasses, IconButton } from '@mui/material';
import { fetchSubmissionsAsync, getCurrentFlow, getApplicants, getQueries} from '../../redux/slices/submissionsSlice';
import { useAppDispatch, useAppSelector } from '../../utils/hooks';
import { getColumns } from './utils';
import ArrowDown from '@mui/icons-material/KeyboardArrowDown';
import ArrowUp from '@mui/icons-material/KeyboardArrowUp';
import ClearIcon from '@mui/icons-material/Clear';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}, &.${tableCellClasses.body}`]: {
        maxWidth: 150,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
    }
}));

const ApplicantTable = () => {
    const dispatch = useAppDispatch();
    const currentFlow = useAppSelector(getCurrentFlow);
    const data = useAppSelector(getApplicants);
    const queries = useAppSelector(getQueries);

    useEffect(() => {
        dispatch(fetchSubmissionsAsync());
    }, [queries]);

    const columns: any[] = useMemo(() => getColumns(currentFlow), [currentFlow]);

    const { getTableProps, headerGroups, rows, prepareRow, getTableBodyProps } = useTable({ columns, data });

    return <TableContainer component={Paper} style={{ margin: 20 }}>
        <Table {...getTableProps()}>
            <TableHead>
                {headerGroups.map((headerGroup, index) => (
                    <TableRow {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                        {headerGroup.headers.map(column => {
                            return <StyledTableCell {...column.getHeaderProps()} key={column.id}>
                                {column.render('Header')}
                                {!!index && <IconButton size='small' disabled>
                                    <ArrowUp/>    
                                </IconButton>}
                            </StyledTableCell>
                        })}     
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
                                    <StyledTableCell {...cell.getCellProps()}>
                                        {cell.render('Cell')}
                                    </StyledTableCell>
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