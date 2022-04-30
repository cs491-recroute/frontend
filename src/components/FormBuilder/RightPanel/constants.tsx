import { ComponentTypes } from './../../../types/models';
import { PartialRecord } from './../../../types/customs';
import { Component } from './../../../types/models';
import TitleEditor from './TitleEditor';
import PlaceholderEditor from './PlaceholderEditor';
import TitlesEditor from './TitlesEditor';
import PlaceholdersEditor from './PlaceholdersEditor';
import OptionsEditor from './OptionsEditor';
import RequiredEditor from './RequiredEditor';
import NameEditor from './NameEditor';

import { ForwardRefExoticComponent, RefObject } from 'react';

export const PROP_EDITORS: PartialRecord<keyof Component, (props: { defaultValue: any; ref: RefObject<{ value: any; }>; }) => ReturnType<ForwardRefExoticComponent<{ value: string; }>>> = {
    name: NameEditor,
    title: TitleEditor,
    placeholder: PlaceholderEditor,
    titles: TitlesEditor,
    placeholders: PlaceholdersEditor,
    options: OptionsEditor,
    required: RequiredEditor
};

export const ALLOWED_EDITORS = {
    [ComponentTypes.address]: ['name', 'title', 'placeholder', 'required'],
    [ComponentTypes.datePicker]: ['name', 'title', 'placeholder', 'required'],
    [ComponentTypes.dropDown]: ['name', 'title', 'placeholder', 'options', 'required'],
    [ComponentTypes.header]: ['name', 'title', 'placeholder'],
    [ComponentTypes.longText]: ['name', 'title', 'placeholder', 'required'],
    [ComponentTypes.shortText]: ['name', 'title', 'placeholder', 'required'],
    [ComponentTypes.fullName]: ['name', 'titles', 'placeholders', 'required'],
    [ComponentTypes.multipleChoice]: ['name', 'title', 'options', 'required'],
    [ComponentTypes.phone]: ['name', 'title', 'placeholder', 'required'],
    [ComponentTypes.number]: ['name', 'title', 'placeholder', 'required'],
    [ComponentTypes.singleChoice]: ['name', 'title', 'options', 'required'],
    [ComponentTypes.upload]: ['name', 'title', 'placeholder', 'required'],
    [ComponentTypes.email]: ['name', 'title', 'placeholder', 'required']
}