import { configureStore, ThunkAction, Action, combineReducers, AnyAction } from '@reduxjs/toolkit';
import flowBuilderSlice from './slices/flowBuilderSlice';
import { createWrapper, HYDRATE } from 'next-redux-wrapper';

import flowsSlice from './slices/flowsSlice';
import formBuilderSlice from './slices/formBuilderSlice';
import testBuilderSlice from './slices/testBuilderSlice';
import globalSlice from './slices/globalSlice';
import userSlice from './slices/userSlice';

const combinedReducer = combineReducers({
    formBuilder: formBuilderSlice,
    flowBuilder: flowBuilderSlice,
    flows: flowsSlice,
    testBuilder: testBuilderSlice,
    global: globalSlice,
    user: userSlice
});

const reducer = (state: ReturnType<typeof combinedReducer> | undefined, action: AnyAction) => {
    if (action.type === HYDRATE) {
        return {
            ...state,
            ...action.payload
        };
    } else {
        return combinedReducer(state, action);
    }
};

export function makeStore() {
    return configureStore({ reducer });
}

type Store = ReturnType<typeof makeStore>;

export type AppState = ReturnType<Store['getState']>

export type AppDispatch = Store['dispatch']

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action<string>
>

export const wrapper = createWrapper(makeStore, { debug: process.env.NODE_ENV === 'development'});
