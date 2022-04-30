import { QUESTION_TYPES } from './../../types/enums';
import { Test, Question, Category } from '../../types/models';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import type { AppState } from '../store';
import { translate } from '../../utils';
import { toast } from 'react-toastify';

export interface TestBuilderState {
    ui: {
        leftPanelStatus: boolean;
        rightPanelStatus: {
            status: boolean;
            question?: Question;
        }
    },
    currentTest: Test,
    isActive: boolean,
    questions: Question[],
    categories: Category[]
}

const initialState: TestBuilderState = {
    ui: {
        leftPanelStatus: false,
        rightPanelStatus: {
            status: false
        }
    },
    currentTest: {
        _id: '', name: '', questions: [], flowID: ''
    },
    isActive: false,
    questions: [],
    categories: []
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
        return question;
    }
);

export const deleteQuestionAsync = createAsyncThunk(
    'form/deleteQuestion',
    async (questionID: string, { getState }) => {
        const { testBuilder: { currentTest: { _id: testID } = {} } } = getState() as AppState;
        const { data } = await axios.delete(`/api/tests/${testID}/question`, { params: { questionID } });
        return data;
    }
);

export const updateTestTitleAsync = createAsyncThunk(
    'test/updateTitle',
    async (titleData: { name: string; value: string }, { getState }) => {
        const { testBuilder: { currentTest: { _id: testId } = {} } } = getState() as AppState;
        const { data: test } = await axios.put(`/api/tests/${testId}/updateTitle`, {
            ...titleData
        });
        return test;
    }
);

export const getParentFlowAsync = createAsyncThunk(
    'test/getParentFlow',
    async (any, { getState }) => {
        const { testBuilder: { currentTest: { flowID: fid } = {} } } = getState() as AppState;
        const { data: test } = await axios.get(`/api/flows/${fid}`);
        return test;
    }
);

export const getMyQuestionsAsync = createAsyncThunk(
    'test/getMyQuestions',
    async () => {
        const { data: questions } = await axios.get(`/api/questions/getMyQuestions`);
        return questions;
    }
);

export const getCategoriesAsync = createAsyncThunk(
    'test/getCategories',
    async () => {
        const { data: categories } = await axios.get(`/api/questions/getCategories`);
        return categories;
    }
);

export const getPoolQuestionsAsync = createAsyncThunk(
    'test/getPoolQuestions',
    async (cid: string) => {
        const { data: questions } = await axios.get(`/api/questions/getPoolQuestions/${cid}`);
        return questions;
    }
);

export const saveAsTemplateAsync = createAsyncThunk(
    'test/saveAsTemplate',
    async (allData: { questionData: Partial<Question>, accessModifier: string }) => {
        try {
            const { data: question } = await axios.post(`/api/questions/saveAsTemplate`, allData);
            toast(translate('Successful'), {
                type: 'success',
                position: 'bottom-right',
                hideProgressBar: true
            });
            return question;
        } catch (error: any) {
            toast(translate(error?.response?.data || 'Error occured!'), {
                type: 'error',
                position: 'bottom-right',
                hideProgressBar: true
            });
        }
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
                const { questions } = state.currentTest;
                const { _id: questionID } = action.payload;
                const index = questions.findIndex(question => question._id === questionID);
                state.currentTest.questions[index] = action.payload;
            })
            .addCase(getParentFlowAsync.fulfilled, (state, action) => {
                state.isActive = action.payload.active;
            })
            .addCase(deleteQuestionAsync.fulfilled, (state, action) => {
                const { questions } = state.currentTest;
                const index = questions.findIndex(question => question._id === action.payload);
                state.currentTest.questions.splice(index, 1);
            })
            .addCase(getMyQuestionsAsync.fulfilled, (state, action) => {
                state.questions = action.payload;
            })
            .addCase(getCategoriesAsync.fulfilled, (state, action) => {
                state.categories = action.payload;
            })
            .addCase(getPoolQuestionsAsync.fulfilled, (state, action) => {
                state.questions = action.payload;
            })
            .addCase(saveAsTemplateAsync.fulfilled, (state, action) => {
                state.questions.push(action.payload);
            });
    }
});

export const { toggleLeftPanel, setCurrentTest, toggleRightPanel } = testBuilderSlice.actions;

export const isLeftPanelOpen = (state: AppState) => state.testBuilder.ui.leftPanelStatus;
export const getCurrentTest = (state: AppState) => state.testBuilder.currentTest;
export const getRightPanelStatus = (state: AppState) => state.testBuilder.ui.rightPanelStatus;
export const getIsActive = (state: AppState) => state.testBuilder.isActive;
export const getQuestions = (state: AppState) => state.testBuilder.questions;
export const getCategories = (state: AppState) => state.testBuilder.categories;

export default testBuilderSlice.reducer;
