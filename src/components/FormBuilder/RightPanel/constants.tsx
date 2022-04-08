import { ComponentTypes } from './../../../types/models';
import { PartialRecord } from './../../../types/customs';
import { Component } from './../../../types/models';
import TitleEditor from './TitleEditor';

import { ForwardRefExoticComponent, RefObject } from 'react';

export const PROP_EDITORS: PartialRecord<keyof Component, (props: { defaultValue: any; ref: RefObject<{ value: any; }>; }) => ReturnType<ForwardRefExoticComponent<{ value: string; }>>> = {
    title: TitleEditor
};

export const ALLOWED_EDITORS = {
    [ComponentTypes.address]: ['title'],
    [ComponentTypes.datePicker]: ['title'],
    [ComponentTypes.dropDown]: ['title'],
    [ComponentTypes.header]: ['title'],
    [ComponentTypes.longText]: ['title'],
    [ComponentTypes.shortText]: ['title'],
    [ComponentTypes.fullName]: ['title'],
    [ComponentTypes.multipleChoice]: ['title'],
    [ComponentTypes.phone]: ['title'],
    [ComponentTypes.singleChoice]: ['title'],
    [ComponentTypes.upload]: ['title'],
    [ComponentTypes.email]: ['title']
}