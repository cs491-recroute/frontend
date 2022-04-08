import LongText from '../components/FormComponents/LongText';
import ShortText from '../components/FormComponents/ShortText';
import Address from '../components/FormComponents/Address';
import DatePicker from '../components/FormComponents/DatePicker';
import DropDown from '../components/FormComponents/DropDown';
import FullName from '../components/FormComponents/FullName';
import Header from '../components/FormComponents/Header';
import Phone from '../components/FormComponents/Phone';
import Upload from '../components/FormComponents/Upload';
import Email from '../components/FormComponents/Email';
import SingleChoice from '../components/FormComponents/SingleChoice';
import MultipleChoice from '../components/FormComponents/MultipleChoice';

import { ComponentTypes, Component} from '../types/models';
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
    Renderer: (props: Partial<Component> & { editMode?: boolean; }) => JSX.Element;
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
    },
    [ComponentTypes.address]: {
        text: translate('Address'),
        type: ComponentTypes.address,
        Renderer: Address,
        defaultProps: {
            type: ComponentTypes.address,
            required: false,
            title: 'Please enter your address',
            placeholder: 'Enter your address'
        }
    },
    [ComponentTypes.datePicker]: {
        text: translate('Date Picker'),
        type: ComponentTypes.datePicker,
        Renderer: DatePicker,
        defaultProps: {
            type: ComponentTypes.datePicker,
            required: false,
            title: 'Select Date',
            placeholder: 'Select Date'
        }
    },
    [ComponentTypes.dropDown]: {
        text: translate('Drop Down'),
        type: ComponentTypes.dropDown,
        Renderer: DropDown,
        defaultProps: {
            type: ComponentTypes.dropDown,
            required: false,
            title: 'Select Options',
            options: [{1: 'option 1'}, {2: 'option 2'}]
        }
    },
    [ComponentTypes.fullName]: {
        text: translate('Full Name'),
        type: ComponentTypes.fullName,
        Renderer: FullName,
        defaultProps: {
            type: ComponentTypes.fullName,
            required: true,
            titles: ['Please enter your name', 'Please enter your surname'],
            placeholders: ['Enter your name', 'Enter your surname']
        }
    },
    [ComponentTypes.header]: {
        text: translate('Header'),
        type: ComponentTypes.header,
        Renderer: Header,
        defaultProps: {
            type: ComponentTypes.header,
            required: false,
            title: 'Please enter',
            placeholder: 'Enter your answer'
        }
    },
    [ComponentTypes.phone]: {
        text: translate('Phone'),
        type: ComponentTypes.phone,
        Renderer: Phone,
        defaultProps: {
            type: ComponentTypes.phone,
            required: false,
            title: 'Please enter you phone number',
            placeholder: 'Enter your phone number'
        }
    },
    [ComponentTypes.upload]: {
        text: translate('Upload'),
        type: ComponentTypes.upload,
        Renderer: Upload,
        defaultProps: {
            type: ComponentTypes.upload,
            required: false,
            title: 'Please upload files here',
            placeholder: 'Select or drag and drop files'
        }
    },
    [ComponentTypes.email]: {
        text: translate('Email'),
        type: ComponentTypes.email,
        Renderer: Email,
        defaultProps: {
            type: ComponentTypes.email,
            required: false,
            title: 'Please enter your Email',
            placeholder: 'Enter your Email'
        }
    },
    [ComponentTypes.singleChoice]: {
        text: translate('Single Choice'),
        type: ComponentTypes.singleChoice,
        Renderer: SingleChoice,
        defaultProps: {
            type: ComponentTypes.singleChoice,
            required: false,
            title: 'Single select',
            options : [
                {
                    _id : "deneme idsi",
                    value: "deneme valuesu"
                },
                {
                    _id : "deneme idsi 2",
                    value: "deneme valuesu 2"
                }
            ]
        }
    },
    [ComponentTypes.multipleChoice]: {
        text: translate('Multiple Choice'),
        type: ComponentTypes.multipleChoice,
        Renderer: MultipleChoice,
        defaultProps: {
            type: ComponentTypes.multipleChoice,
            required: false,
            title: 'Multiple select',
            options : [
                {
                    _id : "deneme idsi",
                    value: "deneme valuesu"
                },
                {
                    _id : "deneme idsi 2",
                    value: "deneme valuesu 2"
                }
            ]
        }
    }
}