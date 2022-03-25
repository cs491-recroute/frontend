import { Test } from '../../types/models';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { STAGE_TYPE } from '../../types/enums';
import type { AppState } from '../store';

export interface TestBuilderState {
	ui: {
		leftPanelStatus: boolean;
	},
	currentTest: Test
}

const initialState: TestBuilderState = {
    ui: {
        leftPanelStatus: false
    },
    currentTest: {
        _id: '', name: '', questions: []
    }
};

export const addQuestionAsync = createAsyncThunk(
    'test/addQuestion',
    async (questionData, { getState }) => {
        const { testBuilder: { currentTest: { _id: testID } = {} } } = getState() as AppState;
        // const { data: { stage } } = await axios.post(`/api/flows/${flowID}/stage`, {
        //     ...stageData,
        //     ...(startDate && endDate && { startDate, endDate })
        // });
        console.log(testID);
        return testID;
    }
);

export const updateTestTitleAsync = createAsyncThunk(
    'test/updateTitle',
    async (titleData: { name: string; value: string}, { getState }) => {
        const {testBuilder: {currentTest: {_id: testId} = {} } } = getState() as AppState;
        const {data: test} = await axios.put(`/api/tests/${testId}/updateTitle`, { 
            ...titleData
        });
        return test;
    }
);

export const testBuilderSlice = createSlice({
    name: 'testBuilder',
    initialState,
    reducers: {
        toggleLeftPanel: (state, action: { payload: boolean; }) => {
            state.ui.leftPanelStatus = action.payload;
        },
        setCurrentTest: (state, action: { payload: Test; }) => {
            state.currentTest = action.payload;
        }
    },
    extraReducers: builder => {
        builder
            .addCase(addQuestionAsync.fulfilled, (state, action) => {
                state.ui.leftPanelStatus = false;
            })
            .addCase(updateTestTitleAsync.fulfilled, (state, action) => {
                state.currentTest.name = action.payload.name;
            });
    }
});

export const { toggleLeftPanel, setCurrentTest } = testBuilderSlice.actions;

export const getLeftPanelStatus = (state: AppState) => state.testBuilder.ui.leftPanelStatus;
export const getCurrentTest = (state: AppState) => state.testBuilder.currentTest;

export default testBuilderSlice.reducer;
