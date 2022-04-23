import React from 'react';
import { ComponentTypes, Flow, Form, Test, Interview } from './../../types/models';
import { STAGE_TYPE, QUESTION_TYPES } from './../../types/enums';
import TaskIcon from '@mui/icons-material/Task';

const getQuestionCellRenderer = (questionType: QUESTION_TYPES, props: any) => {
    switch (questionType) {
        case QUESTION_TYPES.CODING: {
            return props.code;
        }
        default:
            return '';
    }
};

const getComponentCellRenderer = (componentType: ComponentTypes, props: any) => {
    switch (componentType) {
        case ComponentTypes.fullName: {
            return `${props.name} ${props.surname}`;
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
        switch (stageType) {
            case STAGE_TYPE.FORM: {
                return getComponentCellRenderer(cellType as ComponentTypes, props);
            }
            case STAGE_TYPE.TEST: {
                return getQuestionCellRenderer(cellType as QUESTION_TYPES, props);
            }
            case STAGE_TYPE.INTERVIEW: {
                return <div>Not Implemented</div>;
            }
        }
    };
    Component.displayName = 'CellRenderer';
    return Component;
};

export const getColumns = (flow: Flow) => {
    const initialColumns = [
        {
            Header: 'Primary Email',
            accessor: 'email'
        },
        {
            Header: 'Current Stage',
            accessor: 'stageIndex',
            Cell: ({ row: { original } }: any) => {
                const { stageProps } = flow.stages[original.stageIndex];
                return <div style={{ display: 'flex', alignItems: 'center' }}>
                    {stageProps.name}
                    <span style={{ width: 5 }} />
                    {original.stageCompleted && <TaskIcon />}
                </div>
            }
        }
    ]
    const stageColumns = flow.stages.map(({ stageProps, type: stageType, _id: stageID }) => {
        switch (stageType) {
            case STAGE_TYPE.FORM: {
                const { name, components } = stageProps as Form;
                return {
                    Header: name || '',
                    columns: components.map(({ title, _id: componentID, type: componentType }) => {
                        return {
                            Header: title || '',
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