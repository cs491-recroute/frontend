import React from 'react';
import { EuiAccordion, useGeneratedHtmlId, EuiPopover, EuiButton } from '@elastic/eui';
import { Checkbox, FormControlLabel } from '@mui/material';
import { useAppSelector, useAppDispatch } from '../../utils/hooks';
import { getQueries, clearFilters, setSortQuery, fetchSubmissionsAsync } from '../../redux/slices/submissionsSlice';
import styles from './ApplicantTable.module.scss';

type TableHeaderProps = {
    allColumns: any[];
};

const TableHeader = ({ allColumns }: TableHeaderProps) => {
    const dispatch = useAppDispatch();
    const [hideColumnsPopoverIsOpen, setHideColumnsPopoverIsOpen] = React.useState(false);
    const queries = useAppSelector(getQueries);

    const hideCheckboxInfo = allColumns.reduce((acc, curr) => {
        if (curr?.parent?.id === 'Applicant Information') {
            return acc;
        }
        if (!acc[curr?.parent?.id || '']) {
            return { ...acc, [curr?.parent?.id || '']: [ curr ] }
        }
        return {
            ...acc,
            [curr?.parent?.id || '']: [...acc[curr?.parent?.id || ''], curr]
        }
    }, {} as any);

    const extraActionAccordionId = useGeneratedHtmlId({
        prefix: 'extraActionAccordion'
    });

    if (typeof window === 'undefined') {
        // EuiPopover is not available in SSR
        return null;
    }

    return <div className={styles.header}>
        <EuiPopover
            button={
                <EuiButton
                    iconType="arrowDown"
                    iconSide="right"
                    onClick={() => setHideColumnsPopoverIsOpen(true)}
                    size="s"
                    color='text'
                >
                    Toggle Column Visibility
                </EuiButton>
            }
            isOpen={hideColumnsPopoverIsOpen}
            closePopover={() => setHideColumnsPopoverIsOpen(false)}
            anchorPosition="downLeft"
        >
            <div style={{ maxHeight: '70vh', overflow: 'auto' }}>
                {Object.entries(hideCheckboxInfo).map(([key, stageColumns]: any) => {
                    const allSame = stageColumns.every((column: any) => column.getToggleHiddenProps().checked === stageColumns[0].getToggleHiddenProps().checked);
                    const allTrue = stageColumns.every((column: any) => column.getToggleHiddenProps().checked);
                    return <EuiAccordion
                        id={extraActionAccordionId}
                        buttonContent={key}
                        key={key}
                        extraAction={<FormControlLabel 
                            control={<Checkbox
                                checked={allTrue}
                                size="small"
                                indeterminate={allSame === false}
                                onChange={e => {
                                    if (e.target.checked) {
                                        stageColumns.forEach((column: any) => column.getToggleHiddenProps().onChange({ target: { checked: true }}));
                                    } else {
                                        stageColumns.forEach((column: any) => column.getToggleHiddenProps().onChange({ target: { checked: false }}));
                                    }
                                }}
                            />} 
                            label={allTrue ? 'Hide all' : 'Show all'}
                        />}
                    >
                        {stageColumns.map((column: any) => (
                            <div key={column.id}>
                                <label>
                                    <Checkbox {...column.getToggleHiddenProps()} size="small" />
                                    {column.Header}
                                </label>
                            </div>
                        ))}
                    </EuiAccordion>
                })}
            </div>
        </EuiPopover>
        {Object.values(queries.filters).filter(e => e).length > 0 && <EuiButton
            size="s"
            color='text'
            onClick={() => dispatch(clearFilters())}
        >
            Clear Filters
        </EuiButton>}
        {queries.sort_by && <EuiButton
            size="s"
            color='text'
            onClick={() => dispatch(setSortQuery({ sort_by: '', order_by: '' }))}
        >
            Clear Sorting
        </EuiButton>}
        <EuiButton
            size="s"
            color='text'
            onClick={() => dispatch(fetchSubmissionsAsync())}
            style={{ float: 'right' }}
        >
            Refresh
        </EuiButton>
    </div>
};

export default TableHeader;