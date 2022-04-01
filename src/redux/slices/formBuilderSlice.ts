import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { AppState } from '../store';

import { Form } from '../../types/models';
import axios from 'axios';

export interface FormBuilderState {
	ui: {
		leftPanelOpen: boolean;
		rightPanelOpen: boolean;
	},
    currentForm: Form,
    isActive: boolean
}

const initialState: FormBuilderState = {
    ui: {
        leftPanelOpen: false,
        rightPanelOpen: false
    },
    currentForm: { _id: '' ,name: '', components: [], flowID: '' },
    isActive: false
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

export const updateFormTitleAsync = createAsyncThunk(
    'form/updateTitle',
    async (titleData: { name: string; value: string}, { getState }) => {
        const {formBuilder: {currentForm: {_id: formID} = {} } } = getState() as AppState;
        const {data: form} = await axios.put(`/api/forms/${formID}/updateTitle`, { 
            ...titleData
        });
        return form;
    }
);

export const getParentFlowAsync = createAsyncThunk(
    'form/getParentFlow',
    async (any , { getState }) => {
        const {formBuilder: {currentForm: {flowID: fid} = {} } } = getState() as AppState;
        const {data: flow} = await axios.get(`/api/flows/${fid}`);
        return flow;
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
            })
            .addCase(updateFormTitleAsync.fulfilled, (state, action) => {
                state.currentForm.name = action.payload.name;
            })
            .addCase(getParentFlowAsync.fulfilled, (state, action) => {
                state.isActive = action.payload.active;
            })
    }
});

export const { toggleLeftPanel, toggleRightPanel, setCurrentForm } = formBuilderSlice.actions;

export const isLeftPanelOpen = (state: AppState) => state.formBuilder.ui.leftPanelOpen;
export const isRightPanelOpen = (state: AppState) => state.formBuilder.ui.rightPanelOpen;
export const getCurrentForm = (state: AppState) => state.formBuilder.currentForm;
export const getIsActive = (state: AppState) => state.formBuilder.isActive;

export default formBuilderSlice.reducer;