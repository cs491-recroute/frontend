import { translate } from './../../../utils/index';
import { Question } from './../../../types/models';
import { QUESTION_TYPES } from './../../../types/enums';
import OpenEnded from './OpenEnded';
import Coding from '../Questions/Coding';
import MultipleChoice from './MultipleChoice';
import { ReactElement } from 'react';

export type RendererProps = Partial<Question> & { editMode?: boolean; number: number; ref: React.RefObject<{ answer: any; }> };
export const QUESTION_MAPPINGS: Record<QUESTION_TYPES, {
    text: string;
    type: QUESTION_TYPES;
    Renderer: (props: RendererProps) => ReactElement | null;
    defaultProps: Partial<Question>;
}> = {
    [QUESTION_TYPES.OPEN_ENDED]: {
        text: translate('Open Ended'),
        type: QUESTION_TYPES.OPEN_ENDED,
        Renderer: OpenEnded,
        defaultProps: {
            description: 'Please answer the question',
            type: QUESTION_TYPES.OPEN_ENDED
        }
    },
    [QUESTION_TYPES.MULTIPLE_CHOICE]: {
        text: translate('Multiple Choice'),
        type: QUESTION_TYPES.MULTIPLE_CHOICE,
        Renderer: MultipleChoice,
        defaultProps: {
            description: 'Please select the correct option',
            type: QUESTION_TYPES.MULTIPLE_CHOICE,
            options: [
                { description: 'Option 1', isCorrect: false },
                { description: 'Option 2', isCorrect: true },
                { description: 'Option 3', isCorrect: false }
            ]
        }
    },
    [QUESTION_TYPES.CODING]: {
        text: translate('Coding'),
        type: QUESTION_TYPES.CODING,
        Renderer: Coding,
        defaultProps: {
            description: 'Please write the code',
            type: QUESTION_TYPES.CODING,
            testCases: []
        }
    }
}