import { QUESTION_TYPES } from './../../../types/enums';
import OpenEnded from './OpenEnded';

// TODO: Implement renderers for other types
export const QUESTION_MAP = {
    [QUESTION_TYPES.OPEN_ENDED]: {
        Renderer: OpenEnded
    },
    [QUESTION_TYPES.MULTIPLE_CHOICE]: {
        Renderer: OpenEnded
    },
    [QUESTION_TYPES.CODING]: {
        Renderer: OpenEnded
    }
}