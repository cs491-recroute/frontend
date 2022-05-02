import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { AppState } from '../store';

import { Form, Component } from '../../types/models';
import axios from 'axios';

export interface FormBuilderState {
    ui: {
        leftPanelOpen: boolean;
        rightPanelStatus: {
            status: boolean;
            component?: Component;
        }
    },
    currentForm: Form,
    isActive: boolean
}

const initialState: FormBuilderState = {
    ui: {
        leftPanelOpen: false,
        rightPanelStatus: {
            status: false
        }
    },
    currentForm: { _id: '', name: '', components: [], flowID: '' },
    isActive: false
};

export const addComponentAsync = createAsyncThunk(
    'form/addComponent',
    async (defaultProps: Record<any, any>, { getState }) => {
        const { formBuilder: { currentForm: { _id: formID } = {} } } = getState() as AppState;
        const { data: form } = await axios.post(`/api/forms/${formID}/component`, defaultProps);
        return form as Form;
    }
);

export const deleteComponentAsync = createAsyncThunk(
    'form/deleteComponent',
    async (componentID: string, { getState }) => {
        const { formBuilder: { currentForm: { _id: formID } = {} } } = getState() as AppState;
        const { data } = await axios.delete(`/api/forms/${formID}/components/${componentID}/deleteComponent`);
        return data;
    }
);

export const updateComponentAsync = createAsyncThunk(
    'form/updateComponent',
    async ({ newProps, componentID }: { newProps: Partial<Component>; componentID?: string; }, { getState }) => {
        const { formBuilder: { currentForm: { _id: formID } = {} } } = getState() as AppState;
        const { data: component } = await axios.put(`/api/forms/${formID}/components/${componentID}/updateComponent`, newProps, { params: { componentID } });
        return component;
    }
);

export const updateFormTitleAsync = createAsyncThunk(
    'form/updateTitle',
    async (titleData: { name: string; value: string }, { getState }) => {
        const { formBuilder: { currentForm: { _id: formID } = {} } } = getState() as AppState;
        const { data: form } = await axios.put(`/api/forms/${formID}/updateTitle`, {
            ...titleData
        });
        return form;
    }
);

export const getParentFlowAsync = createAsyncThunk(
    'form/getParentFlow',
    async (flowID: string) => {
        const { data: flow } = await axios.get(`/api/flows/${flowID}`);
        return flow;
    }
);

export const formBuilderSlice = createSlice({
    name: 'formBuilder',
    initialState,
    reducers: {
        toggleLeftPanel: (state, action: { payload: boolean; }) => {
            state.ui.leftPanelOpen = action.payload;
        },
        toggleRightPanel: (state, action: { payload: { status: boolean; component?: Component }; }) => {
            state.ui.rightPanelStatus = action.payload;
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
            .addCase(deleteComponentAsync.fulfilled, (state, action) => {
                const index = state.currentForm.components.findIndex(component => component._id === action.payload.cid);
                state.currentForm.components.splice(index, 1);
            })
            .addCase(updateComponentAsync.fulfilled, (state, action) => {
                const { components } = state.currentForm;
                const { _id: componentID } = action.payload;
                const index = components.findIndex(component => component._id === componentID);
                state.currentForm.components[index] = action.payload;
            });
    }
});

export const { toggleLeftPanel, toggleRightPanel, setCurrentForm } = formBuilderSlice.actions;

export const isLeftPanelOpen = (state: AppState) => state.formBuilder.ui.leftPanelOpen;
export const isRightPanelOpen = (state: AppState) => state.formBuilder.ui.rightPanelStatus;
export const getCurrentForm = (state: AppState) => state.formBuilder.currentForm;
export const getIsActive = (state: AppState) => state.formBuilder.isActive;

export default formBuilderSlice.reducer;