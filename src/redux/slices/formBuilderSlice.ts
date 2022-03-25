import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { AppState } from '../store';

import { Form } from '../../types/models';
import axios from 'axios';

export interface FormBuilderState {
	ui: {
		leftPanelOpen: boolean;
		rightPanelOpen: boolean;
	},
    currentForm: Form
}

const initialState: FormBuilderState = {
    ui: {
        leftPanelOpen: false,
        rightPanelOpen: false
    },
    currentForm: { _id: '' ,name: '', components: [] }
};

export const addComponentAsync = createAsyncThunk(
    'form/addComponent',
    async (defaultProps: Record<any, any>, { getState }) => {
        const { formBuilder: { currentForm: { _id: formID } = {} } } = getState() as AppState;
        console.log('props:', defaultProps);
        const { data: form } = await axios.post(`/api/forms/${formID}/component`, defaultProps);
        return form as Form;
    }
);

export const formBuilderSlice = createSlice({
    name: 'formBuilder',
    initialState,
    reducers: {
        toggleLeftPanel: (state, action) => {
            state.ui.leftPanelOpen = action.payload;
        },
        toggleRightPanel: (state, action) => {
            state.ui.rightPanelOpen = action.payload;
        },
        setCurrentForm: (state, action: { payload: Form; }) => {
            state.currentForm = action.payload;
        }
    },
    extraReducers: builder => {
        builder
            .addCase(addComponentAsync.fulfilled, (state, action) => {
                state.currentForm = action.payload;
            });
    }
});

export const { toggleLeftPanel, toggleRightPanel, setCurrentForm } = formBuilderSlice.actions;

export const isLeftPanelOpen = (state: AppState) => state.formBuilder.ui.leftPanelOpen;
export const isRightPanelOpen = (state: AppState) => state.formBuilder.ui.rightPanelOpen;
export const getCurrentForm = (state: AppState) => state.formBuilder.currentForm;

export default formBuilderSlice.reducer;