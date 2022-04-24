import React from 'react';
import { TablePagination, useTheme, Box, IconButton } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../utils/hooks';
import { getMetadata, setPaginationQuery } from '../../redux/slices/submissionsSlice';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import styles from './ApplicantTable.module.scss';

type PaginationActionsProps = {
    count: number,
    onPageChange: (event: any, page: number) => void,
    page: number,
    rowsPerPage: number,
};

function TablePaginationActions(props: PaginationActionsProps) {
    const { hasPrevPage, hasNextPage } = useAppSelector(getMetadata);
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;
  
    const handleFirstPageButtonClick = (event: any) => {
        onPageChange(event, 0);
    };
  
    const handleBackButtonClick = (event: any) => {
        onPageChange(event, page - 1);
    };
  
    const handleNextButtonClick = (event: any) => {
        onPageChange(event, page + 1);
    };
  
    const handleLastPageButtonClick = (event: any) => {
        onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };
  
    return (
        <Box sx={{ flexShrink: 0, ml: 2.5 }}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label="first page"
            >
                {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
            </IconButton>
            <IconButton
                onClick={handleBackButtonClick}
                disabled={!hasPrevPage}
                aria-label="previous page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={!hasNextPage}
                aria-label="next page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page"
            >
                {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
            </IconButton>
        </Box>
    );
}
  
const Pagination = () => {
    const metadata = useAppSelector(getMetadata);
    const dispatch = useAppDispatch();

    const handleChangePage = (_: any, newPage: number) => {
        dispatch(setPaginationQuery({ page: newPage + 1, limit: metadata.limit }));
    };

    const handleChangeRowsPerPage = (event: any) => {
        dispatch(setPaginationQuery({ page: 1, limit: event.target.value }));
    };

    return <TablePagination
        component={props => <div {...props} className={styles.pagination}/>}
        rowsPerPageOptions={[5, 10, 25, 50, 100]}
        count={metadata.totalDocs}
        rowsPerPage={metadata.limit}
        page={metadata.page - 1}
        ActionsComponent={TablePaginationActions}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
    />;
}

export default Pagination;