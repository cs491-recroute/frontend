import { ComponentTypes } from './../../../types/models';
import { PartialRecord } from './../../../types/customs';
import { Component } from './../../../types/models';
import TitleEditor from './TitleEditor';
import PlaceholderEditor from './PlaceholderEditor';
import TitlesEditor from './TitlesEditor';
import PlaceholdersEditor from './PlaceholdersEditor';
import OptionsEditor from './OptionsEditor';

import { ForwardRefExoticComponent, RefObject } from 'react';

export const PROP_EDITORS: PartialRecord<keyof Component, (props: { defaultValue: any; ref: RefObject<{ value: any; }>; }) => ReturnType<ForwardRefExoticComponent<{ value: string; }>>> = {
    title: TitleEditor,
    placeholder: PlaceholderEditor,
    titles: TitlesEditor,
    placeholders: PlaceholdersEditor,
    options: OptionsEditor
};

export const ALLOWED_EDITORS = {
    [ComponentTypes.address]: ['title', 'placeholder'],
    [ComponentTypes.datePicker]: ['title', 'placeholder'],
    [ComponentTypes.dropDown]: ['title', 'placeholder', 'options'],
    [ComponentTypes.header]: ['title', 'placeholder'],
    [ComponentTypes.longText]: ['title', 'placeholder'],
    [ComponentTypes.shortText]: ['title', 'placeholder'],
    [ComponentTypes.fullName]: ['titles', 'placeholders'],
    [ComponentTypes.multipleChoice]: ['title', 'options'],
    [ComponentTypes.phone]: ['title', 'placeholder'],
    [ComponentTypes.singleChoice]: ['title', 'options'],
    [ComponentTypes.upload]: ['title', 'placeholder'],
    [ComponentTypes.email]: ['title', 'placeholder']
}