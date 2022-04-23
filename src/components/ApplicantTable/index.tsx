/* eslint-disable react/jsx-key */
import React, { useEffect, useMemo, useCallback } from 'react';
import { useTable } from 'react-table';
import { Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Paper, styled, tableCellClasses, IconButton } from '@mui/material';
import { fetchSubmissionsAsync, getCurrentFlow, getApplicants, getQueries, applicantNextStageAsync, setSortQuery, getLoading } from '../../redux/slices/submissionsSlice';
import { useAppDispatch, useAppSelector } from '../../utils/hooks';
import { getColumns } from './utils';
import ArrowDown from '@mui/icons-material/KeyboardArrowDown';
import ArrowUp from '@mui/icons-material/KeyboardArrowUp';
import debounce from 'lodash.debounce';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}, &.${tableCellClasses.body}`]: {
        maxWidth: 150,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
    },
    [`&.${tableCellClasses.head}`]: {
        position: 'relative',
        padding: '16px 24px 16px 16px'
    }
}));

const ApplicantTable = () => {
    const dispatch = useAppDispatch();
    const currentFlow = useAppSelector(getCurrentFlow);
    const data = useAppSelector(getApplicants);
    const queries = useAppSelector(getQueries);
    const columns = useMemo(() => getColumns({ flow: currentFlow, ...queries }), [currentFlow, queries]);

    const debouncedFetch = useCallback(debounce(() => {
        dispatch(fetchSubmissionsAsync());
    }, 250), []);

    useEffect(() => {
        debouncedFetch();
    }, [queries]);

    const onNextClick = useCallback(id => {
        dispatch(applicantNextStageAsync(id))
    }, []);

    const { getTableProps, headerGroups, rows, prepareRow, getTableBodyProps } = useTable({ columns, data });

    return <TableContainer component={Paper} style={{ margin: 20 }}>
        <Table {...getTableProps()}>
            <TableHead>
                {headerGroups.map(headerGroup => (
                    <TableRow {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                        {headerGroup.headers.map(({
                            getHeaderProps,
                            id,
                            render,
                            sortable,
                            order_by,
                            sortByKey
                        }: any) => {
                            return <StyledTableCell {...getHeaderProps()} key={id}>
                                {render('Header')}
                                {sortable && <IconButton
                                    size='small'
                                    style={{ 
                                        position: 'absolute',
                                        right: 0,
                                        marginTop: -5
                                    }}
                                    onClick={() => {
                                        let direction;
                                        if (!order_by) direction = 'desc';
                                        else if (order_by === 'desc') direction = 'asc';
                                        dispatch(setSortQuery({ sort_by: sortByKey, order_by: direction }));
                                    }}
                                >
                                    {order_by === 'asc' ? <ArrowUp color='info' /> : <ArrowDown color={order_by ? 'info' : 'disabled'} />}
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
                                        {cell.render('Cell', { onNextClick })}
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