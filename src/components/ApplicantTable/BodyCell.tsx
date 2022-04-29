import React from 'react';
import { StyledTableCell } from './StyledTableCell';
import { ClickAwayListener} from '@mui/material';
import styles from './ApplicantTable.module.scss';
import classNames from 'classnames';

type BodyCellProps = {
    cell: any,
    onNextClick: (id: any) => void,
};

const BodyCell = ({ cell, onNextClick }: BodyCellProps) => {
    const [isFocused, setIsFocused] = React.useState(false);
    
    return <ClickAwayListener onClickAway={() => setIsFocused(false)}>
        <StyledTableCell 
            {...cell.getCellProps()} 
            onClick={() => setIsFocused(true)} 
            className={classNames(styles.bodyCell, cell.getCellProps().className, { [styles.focused]: isFocused })} 
        >
            {cell.render('Cell', { onNextClick, isFocused })}
        </StyledTableCell>
    </ClickAwayListener>;
};

export default BodyCell;