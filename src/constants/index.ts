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