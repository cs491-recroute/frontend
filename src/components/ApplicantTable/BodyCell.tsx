import React from 'react';
import { StyledTableCell } from './StyledTableCell';
import { ClickAwayListener, IconButton } from '@mui/material';
import styles from './ApplicantTable.module.scss';
import classNames from 'classnames';
import { EuiPopover } from '@elastic/eui';
import InfoIcon from '@mui/icons-material/Info';

type BodyCellProps = {
    cell: any,
    onNextClick: (id: any) => void,
};

const BodyCell = ({ cell, onNextClick }: BodyCellProps) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);

    const handleClickAway = () => {
        setIsFocused(false);
        setIsPopoverOpen(false);
    };
    
    return <ClickAwayListener onClickAway={handleClickAway}>
        <StyledTableCell 
            {...cell.getCellProps()} 
            onClick={() => setIsFocused(true)} 
            className={classNames(styles.bodyCell, cell.getCellProps().className, { [styles.focused]: isFocused })} 
        >
            {cell.render('Cell', { onNextClick })}
            <EuiPopover
                button={isFocused && <IconButton
                    onClick={() => setIsPopoverOpen(e => !e)}
                    color="info"
                    size='small'
                >
                    <InfoIcon />
                </IconButton>}
                isOpen={isPopoverOpen}
                closePopover={() => setIsPopoverOpen(false)}
                anchorPosition="downCenter"
                style={{ position: 'absolute', zIndex: 100000, right: 0, top: 6 }}
            />
        </StyledTableCell>
    </ClickAwayListener>;
};

export default BodyCell;