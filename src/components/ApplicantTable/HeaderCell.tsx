import React, { useCallback } from 'react';
import styles from './ApplicantTable.module.scss';
import { EuiFieldText } from '@elastic/eui';
import { IconButton } from '@mui/material';
import ArrowDown from '@mui/icons-material/KeyboardArrowDown';
import ArrowUp from '@mui/icons-material/KeyboardArrowUp';
import debounce from 'lodash.debounce';
import { translate } from '../../utils';
import { useAppDispatch, useAppSelector } from '../../utils/hooks';
import { setFilterQuery, setSortQuery, getQueries } from '../../redux/slices/submissionsSlice';
import { StyledTableCell } from './StyledTableCell';

type HeaderCellProps = {
    column: any,
    rowIndex: number,
};

const HeaderCell = ({ column: {
    render,
    filterable,
    sortByKey,
    sortable,
    order_by,
    id,
    getHeaderProps
}, rowIndex }: HeaderCellProps) => {
    const [filterValue, setFilterValue] = React.useState('');
    const dispatch = useAppDispatch();
    const queries = useAppSelector(getQueries);
    const debouncedFilterChange = useCallback(debounce((e, sortKey) => {
        dispatch(setFilterQuery({ filter_by: sortKey, filter_text: e.target.value }))
    }, 250), []);

    React.useEffect(() => {
        if (!queries.filters[sortByKey]) {
            setFilterValue('');
        }
    }, [queries]);

    return <StyledTableCell {...getHeaderProps()} key={id} >
        {render('Header')}
        {!!rowIndex && <div className={styles.filterRow}>
            {filterable && <EuiFieldText 
                style={{ height: 31 }} 
                placeholder={translate('Filter')}
                onChange={e => {
                    debouncedFilterChange(e, sortByKey);
                    setFilterValue(e.target.value);
                }}
                value={filterValue}
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
};

export default HeaderCell;