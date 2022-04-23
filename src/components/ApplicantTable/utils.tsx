import React from 'react';
import { ComponentTypes, Flow, Form, Test, Interview } from './../../types/models';
import { STAGE_TYPE, QUESTION_TYPES } from './../../types/enums';
import { Button } from '@mui/material';
import TaskIcon from '@mui/icons-material/Task';
import SendIcon from '@mui/icons-material/Send';
import { translate } from '../../utils';

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
        return <div title={text}>
            {text}
        </div>;
    };
    Component.displayName = 'CellRenderer';
    return Component;
};

type getColumnsParams = {
    flow: Flow,
    stageIndex?: number,
    stageCompleted?: boolean,
    onNextClick: (id: string) => void,
};
export const getColumns = ({ flow, stageIndex, stageCompleted, onNextClick }: getColumnsParams) => {
    const initialColumns = [
        {
            Header: 'Move to Next Stage',
            accessor: 'id',
            Cell: ({ value: id, row: { original } }: any) => {
                if (!original?.stageCompleted) return null;
                return <Button 
                    variant="outlined" 
                    endIcon={<SendIcon />}
                    onClick={() => {
                        onNextClick(id);
                    }}
                    fullWidth
                >
                    {translate('NEXT')}
                </Button>;
            }
        },
        {
            Header: 'Primary Email',
            accessor: 'email'
        },
        {
            Header: 'Current Stage',
            accessor: 'stageIndex',
            Cell: ({ row: { original } }: any) => {
                if (original.stageIndex === flow.stages.length) return <div>
                    <b style={{ color: 'green' }}>{translate('Finished')}</b>
                </div>;
                const { stageProps } = flow.stages[original.stageIndex];
                return <div style={{ display: 'flex', alignItems: 'center' }} title={`${stageProps.name}${original.stageCompleted ? ' (Completed)' : ''}`}>
                    {stageProps.name}
                    <span style={{ width: 5 }} />
                    {original.stageCompleted && <TaskIcon />}
                </div>
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
                    columns: components.map(({ title, _id: componentID, type: componentType, titles }) => {
                        return {
                            Header: title || (titles && titles[0]) || '',
                            accessor: `stageSubmissions.${stageID}.submissions.${componentID}`,
                            Cell: getCellRenderer(stageType, componentType)
                        }
                    })
                }
            }
            case STAGE_TYPE.TEST: {
                const { name, questions } = stageProps as Test;
                return {
                    Header: name || '',
                    columns: questions.map(({ description, _id: questionID, type: questionType }) => {
                        return {
                            Header: description || '',
                            accessor: `stageSubmissions.${stageID}.submissions.${questionID}`,
                            Cell: getCellRenderer(stageType, questionType)
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
    return [...initialColumns, ...stageColumns];
}