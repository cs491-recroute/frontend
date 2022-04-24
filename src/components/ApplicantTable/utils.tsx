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
import moment from 'moment';

const Cell = styled.div`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

const getQuestionCell = (questionType: QUESTION_TYPES, props: any) => {
    switch (questionType) {
        case QUESTION_TYPES.OPEN_ENDED: {
            return props?.text;
        }
        default:
            return props?.grade;
    }
};

const getComponentCell = (componentType: ComponentTypes, props: any, applicantID: string, stageID: string, userID: string) => {
    switch (componentType) {
        case ComponentTypes.upload: {
            const { originalName } = props?.value || {};
            if (!originalName) return null;
            return <a
                href={`https://recroute.co:3501/applicant/${applicantID}/stage/${stageID}/component/${props.componentID}/file?userID=${userID}`}
                download
            >
                <div
                    style={{ 
                        marginRight: '5px',
                        backgroundColor: '#ccc',
                        padding: '5px',
                        borderRadius: '5px',
                        fontSize: '12px',
                        overflow: 'hidden'
                    }}
                >
                    {originalName}
                </div>
            </a>;
        }
        case ComponentTypes.datePicker: {
            if (!props?.value) return '';
            return moment(props?.value).format('DD/MM/YYYY');
        }
        case ComponentTypes.multipleChoice: {
            const options = props?.value || [];
            return <>
                {[...options, ...options].map((option: string) => <span key={option} style={{ 
                    marginRight: '5px',
                    backgroundColor: '#ccc',
                    padding: '5px',
                    borderRadius: '5px',
                    fontSize: '12px',
                    overflow: 'hidden'
                }}
                >{option}</span>)}
            </>
        }
        case ComponentTypes.fullName: {
            const { name = '', surname = '' } = props?.value || {};
            return `${name} ${surname}`;
        }
        default: {
            return props?.value || '';
        }
    }
};

const getCellRenderer = (stageType: STAGE_TYPE, cellType: QUESTION_TYPES | ComponentTypes, stageID: string, userID: string) => {
    // eslint-disable-next-line react/prop-types
    const Component = ({ value: props, row: { original: { id: applicantID } } }: any) => {
        if (!props) return '';
        let text;
        switch (stageType) {
            case STAGE_TYPE.FORM: {
                text = getComponentCell(cellType as ComponentTypes, props, applicantID, stageID, userID);
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
    userID: string,
    stageIndex?: number,
    stageCompleted?: boolean,
    sort_by?: string,
    order_by?: 'asc' | 'desc',
};
export const getColumns = ({ flow, userID, stageIndex, stageCompleted, sort_by, order_by }: getColumnsParams) => {
    const initialColumn = {
        Header: 'Applicant Information',
        accessor: '',
        stickyColumn: true,
        columns: [
            {
                Header: 'Primary Email',
                accessor: 'email',
                Cell: ({ value: email }: any) => <Cell title={email}>{email}</Cell>,
                sortable: true,
                filterable: true,
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
                        {original.stageCompleted && <>
                            <TaskIcon />
                            <span style={{ width: 5 }} />
                        </>}
                        {stageProps.name}
                    </Cell>
                }
            },
            {
                Header: 'Action',
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
        ]
    };
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
                        const { sortKey, sortable = true, filterable = true } = COMPONENT_MAPPINGS[componentType];
                        return {
                            Header: title || (titles && titles[0]) || '',
                            accessor: `stageSubmissions.${stageID}.submissions.${componentID}`,
                            Cell: getCellRenderer(stageType, componentType, stageID, userID),
                            sortable,
                            filterable,
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
                        const { sortable = true, sortKey, filterable = true } = QUESTION_MAPPINGS[questionType];
                        return {
                            Header: description || '',
                            accessor: `stageSubmissions.${stageID}.submissions.${questionID}`,
                            Cell: getCellRenderer(stageType, questionType, stageID, userID),
                            sortable,
                            filterable,
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
    const allColumns = [initialColumn, ...stageColumns];
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