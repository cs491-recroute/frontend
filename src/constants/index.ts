import LongText from '../components/FormComponents/LongText';
import ShortText from '../components/FormComponents/ShortText';
import { ComponentTypes } from '../types/models';
import { translate } from '../utils';
import { STAGE_TYPE } from './../types/enums';
export const MAIN_PAGE = '/flows';

export const STAGE_PROPS = {
    [STAGE_TYPE.FORM]: {
        getEndpoint: '/api/templates/form',
        builderURL: 'formbuilder',
        createEndpoint: '/api/templates/createForm'
    },
    [STAGE_TYPE.TEST]: {
        getEndpoint: '/api/templates/test',
        builderURL: 'testbuilder',
        createEndpoint: '/api/templates/createTest'
    },
    [STAGE_TYPE.INTERVIEW]: {} as any
}

export const COMPONENT_MAPPINGS: Record<any, {
    text: string;
    type: ComponentTypes;
    Renderer: () => JSX.Element;
    defaultProps: Record<any, any>;
}> = {
    [ComponentTypes.shortText]: {
        text: translate('Short Text'),
        type: ComponentTypes.shortText,
        Renderer: ShortText,
        defaultProps: {
            type: ComponentTypes.shortText,
            required: false,
            title: 'Please enter',
            placeholder: 'Enter your answer'
        }
    },
    [ComponentTypes.longText]: {
        text: translate('Long Text'),
        type: ComponentTypes.longText,
        Renderer: LongText,
        defaultProps: {
            type: ComponentTypes.longText,
            required: false,
            title: 'Please enter',
            placeholder: 'Enter your answer'
        }
    }
}