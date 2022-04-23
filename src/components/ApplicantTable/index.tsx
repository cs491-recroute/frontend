/* eslint-disable react/jsx-key */
import React, { useEffect, useMemo, useCallback } from 'react';
import { useTable, useSortBy } from 'react-table';
import { Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Paper, styled, tableCellClasses, IconButton } from '@mui/material';
import { fetchSubmissionsAsync, getCurrentFlow, getApplicants, getQueries, applicantNextStageAsync } from '../../redux/slices/submissionsSlice';
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

    const onNextClick = useCallback(id => {
        dispatch(applicantNextStageAsync(id))
    }, []);

    const columns: any[] = useMemo(() => getColumns({ flow: currentFlow, onNextClick, ...queries }), [currentFlow, queries?.stageIndex, queries?.stageCompleted, onNextClick]);

    const { getTableProps, headerGroups, rows, prepareRow, getTableBodyProps } = useTable({ columns, data });

    return <TableContainer component={Paper} style={{ margin: 20 }}>
        <Table {...getTableProps()}>
            <TableHead>
                {headerGroups.map((headerGroup, i) => (
                    <TableRow {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                        {headerGroup.headers.map((column, colI) => {
                            return <StyledTableCell {...column.getHeaderProps()} key={column.id}>
                                {column.render('Header')}
                                {!!i && !!colI && <IconButton size='small' disabled>
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