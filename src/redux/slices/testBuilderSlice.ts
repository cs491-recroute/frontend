import { QUESTION_TYPES } from './../../types/enums';
import { Test, Question } from '../../types/models';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import type { AppState } from '../store';

export interface TestBuilderState {
	ui: {
		leftPanelStatus: boolean;
        rightPanelStatus: {
            status: boolean;
            question?: Question;
        }
	},
	currentTest: Test
}

const initialState: TestBuilderState = {
    ui: {
        leftPanelStatus: false,
        rightPanelStatus: {
            status: false
        }
    },
    currentTest: {
        _id: '', name: '', questions: []
    }
};

export const addQuestionAsync = createAsyncThunk(
    'test/addQuestion',
    async (questionData: Partial<Question>, { getState }) => {
        const { testBuilder: { currentTest: { _id: testID } = {} } } = getState() as AppState;
        const { data: test } = await axios.post(`/api/tests/${testID}/question`, questionData);
        return test;
    }
);
export const updateQuestionAsync = createAsyncThunk(
    'test/updateQuestion',
    async ({ newProps, questionID }: { newProps: Partial<Question>; questionID?: string; }, { getState }) => {
        const { testBuilder: { currentTest: { _id: testID } = {} } } = getState() as AppState;
        const { data: question } = await axios.put(`/api/tests/${testID}/question`, newProps, { params: { questionID } });
        console.log(question)
        return question;
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
        },
        toggleRightPanel: (state, action: { payload: { status: boolean; question?: Question }; }) => {
            state.ui.rightPanelStatus = action.payload;
        }
    },
    extraReducers: builder => {
        builder
            .addCase(addQuestionAsync.fulfilled, (state, action) => {
                state.currentTest = action.payload;
            })
            .addCase(updateTestTitleAsync.fulfilled, (state, action) => {
                state.currentTest.name = action.payload.name;
            })
            .addCase(updateQuestionAsync.fulfilled, (state, action) => {
                console.log(action.payload);
                const { questions } = state.currentTest;
                const { _id: questionID } = action.payload;
                const index = questions.findIndex(question => question._id === questionID);
                state.currentTest.questions[index] = action.payload;
            });
    }
});

export const { toggleLeftPanel, setCurrentTest, toggleRightPanel } = testBuilderSlice.actions;

export const isLeftPanelOpen = (state: AppState) => state.testBuilder.ui.leftPanelStatus;
export const getCurrentTest = (state: AppState) => state.testBuilder.currentTest;
export const getRightPanelStatus = (state: AppState) => state.testBuilder.ui.rightPanelStatus;

export default testBuilderSlice.reducer;
