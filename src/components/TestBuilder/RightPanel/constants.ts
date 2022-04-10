import { QUESTION_TYPES } from './../../../types/enums';
import { PartialRecord } from './../../../types/customs';
import { Question } from './../../../types/models';
import DescriptionEditor from './DescriptionEditor';
import OptionsEditor from './OptionsEditor';
import TestCasesEditor from './TestCasesEditor';
import PointsEditor from './PointsEditor';
import { ForwardRefExoticComponent, RefObject } from 'react';

export const PROP_EDITORS: PartialRecord<keyof Question, (props: { defaultValue: any; ref: RefObject<{ value: any; }>; }) => ReturnType<ForwardRefExoticComponent<{ value: string; }>>> = {
    description: DescriptionEditor,
    options: OptionsEditor,
    testCases: TestCasesEditor,
    points: PointsEditor
};

export const ALLOWED_EDITORS = {
    [QUESTION_TYPES.OPEN_ENDED]: ['description'],
    [QUESTION_TYPES.MULTIPLE_CHOICE]: ['description', 'options', 'points'],
    [QUESTION_TYPES.CODING]: ['description', 'testCases']
}