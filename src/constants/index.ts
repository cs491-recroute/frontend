import LongText from '../components/FormComponents/LongText';
import ShortText from '../components/FormComponents/ShortText';
import Address from '../components/FormComponents/Address';
import DatePicker from '../components/FormComponents/DatePicker';
import DropDown from '../components/FormComponents/DropDown';
import FullName from '../components/FormComponents/FullName';
import Header from '../components/FormComponents/Header';
import Number from '../components/FormComponents/Number';
import Phone from '../components/FormComponents/Phone';
import Upload from '../components/FormComponents/Upload';
import Email from '../components/FormComponents/Email';
import SingleChoice from '../components/FormComponents/SingleChoice';
import MultipleChoice from '../components/FormComponents/MultipleChoice';
import { ReactElement } from 'react';

import { ComponentTypes, Component } from '../types/models';
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

export type ComponentRef = { answer: any, invalid: boolean, triggerError: () => void, type?: ComponentTypes };

export const COMPONENT_MAPPINGS: Record<any, {
    text: string;
    type: ComponentTypes;
    Renderer: (props: Partial<Component> & { editMode?: boolean; ref?: React.RefObject<ComponentRef>; }) => ReactElement | null;
    defaultProps: Record<any, any>;
    viewComponent?: boolean;
    sortKey: string;
    sortable?: boolean;
    filterable?: boolean;
}> = {
    [ComponentTypes.shortText]: {
        text: translate('Short Text'),
        type: ComponentTypes.shortText,
        Renderer: ShortText,
        defaultProps: {
            type: ComponentTypes.shortText,
            required: false,
            title: 'Please Enter Your Text',
            name: 'Short Text',
            placeholder: 'Enter your text'
        },
        sortKey: 'text'
    },
    [ComponentTypes.longText]: {
        text: translate('Long Text'),
        type: ComponentTypes.longText,
        Renderer: LongText,
        defaultProps: {
            type: ComponentTypes.longText,
            required: false,
            title: 'Please Enter Your Text',
            name: 'Long Text',
            placeholder: 'Enter your text'
        },
        sortKey: 'text'
    },
    [ComponentTypes.number]: {
        text: translate('Number'),
        type: ComponentTypes.number,
        Renderer: Number,
        defaultProps: {
            type: ComponentTypes.number,
            required: false,
            title: 'Please Enter a Number',
            name: 'Number',
            placeholder: 'Enter a number'
        },
        sortKey: 'number'
    },
    [ComponentTypes.address]: {
        text: translate('Address'),
        type: ComponentTypes.address,
        Renderer: Address,
        defaultProps: {
            type: ComponentTypes.address,
            required: false,
            title: 'Please Enter Your Address',
            name: 'Address',
            placeholder: 'Enter your address'
        },
        sortKey: 'address'
    },
    [ComponentTypes.datePicker]: {
        text: translate('Date Picker'),
        type: ComponentTypes.datePicker,
        Renderer: DatePicker,
        defaultProps: {
            type: ComponentTypes.datePicker,
            required: false,
            title: 'Please Select a Date',
            name: 'Date',
            placeholder: 'Select date'
        },
        sortKey: 'date',
        filterable: false
    },
    [ComponentTypes.dropDown]: {
        text: translate('Drop Down'),
        type: ComponentTypes.dropDown,
        Renderer: DropDown,
        defaultProps: {
            type: ComponentTypes.dropDown,
            required: false,
            title: 'Please Select an Option',
            name: 'Drop Down',
            options: ['Default Option 1', 'Default Option 2']
        },
        sortKey: 'selection',
        sortable: false,
        filterable: false
    },
    [ComponentTypes.fullName]: {
        text: translate('Full Name'),
        type: ComponentTypes.fullName,
        Renderer: FullName,
        defaultProps: {
            type: ComponentTypes.fullName,
            required: false,
            titles: ['Please Enter Your Name', 'Please Enter Your Surname'],
            name: 'Full Name',
            placeholders: ['Enter your name', 'Enter your surname']
        },
        sortKey: 'name'
    },
    [ComponentTypes.header]: {
        text: translate('Header'),
        type: ComponentTypes.header,
        Renderer: Header,
        defaultProps: {
            type: ComponentTypes.header,
            title: 'This is a Header',
            name: 'Header',
            required: false
        },
        viewComponent: true,
        sortKey: 'text'
    },
    [ComponentTypes.phone]: {
        text: translate('Phone'),
        type: ComponentTypes.phone,
        Renderer: Phone,
        defaultProps: {
            type: ComponentTypes.phone,
            required: false,
            title: 'Please Enter Your Phone Number',
            name: 'Phone Number',
            placeholder: 'Enter your phone number'
        },
        sortKey: 'phoneNumber'
    },
    [ComponentTypes.upload]: {
        text: translate('Upload'),
        type: ComponentTypes.upload,
        Renderer: Upload,
        defaultProps: {
            type: ComponentTypes.upload,
            required: false,
            title: 'Please Upload Files Here',
            name: 'File Upload',
            placeholder: 'Select or drag and drop files'
        },
        sortKey: 'upload',
        sortable: false,
        filterable: false
    },
    [ComponentTypes.email]: {
        text: translate('Email'),
        type: ComponentTypes.email,
        Renderer: Email,
        defaultProps: {
            type: ComponentTypes.email,
            required: false,
            title: 'Please Enter Your Email',
            name: 'Email',
            placeholder: 'Enter your email'
        },
        sortKey: 'email'
    },
    [ComponentTypes.singleChoice]: {
        text: translate('Single Choice'),
        type: ComponentTypes.singleChoice,
        Renderer: SingleChoice,
        defaultProps: {
            type: ComponentTypes.singleChoice,
            required: false,
            title: 'Please Select an Option',
            name: 'Single Choice Component',
            options: ['Default Option 1', 'Default Option 2']
        },
        sortable: false,
        sortKey: 'selection',
        filterable: false
    },
    [ComponentTypes.multipleChoice]: {
        text: translate('Multiple Choice'),
        type: ComponentTypes.multipleChoice,
        Renderer: MultipleChoice,
        defaultProps: {
            type: ComponentTypes.multipleChoice,
            required: false,
            title: 'Please Select Option(s)',
            name: 'Multiple Choice Question',
            options: ['Default Option 1', 'Default Option 2']
        },
        sortable: false,
        sortKey: 'selections',
        filterable: false
    }
}