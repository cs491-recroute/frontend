import React, { useEffect, useState } from 'react';
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
import { IconButton } from '@mui/material';
import { EuiPopover, EuiPopoverTitle, EuiProgress, EuiText, EuiAccordion, EuiSpacer } from '@elastic/eui';
import InfoIcon from '@mui/icons-material/Info';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';

const Cell = styled.div`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

const getQuestionCell = (questionType: QUESTION_TYPES, props: any) => {
    let content = null;
    let detailedContent = null;

    switch (questionType) {
        case QUESTION_TYPES.OPEN_ENDED: {
            content = props?.text;
            detailedContent = <pre style={{ whiteSpace: 'pre-wrap' }}>{content}</pre>;
            break;
        }
        case QUESTION_TYPES.CODING:
            content = <EuiProgress
                valueText={true}
                max={100}
                color="primary"
                size="s"
                label='Grade'
                labelProps={{ style: { color: '#0071c2' } }}
                value={props?.percentageGrade || '0'}
            />;
            detailedContent = <>
                <EuiText size='s'>
                    <b>Test Case Results</b>
                </EuiText>
                <EuiSpacer size='s' />
                <div>
                    {props?.testCaseResults.map(({ input, output, passed, points, _id }: any, index: number) => {
                        return <EuiAccordion 
                            id={_id} 
                            key={_id} 
                            buttonContent={<div style={{ display: 'flex'}}>
                                {passed ? <CheckCircleIcon style={{ color: 'green' }} /> : <CancelRoundedIcon style={{ color: 'red' }} />}
                                <b style={{ marginLeft: 5, color: passed ? 'green' : 'red' }}>{`Test Case ${index + 1}`}</b>
                            </div>} 
                            arrowDisplay="none"
                        >
                            <EuiText size='s' style={{ display: 'flex', justifyContent: 'space-between', width: 100 }}><b>Input:</b><span>{input}</span></EuiText>
                            <EuiText size='s' style={{ display: 'flex', justifyContent: 'space-between', width: 100 }}><b>Output:</b>{output}</EuiText>
                            <EuiText size='s' style={{ display: 'flex', justifyContent: 'space-between', width: 100 }}><b>Points:</b>{points}</EuiText>
                        </EuiAccordion>
                    })}
                </div>
                <EuiSpacer size='s'/>
                <hr/>
                <EuiSpacer size='s'/>
                <EuiAccordion 
                    id={props?._id}
                    buttonContent={<b>Code</b>}
                >
                    <pre style={{ whiteSpace: 'pre-wrap' }}>
                        {props?.code}
                    </pre>
                </EuiAccordion>
            </>
            break;
        case QUESTION_TYPES.MULTIPLE_CHOICE:
            content = <EuiProgress
                valueText={true}
                max={100}
                color="primary"
                size="s"
                label='Grade'
                labelProps={{ style: { color: '#0071c2' } }}
                value={props?.percentageGrade || '0'}
            />;
            detailedContent = <>
                <EuiText size='s'>Selected Options</EuiText>
                <hr/>
                <EuiSpacer size='s' />
                {props?.options.map((option: string) => <div key={option} style={{ 
                    marginBottom: '5px',
                    backgroundColor: '#ccc',
                    padding: '5px',
                    borderRadius: '5px',
                    fontSize: '12px',
                    overflow: 'hidden'
                }}
                >{option}</div>)}
            </>;
            break;
    }

    return { content, detailedContent };
};

const getComponentCell = (componentType: ComponentTypes, props: any, applicantID: string, stageID: string, userID: string) => {
    let content = null;
    let detailedContent = null;

    switch (componentType) {
        case ComponentTypes.address:
        case ComponentTypes.longText:
            content = props?.value || '';
            detailedContent = <pre style={{ whiteSpace: 'pre-wrap' }}>{content}</pre>;
            break;
        case ComponentTypes.upload: {
            const { originalName } = props?.value || {};
            if (!originalName) return { content: null };
            content = <a
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
            break;
        }
        case ComponentTypes.datePicker: {
            if (!props?.value) return { content: null };
            content = moment(props?.value).format('DD/MM/YYYY');
            break;
        }
        case ComponentTypes.multipleChoice: {
            const options = props?.value || [];
            if (options.length === 0) return { content: null };

            content = <>
                {options.map((option: string) => <span key={option} style={{ 
                    marginRight: '5px',
                    backgroundColor: '#ccc',
                    padding: '5px',
                    borderRadius: '5px',
                    fontSize: '12px',
                    overflow: 'hidden'
                }}
                >{option}</span>)}
            </>;

            detailedContent = <>
                {options.map((option: string) => <div key={option} style={{ 
                    marginBottom: '5px',
                    backgroundColor: '#ccc',
                    padding: '5px',
                    borderRadius: '5px',
                    fontSize: '12px',
                    overflow: 'hidden'
                }}
                >{option}</div>)}
            </>;
            break;
        }
        case ComponentTypes.fullName: {
            const { name = '', surname = '' } = props?.value || {};
            if (!name && !surname) return { content: null };
            content = `${name} ${surname}`;
            break;
        }
        default: {
            content = props?.value || '';
        }
    }

    return { content, detailedContent };
};

type CellRendererProps<T> = T extends true ? {
    isEmail: T
} : { isEmail?: T, stageType: STAGE_TYPE, cellType?: QUESTION_TYPES | ComponentTypes, stageID: string, userID: string };
function getCellRenderer<T>({ isEmail, ...rest }: CellRendererProps<T>) {
    // eslint-disable-next-line react/prop-types
    const Component = ({ value: props, row: { original: { id: applicantID } }, column: { hideDetailsButton }, isFocused }: any) => {
        const [isPopoverOpen, setIsPopoverOpen] = useState(false);
        useEffect(() => {
            if (!isFocused) setIsPopoverOpen(false);
        }, [isFocused]);
        
        if (!props) return '';

        let content, detailedContent;
        if (isEmail) {
            content = props;
            detailedContent = props;
        } else {
            const { stageType, cellType, stageID, userID } = rest as any;
            switch (stageType) {
                case STAGE_TYPE.FORM: {
                    const componentCell = getComponentCell(cellType as ComponentTypes, props, applicantID, stageID, userID);
                    content = componentCell.content;
                    detailedContent = componentCell.detailedContent || componentCell.content;
                    break;
                }
                case STAGE_TYPE.TEST: {
                    const questionCell = getQuestionCell(cellType as QUESTION_TYPES, props);
                    content = questionCell.content;
                    detailedContent = questionCell.detailedContent || questionCell.content;
                    break;
                }
                case STAGE_TYPE.INTERVIEW: {
                    content = <EuiProgress
                        valueText={true}
                        max={100}
                        color="primary"
                        size="s"
                        label='Grade'
                        labelProps={{ style: { color: '#0071c2' } }}
                        value={props?.grade || '0'}
                    />;
                    detailedContent = props.notes;
                    break;
                }
            }
        }
        if (!content) return '';
        return <>
            <Cell title={content}>
                {content}
            </Cell>
            {!hideDetailsButton && <EuiPopover
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
                style={{ position: 'absolute', zIndex: 1, right: 0, top: 6 }}
            >
                <EuiPopoverTitle paddingSize='s'>Details</EuiPopoverTitle>
                {detailedContent}
            </EuiPopover>}
        </>;
    };
    Component.displayName = 'CellRenderer';
    return Component;
}

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
                Cell: getCellRenderer({ isEmail: true }),
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
                    columns: [
                        {
                            Header: 'Submission Date',
                            accessor: `stageSubmissions.${stageID}.date`,
                            Cell: ({ value }: any) => <div>{value ? moment(value).format('DD.MM.YYYY / HH:mm') : ''}</div>,
                            sortable: true,
                            sortByKey: `stageSubmissions.${stageID}.updatedAt`
                        },
                        ...components
                            .filter(component => !COMPONENT_MAPPINGS[component.type].viewComponent)
                            .map(({ title, name: componentName = '', _id: componentID, type: componentType, titles }) => {
                                const { sortKey, sortable = true, filterable = true } = COMPONENT_MAPPINGS[componentType];
                                return {
                                    Header: () => <span title={title || (titles && titles[0]) || ''}>{componentName}</span>,
                                    accessor: `stageSubmissions.${stageID}.submissions.${componentID}`,
                                    Cell: getCellRenderer({stageType, cellType: componentType, stageID, userID}),
                                    sortable,
                                    filterable,
                                    sortByKey: `stageSubmissions.${stageID}.formSubmission.componentSubmissions.${componentID}.${sortKey}`,
                                    description: componentName
                                }
                            })
                    ]
                }
            }
            case STAGE_TYPE.TEST: {
                const { name, questions } = stageProps as Test;
                return {
                    Header: name || '',
                    columns: [
                        {
                            Header: 'Submission Date',
                            accessor: `stageSubmissions.${stageID}.date`,
                            Cell: ({ value }: any) => <div>{value ? moment(value).format('DD.MM.YYYY / HH:mm') : ''}</div>,
                            sortable: true,
                            sortByKey: `stageSubmissions.${stageID}.updatedAt`
                        },
                        ...questions.map(({ name: questionName, description, _id: questionID, type: questionType }) => {
                            const { sortable = true, sortKey, filterable = true } = QUESTION_MAPPINGS[questionType];
                            return {
                                Header: () => <span title={description}>{questionName}</span>,
                                accessor: `stageSubmissions.${stageID}.submissions.${questionID}`,
                                Cell: getCellRenderer({stageType, cellType: questionType, stageID, userID}),
                                sortable,
                                filterable,
                                sortByKey:  `stageSubmissions.${stageID}.testSubmission.questionSubmissions.${questionID}.${sortKey}`,
                                description: questionName
                            }
                        }),
                        {
                            Header: 'Total Score',
                            accessor: `stageSubmissions.${stageID}.totalScore`,
                            Cell: ({ value }: any) => {
                                if (value === undefined) return null;
                                return <EuiProgress
                                    valueText={true}
                                    max={100}
                                    color="primary"
                                    labelProps={{ style: { color: '#0071c2' } }}
                                    value={value || '0'}
                                />;
                            },
                            sortable: true,
                            sortByKey: `stageSubmissions.${stageID}.testSubmission.grade`
                        }
                    ]
                }
            }
            case STAGE_TYPE.INTERVIEW: {
                const { name } = stageProps as Interview;
                return {
                    Header: name || '',
                    columns: [
                        {
                            Header: '',
                            accessor: `stageSubmissions.${stageID}.submissions`,
                            Cell: getCellRenderer({ stageType, stageID, userID })
                        }
                    ] 
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