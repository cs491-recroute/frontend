import { configureStore, ThunkAction, Action, combineReducers, AnyAction } from '@reduxjs/toolkit';
import flowBuilderSlice from './slices/flowBuilderSlice';
import { createWrapper, HYDRATE } from 'next-redux-wrapper';

import flowsSlice from './slices/flowsSlice';
import formBuilderSlice from './slices/formBuilderSlice';

const combinedReducer = combineReducers({
	formBuilder: formBuilderSlice,
	flowBuilder: flowBuilderSlice,
	flows: flowsSlice
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

export const wrapper = createWrapper(makeStore, { debug: true });
