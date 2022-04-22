import { ComponentTypes } from './../../../types/models';
import { PartialRecord } from './../../../types/customs';
import { Component } from './../../../types/models';
import TitleEditor from './TitleEditor';
import PlaceholderEditor from './PlaceholderEditor';
import TitlesEditor from './TitlesEditor';
import PlaceholdersEditor from './PlaceholdersEditor';
import OptionsEditor from './OptionsEditor';
import RequiredEditor from './RequiredEditor';

import { ForwardRefExoticComponent, RefObject } from 'react';

export const PROP_EDITORS: PartialRecord<keyof Component, (props: { defaultValue: any; ref: RefObject<{ value: any; }>; }) => ReturnType<ForwardRefExoticComponent<{ value: string; }>>> = {
    title: TitleEditor,
    placeholder: PlaceholderEditor,
    titles: TitlesEditor,
    placeholders: PlaceholdersEditor,
    options: OptionsEditor,
    required: RequiredEditor
};

export const ALLOWED_EDITORS = {
    [ComponentTypes.address]: ['title', 'placeholder', 'required'],
    [ComponentTypes.datePicker]: ['title', 'placeholder', 'required'],
    [ComponentTypes.dropDown]: ['title', 'placeholder', 'options', 'required'],
    [ComponentTypes.header]: ['title', 'placeholder', 'required'],
    [ComponentTypes.longText]: ['title', 'placeholder', 'required'],
    [ComponentTypes.shortText]: ['title', 'placeholder', 'required'],
    [ComponentTypes.fullName]: ['titles', 'placeholders', 'required'],
    [ComponentTypes.multipleChoice]: ['title', 'options', 'required'],
    [ComponentTypes.phone]: ['title', 'placeholder', 'required'],
    [ComponentTypes.number]: ['title', 'placeholder', 'required'],
    [ComponentTypes.singleChoice]: ['title', 'options', 'required'],
    [ComponentTypes.upload]: ['title', 'placeholder', 'required'],
    [ComponentTypes.email]: ['title', 'placeholder', 'required']
}