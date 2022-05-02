import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { STAGE_TYPE } from '../../types/enums';
import { Flow, Interviewer } from '../../types/models';
import type { AppState } from '../store';

export interface FlowBuilderState {
    ui: {
        leftPanelStatus: STAGE_TYPE | false;
        rightPanelStatus: {
            stageType: STAGE_TYPE | false;
            _id: string;
            stageID: string;
        };
    },
    currentFlow: Flow
}

const initialState: FlowBuilderState = {
    ui: {
        leftPanelStatus: false,
        rightPanelStatus: {
            stageType: false,
            _id: '',
            stageID: ''
        }
    },
    currentFlow: {
        _id: '', name: '', stages: [], active: false, conditions: []
    }
};

export const addStageAsync = createAsyncThunk(
    'flow/addStage',
    async (stageData: { type: STAGE_TYPE; stageID?: string; }, { getState }) => {
        const { flowBuilder: { currentFlow: { _id: flowID, startDate, endDate } = {} } } = getState() as AppState;
        const { data: { stage } } = await axios.post(`/api/flows/${flowID}/stage`, {
            ...stageData,
            ...(startDate && endDate && { startDate, endDate })
        });
        return stage;
    }
);
export const deleteStageAsync = createAsyncThunk(
    'flow/deleteStage',
    async (stageID: string, { getState }) => {
        const { flowBuilder: { currentFlow: { _id: flowID } = {} } } = getState() as AppState;
        const { data } = await axios.delete(`/api/flows/${flowID}/stages/${stageID}/deleteStage`);
        return data;
    }
);

export const updateStageAsync = createAsyncThunk(
    'flow/updateStage',
    async (stageData: { type: STAGE_TYPE; stageID: string; startDate?: string | null, endDate?: string | null }, { getState }) => {
        const { flowBuilder: { currentFlow: { _id: flowID } = {} } } = getState() as AppState;
        const { flowBuilder: { ui: { rightPanelStatus: { _id: stage_id } = {} } } } = getState() as AppState;
        const { data: { stage } } = await axios.put(`/api/flows/${flowID}/stages/${stage_id}/updateStage`, {
            ...stageData
        });
        return stage;
    }
);

export const updateFlowTitleAsync = createAsyncThunk(
    'flow/updateTitle',
    async (titleData: { name: string; value: string }, { getState }) => {
        const { flowBuilder: { currentFlow: { _id: flowID } = {} } } = getState() as AppState;
        const { data: { flow } } = await axios.put(`/api/flows/${flowID}/updateTitle`, {
            ...titleData
        });
        return flow;
    }
);

export const updateInterviewAsync = createAsyncThunk(
    'flow/updateInterview',
    async (interviewData: { interviewLengthInMins: number, interviewers: Interviewer[] }, { getState }) => {
        const { flowBuilder: { ui: { rightPanelStatus: { stageID: interviewID } = {} } } } = getState() as AppState;
        const { data: interview } = await axios.put(`/api/interviews/${interviewID}`, {
            ...interviewData
        });
        return interview;
    }
);

export const updateFlowAsync = createAsyncThunk(
    'flow/updateFlow',
    async (flowData: { name: string; active: boolean; startDate?: string, endDate?: string }, { getState }) => {
        const { flowBuilder: { currentFlow: { _id: flowID } = {} } } = getState() as AppState;
        const { data: { flow } } = await axios.put(`/api/flows/${flowID}/updateFlow`, {
            ...flowData
        });
        return flow;
    }
);

export const updateActiveStatusAsync = createAsyncThunk(
    'flow/updateActiveStatus',
    async (statusData: { name: string; value: boolean }, { getState }) => {
        const { flowBuilder: { currentFlow: { _id: flowID } = {} } } = getState() as AppState;
        const { data: { flow } } = await axios.put(`/api/flows/${flowID}/updateFlowStatus`, {
            ...statusData
        });
        return flow;
    }
);

export const flowBuilderSlice = createSlice({
    name: 'flowBuilder',
    initialState,
    reducers: {
        toggleLeftPanel: (state, action: { payload: STAGE_TYPE | false; }) => {
            state.ui.leftPanelStatus = action.payload;
        },
        toggleRightPanel: (state, action: { payload: { stageType: STAGE_TYPE | false, _id: string, stageID: string } }) => {
            state.ui.rightPanelStatus = action.payload;
        },
        setCurrentFlow: (state, action) => {
            state.currentFlow = action.payload;
        },
        setConditionsOfFlow: (state, action) => {
            state.currentFlow.conditions = action.payload;
        }
    },
    extraReducers: builder => {
        builder
            .addCase(addStageAsync.fulfilled, (state, action) => {
                state.currentFlow.stages.push(action.payload);
                state.ui.leftPanelStatus = false;
            })
            .addCase(updateStageAsync.fulfilled, (state, action) => {
                const updatedFlowStages = state.currentFlow.stages.map(x => {
                    if (x._id === action.payload._id) {
                        return action.payload;
                    }
                    else {
                        return x;
                    }
                });
                state.currentFlow.stages = updatedFlowStages;
                //state.ui.rightPanelStatus.stageType = false;
            })
            .addCase(updateFlowTitleAsync.fulfilled, (state, action) => {
                state.currentFlow.name = action.payload.name;
            })
            .addCase(updateInterviewAsync.fulfilled, (state, action) => {
                const newStage = state.currentFlow.stages.find(s => s.stageID === action.payload._id);
                if (newStage) {
                    newStage.stageProps = action.payload;
                }
            })
            .addCase(updateFlowAsync.fulfilled, (state, action) => {
                state.currentFlow.name = action.payload.name;
                state.currentFlow.active = action.payload.active;
                state.currentFlow.startDate = action.payload.startDate;
                state.currentFlow.endDate = action.payload.endDate;
            })
            .addCase(deleteStageAsync.fulfilled, (state, action) => {
                const index = state.currentFlow.stages.findIndex(stage => stage._id === action.payload.sid);
                state.currentFlow.stages.splice(index, 1);
            })
            .addCase(updateActiveStatusAsync.fulfilled, (state, action) => {
                state.currentFlow.active = action.payload.active;
            });
    }
});

export const { toggleLeftPanel, toggleRightPanel, setCurrentFlow, setConditionsOfFlow } = flowBuilderSlice.actions;

export const getLeftPanelStatus = (state: AppState) => state.flowBuilder.ui.leftPanelStatus;
export const getRightPanelStatus = (state: AppState) => state.flowBuilder.ui.rightPanelStatus;
export const getCurrentFlow = (state: AppState) => state.flowBuilder.currentFlow;

export default flowBuilderSlice.reducer;
