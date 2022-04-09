import { ComponentTypes } from './../../../types/models';
import { PartialRecord } from './../../../types/customs';
import { Component } from './../../../types/models';
import TitleEditor from './TitleEditor';
import OptionsEditor from './OptionsEditor';

import { ForwardRefExoticComponent, RefObject } from 'react';

export const PROP_EDITORS: PartialRecord<keyof Component, (props: { defaultValue: any; ref: RefObject<{ value: any; }>; }) => ReturnType<ForwardRefExoticComponent<{ value: string; }>>> = {
    title: TitleEditor,
    options: OptionsEditor
};

export const ALLOWED_EDITORS = {
    [ComponentTypes.address]: ['title'],
    [ComponentTypes.datePicker]: ['title'],
    [ComponentTypes.dropDown]: ['title', 'options'],
    [ComponentTypes.header]: ['title'],
    [ComponentTypes.longText]: ['title'],
    [ComponentTypes.shortText]: ['title'],
    [ComponentTypes.fullName]: ['title'],
    [ComponentTypes.multipleChoice]: ['title', 'options'],
    [ComponentTypes.phone]: ['title'],
    [ComponentTypes.singleChoice]: ['title', 'options'],
    [ComponentTypes.upload]: ['title'],
    [ComponentTypes.email]: ['title']
}