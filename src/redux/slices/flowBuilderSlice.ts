import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { STAGE_TYPE } from '../../types/enums';
import { Flow } from '../../types/models';
import type { AppState } from '../store';

export interface FlowBuilderState {
	ui: {
		leftPanelStatus: STAGE_TYPE | false;
		rightPanelStatus: {
            stageType: STAGE_TYPE | false;
            stageId: string;
        };
	},
	currentFlow: Flow
}

const initialState: FlowBuilderState = {
    ui: {
        leftPanelStatus: false,
        rightPanelStatus: {
            stageType: false,
            stageId: ''
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

export const updateStageAsync = createAsyncThunk(
    'flow/updateStage',
    async (stageData: { type: STAGE_TYPE; stageID: string; startDate?: string, endDate?: string}, { getState }) => {
        const {flowBuilder: {currentFlow: {_id: flowID} = {} } } = getState() as AppState;
        const {flowBuilder: {ui: {rightPanelStatus: {stageId: stage_id} = {}} } } = getState() as AppState;
        const {data: { stage } } = await axios.put(`/api/flows/${flowID}/stages/${stage_id}/updateStage`, { 
            ...stageData
        });
        return stage;
    }
);

export const updateFlowTitleAsync = createAsyncThunk(
    'flow/updateTitle',
    async (titleData: { name: string; value: string}, { getState }) => {
        const {flowBuilder: {currentFlow: {_id: flowID} = {} } } = getState() as AppState;
        const {data: { flow } } = await axios.put(`/api/flows/${flowID}/updateTitle`, { 
            ...titleData
        });
        return flow;
    }
);

export const updateFlowAsync = createAsyncThunk(
    'flow/updateFlow',
    async (flowData: {name: string; active: boolean; startDate?: string, endDate?: string}, { getState }) => {
        const {flowBuilder: {currentFlow: {_id: flowID} = {} } } = getState() as AppState;
        const {data: { flow } } = await axios.put(`/api/flows/${flowID}/updateFlow`, {
            ...flowData
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
        toggleRightPanel: (state, action: {payload: {stageType: STAGE_TYPE | false, stageId: string}}) => {
            state.ui.rightPanelStatus = action.payload;
        },
        setCurrentFlow: (state, action) => {
            state.currentFlow = action.payload;
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
                    if(x._id === action.payload._id){
                        return action.payload;
                    }
                    else{
                        return x;
                    }
                });
                state.currentFlow.stages = updatedFlowStages ;
                state.ui.rightPanelStatus.stageType = false;
            })
            .addCase(updateFlowTitleAsync.fulfilled, (state, action) => {
                state.currentFlow.name = action.payload.name;
            })
            .addCase(updateFlowAsync.fulfilled, (state, action) => {
                state.currentFlow.name = action.payload.name;
                state.currentFlow.active = action.payload.active;
                state.currentFlow.startDate = action.payload.startDate;
                state.currentFlow.endDate = action.payload.endDate;
            });
    }
});

export const { toggleLeftPanel, toggleRightPanel, setCurrentFlow } = flowBuilderSlice.actions;

export const getLeftPanelStatus = (state: AppState) => state.flowBuilder.ui.leftPanelStatus;
export const getRightPanelStatus = (state: AppState) => state.flowBuilder.ui.rightPanelStatus;
export const getCurrentFlow = (state: AppState) => state.flowBuilder.currentFlow;

export default flowBuilderSlice.reducer;
