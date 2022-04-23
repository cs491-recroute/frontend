/* eslint-disable react/jsx-key */
import React, { useEffect, useMemo, useCallback } from 'react';
import { useTable } from 'react-table';
import { Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Paper, styled, tableCellClasses, tableRowClasses, IconButton, TextField } from '@mui/material';
import { fetchSubmissionsAsync, getCurrentFlow, getApplicants, getQueries, applicantNextStageAsync, setSortQuery, setFilterQuery } from '../../redux/slices/submissionsSlice';
import { useAppDispatch, useAppSelector } from '../../utils/hooks';
import { getColumns } from './utils';
import ArrowDown from '@mui/icons-material/KeyboardArrowDown';
import ArrowUp from '@mui/icons-material/KeyboardArrowUp';
import debounce from 'lodash.debounce';
import { translate } from '../../utils';
import { EuiFieldText } from '@elastic/eui';
import styles from './ApplicantTable.module.scss';

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
        zIndex: 20,
        [`&::after`]: {
            content: '" "',
            position: 'absolute',
            top: '50%',
            left: '100%',
            transform: 'translate(-50%, -50%)',
            height: '100%',
            borderRight: `3px solid ${theme.palette.grey[400]}`
        }
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

    const debouncedFilterChange = useCallback(sortByKey => debounce(e => {
        dispatch(setFilterQuery({ filter_by: sortByKey, filter_text: e.target.value }))
    }, 500), []);

    const { getTableProps, headerGroups, rows, prepareRow, getTableBodyProps } = useTable({ columns, data });

    return <TableContainer component={Paper} style={{ margin: 20 }}>
        <Table {...getTableProps()} style={{ borderCollapse: 'separate' }} stickyHeader>
            <TableHead>
                {headerGroups.map((headerGroup, rowIndex) => (
                    <HeaderRow {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                        {headerGroup.headers.map(({
                            getHeaderProps,
                            id,
                            render,
                            sortable,
                            order_by,
                            sortByKey,
                            filterable
                        }: any) => {
                            return <StyledTableCell {...getHeaderProps()} key={id}>
                                {render('Header')}
                                {!!rowIndex && <div className={styles.filterRow}>
                                    {filterable && <EuiFieldText 
                                        style={{ height: 31 }} 
                                        placeholder={translate('Filter')}
                                        onChange={debouncedFilterChange(sortByKey)}
                                    />}
                                    {sortable && <IconButton
                                        size='small'
                                        onClick={() => {
                                            let direction;
                                            if (!order_by) direction = 'desc';
                                            else if (order_by === 'desc') direction = 'asc';
                                            dispatch(setSortQuery({ sort_by: sortByKey, order_by: direction }));
                                        }}
                                    >
                                        {order_by === 'asc' ? <ArrowUp color='info' /> : <ArrowDown color={order_by ? 'info' : 'disabled'} />}
                                    </IconButton>}
                                </div>}
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
};

export default React.memo(ApplicantTable);