import { TableCell, styled, tableCellClasses } from '@mui/material';

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.root}`]: {
        padding: 8,
        position: 'relative'
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