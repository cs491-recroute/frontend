/* eslint-disable react/jsx-key */
import React, { useEffect, useMemo, useCallback } from 'react';
import { useTable } from 'react-table';
import { Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Paper, styled, tableCellClasses, tableRowClasses, IconButton, TextField } from '@mui/material';
import { fetchSubmissionsAsync, getCurrentFlow, getApplicants, getQueries, applicantNextStageAsync, setSortQuery, setFilterQuery } from '../../redux/slices/submissionsSlice';
import { useAppDispatch, useAppSelector } from '../../utils/hooks';
import { getColumns } from './utils';
import debounce from 'lodash.debounce';
import TableHeader from './TableHeader';
import HeaderCell from './HeaderCell'; 

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.root}`]: {
        padding: 8
    },
    [`&.${tableCellClasses.head}, &.${tableCellClasses.body}`]: {
        maxWidth: 150,
        minWidth: 150,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        borderRight: `1px solid ${theme.palette.grey[200]}`
    },
    [`&.${tableCellClasses.body}:nth-child(-n+3), &.${tableCellClasses.head}:nth-child(-n+3)`]: {
        position: 'sticky',
        background: 'white',
        zIndex: 10,
        minWidth: 150,
        textOverflow: 'clip'
    },
    [`&.${tableCellClasses.body}:nth-child(1), &.${tableCellClasses.head}:nth-child(1)`]: {
        left: 0
    },
    [`&.${tableCellClasses.body}:nth-child(2), &.${tableCellClasses.head}:nth-child(2)`]: {
        left: 150
    },    
    [`&.${tableCellClasses.body}:nth-child(3), tr:nth-child(2) &.${tableCellClasses.head}:nth-child(3)`]: {
        left: 300,
        [`&::after`]: {
            content: '" "',
            position: 'absolute',
            top: '50%',
            left: '100%',
            transform: 'translate(-50%, -50%)',
            height: '100%',
            borderRight: `3px solid ${theme.palette.grey[400]}`
        }
    },
    [`tr:nth-child(1) &.${tableCellClasses.head}:nth-child(1)`]: {
        zIndex: 20
    }
}));

const HeaderRow = styled(TableRow)(({ theme }) => ({
    [`&.${tableRowClasses.root}`]: {
        position: 'sticky',
        background: 'white',
        zIndex: 100
    },
    [`&.${tableRowClasses.root}:nth-child(1)`]: {
        top: 0
    },
    [`&.${tableRowClasses.root}:nth-child(2)`]: {
        top: 38,
        [`&::after`]: {
            content: '" "',
            position: 'absolute',
            top: '100%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '100%',
            borderBottom: `2px solid ${theme.palette.grey[400]}`,
            zIndex: 1000
        }
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
                                return <StyledTableCell {...column.getHeaderProps()} key={column.id}>
                                    <HeaderCell column={column} rowIndex={rowIndex} />
                                </StyledTableCell>
                            })}     
                        </HeaderRow>
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
    </div>
};

export default React.memo(ApplicantTable);