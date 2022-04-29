/* eslint-disable react/jsx-key */
import React, { useEffect, useMemo, useCallback } from 'react';
import { useTable } from 'react-table';
import { Table, TableContainer, TableHead, TableRow, TableBody, Paper, styled, tableRowClasses } from '@mui/material';
import { fetchSubmissionsAsync, getCurrentFlow, getApplicants, getQueries, applicantNextStageAsync } from '../../redux/slices/submissionsSlice';
import { useAppDispatch, useAppSelector } from '../../utils/hooks';
import { getColumns } from './utils';
import debounce from 'lodash.debounce';
import TableHeader from './TableHeader';
import HeaderCell from './HeaderCell';
import BodyCell from './BodyCell';
import { useUser } from '@auth0/nextjs-auth0';
import { getUserID } from '../../utils';
import { HeaderRow, BodyRow } from './StyledComponents';

const ApplicantTable = () => {
    const { user, isLoading } = useUser();
    if (isLoading || !user) return null;

    const dispatch = useAppDispatch();
    const currentFlow = useAppSelector(getCurrentFlow);
    const data = useAppSelector(getApplicants);
    const queries = useAppSelector(getQueries);
    const columns = useMemo(() => getColumns({ flow: currentFlow, userID: getUserID(user), ...queries }), [currentFlow, queries, user]);

    const debouncedFetch = useCallback(debounce(() => {
        dispatch(fetchSubmissionsAsync());
    }, 250), []);

    useEffect(() => {
        debouncedFetch();
    }, [queries]);

    const onNextClick = useCallback(id => {
        dispatch(applicantNextStageAsync(id))
    }, []);

    const { getTableProps, headerGroups, rows, prepareRow, getTableBodyProps, allColumns } = useTable({ columns, data, autoResetHiddenColumns: false });

    if (typeof window === 'undefined') {
        // EuiPopover is not available in SSR
        return null;
    }

    return <div style={{ margin: 20 }}>
        <TableHeader allColumns={allColumns} />
        <TableContainer 
            component={Paper} 
            style={{
                height: 'calc(100vh - 140px)',
                width: 'calc(100vw - 280px)'
            }}
        >
            <Table {...getTableProps()} style={{ borderCollapse: 'separate' }} stickyHeader>
                <TableHead>
                    {headerGroups.map((headerGroup, rowIndex) => (
                        <HeaderRow {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                            {headerGroup.headers.map(column => {
                                return <HeaderCell
                                    column={column} 
                                    rowIndex={rowIndex}
                                />
                            })}     
                        </HeaderRow>
                    ))}
                </TableHead>
                <TableBody {...getTableBodyProps()}>
                    {rows.map((row, i) => {
                        prepareRow(row);
                        return (
                            <BodyRow {...row.getRowProps()} key={row.id}>
                                {row.cells.map(cell => <BodyCell cell={cell} onNextClick={onNextClick} />)}
                            </BodyRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    </div>
};

export default React.memo(ApplicantTable);