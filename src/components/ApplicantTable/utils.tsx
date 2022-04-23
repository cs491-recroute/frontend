import React from 'react';
import { ComponentTypes, Flow, Form, Test, Interview } from './../../types/models';
import { STAGE_TYPE, QUESTION_TYPES } from './../../types/enums';
import { Button } from '@mui/material';
import TaskIcon from '@mui/icons-material/Task';
import SendIcon from '@mui/icons-material/Send';
import { translate } from '../../utils';
import styled from 'styled-components';
import { COMPONENT_MAPPINGS } from '../../constants';
import { QUESTION_MAPPINGS } from '../TestBuilder/Questions/constants';

const Cell = styled.div`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

const getQuestionCell = (questionType: QUESTION_TYPES, props: any) => {
    switch (questionType) {
        default:
            return props?.grade;
    }
};

const getComponentCell = (componentType: ComponentTypes, props: any) => {
    switch (componentType) {
        case ComponentTypes.fullName: {
            const { name = '', surname = '' } = props?.value || {};
            return `${name} ${surname}`;
        }
        default: {
            return props?.value || '';
        }
    }
};

const getCellRenderer = (stageType: STAGE_TYPE, cellType: QUESTION_TYPES | ComponentTypes) => {
    // eslint-disable-next-line react/prop-types
    const Component = ({ value: props }: { value: any }) => {
        if (!props) return '';
        let text;
        switch (stageType) {
            case STAGE_TYPE.FORM: {
                text = getComponentCell(cellType as ComponentTypes, props);
                break;
            }
            case STAGE_TYPE.TEST: {
                text = getQuestionCell(cellType as QUESTION_TYPES, props);
                break;
            }
            case STAGE_TYPE.INTERVIEW: {
                text = 'Not Implemented';
                break;
            }
        }
        return <Cell title={text}>
            {text}
        </Cell>;
    };
    Component.displayName = 'CellRenderer';
    return Component;
};

type getColumnsParams = {
    flow: Flow,
    stageIndex?: number,
    stageCompleted?: boolean,
    sort_by?: string,
    order_by?: 'asc' | 'desc',
};
export const getColumns = ({ flow, stageIndex, stageCompleted, sort_by, order_by }: getColumnsParams) => {
    const initialColumns = [
        {
            Header: 'Primary Email',
            accessor: 'email',
            Cell: ({ value: email }: any) => <Cell title={email}>{email}</Cell>,
            sortable: true,
            sortByKey: 'email'
        },
        {
            Header: 'Current Stage',
            accessor: 'stageIndex',
            Cell: ({ row: { original } }: any) => {
                if (original.stageIndex === flow.stages.length) return <Cell>
                    <b style={{ color: 'green' }}>{translate('Approved')}</b>
                </Cell>;
                const { stageProps } = flow.stages[original.stageIndex];
                return <Cell style={{ display: 'flex', alignItems: 'center' }} title={`${stageProps.name}${original.stageCompleted ? ' (Completed)' : ''}`}>
                    {stageProps.name}
                    <span style={{ width: 5 }} />
                    {original.stageCompleted && <TaskIcon />}
                </Cell>
            }
        },
        {
            Header: 'Move to Next Stage',
            accessor: 'id',
            Cell: ({ value: id, row: { original }, onNextClick }: any) => {
                if (!original?.stageCompleted) return <div style={{ height: 28 }}/>;
                const finishingState = original?.stageIndex + 1 === flow.stages.length;
                return <Button 
                    variant="outlined"
                    color={finishingState ? 'success' : 'info'}
                    endIcon={<SendIcon />}
                    onClick={() => {
                        onNextClick(id);
                    }}
                    fullWidth
                    size="small"
                >
                    {translate(finishingState ? 'APPROVE' : 'NEXT')}
                </Button>;
            }
        }
    ];
    let stages;
    if (stageIndex !== undefined && stageCompleted !== undefined) {
        stages = flow.stages.slice(0, stageIndex + (stageCompleted ? 1 : 0));
    } else {
        stages = [...flow.stages];
    }
    const stageColumns = stages.map(({ stageProps, type: stageType, _id: stageID }) => {
        switch (stageType) {
            case STAGE_TYPE.FORM: {
                const { name, components } = stageProps as Form;
                return {
                    Header: name || '',
                    columns: components.filter(component => !COMPONENT_MAPPINGS[component.type].viewComponent).map(({ title, _id: componentID, type: componentType, titles }) => {
                        const { sortKey, sortable = true } = COMPONENT_MAPPINGS[componentType];
                        return {
                            Header: title || (titles && titles[0]) || '',
                            accessor: `stageSubmissions.${stageID}.submissions.${componentID}`,
                            Cell: getCellRenderer(stageType, componentType),
                            sortable,
                            sortByKey: `stageSubmissions.${stageID}.formSubmission.componentSubmissions.${componentID}.${sortKey}`
                        }
                    })
                }
            }
            case STAGE_TYPE.TEST: {
                const { name, questions } = stageProps as Test;
                return {
                    Header: name || '',
                    columns: questions.map(({ description, _id: questionID, type: questionType }) => {
                        const { sortable = true, sortKey } = QUESTION_MAPPINGS[questionType];
                        return {
                            Header: description || '',
                            accessor: `stageSubmissions.${stageID}.submissions.${questionID}`,
                            Cell: getCellRenderer(stageType, questionType),
                            sortable,
                            sortByKey: `stageSubmissions.${stageID}.testSubmission.questionSubmissions.${questionID}.${sortKey}`
                        }
                    })
                }
            }
            case STAGE_TYPE.INTERVIEW: {
                const { name } = stageProps as Interview;
                return {
                    Header: name || '',
                    accessor: `stageSubmissions.${stageID}.submissions` // ?
                }
            }
        }
    }).filter(e => e);
    const allColumns = [...initialColumns, ...stageColumns];
    if (sort_by && order_by) {
        return allColumns.map(column => {
            const { columns, sortByKey } = column as any;
            if (columns) {
                const newColumns = columns.map((subcolumn: any) => {
                    const { sortByKey: subSortByKey } = subcolumn;
                    if (subSortByKey === sort_by) {
                        return {
                            ...subcolumn,
                            order_by
                        }
                    }
                    return subcolumn;
                });
                return {
                    ...column,
                    columns: newColumns
                }
            }
            if (sortByKey === sort_by) {
                return {
                    ...column,
                    order_by
                }
            }
            return column;
        })
    }
    return allColumns;
}