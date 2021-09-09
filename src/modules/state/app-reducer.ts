import { Dispatch } from 'redux';
import { authAPI } from '../../api/todolists-api';
import { handleServerAppError, handleServerNetworkError } from '../utils/error-utils';
import { setIsLoggedInAC } from './auth-reducer';
import { addTaskAC } from './task-reducer';

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed';

const initialState = {
  status: 'idle' as RequestStatusType,
  error: null as null | string,
  initialize: false as boolean,
};

type InitialStateType = typeof initialState;

export const appReducer = (
  state: InitialStateType = initialState,
  action: ActionsType
): InitialStateType => {
  switch (action.type) {
    case 'APP/SET-STATUS':
      return { ...state, status: action.status };

    case 'APP/SET-ERROR': {
      return { ...state, error: action.error };
    }
    case 'APP/SET-INITIALITED': {
      return { ...state, initialize: action.value };
    }
    default:
      return state;
  }
};

export const appSetStatusAC = (status: RequestStatusType) => {
  return { type: 'APP/SET-STATUS', status } as const;
};

export const appSetErrorAC = (error: null | string) => {
  return { type: 'APP/SET-ERROR', error } as const;
};

export const appSetinitializedAC = (value: boolean) => {
  return { type: 'APP/SET-INITIALITED', value } as const;
};

export const initializeAppTC = () => (dispatch: Dispatch) => {
  authAPI
    .me()
    .then(res => {
      debugger;
      if (res.data.resultCode === 0) {
        dispatch(setIsLoggedInAC(true));
      }
    })
    .finally(() => {
      dispatch(appSetinitializedAC(true));
    });
};

export const logoutTC = () => (dispatch: Dispatch<ActionsType>) => {
  dispatch(appSetStatusAC('loading'));
  authAPI
    .logout()
    .then(res => {
      if (res.data.resultCode === 0) {
        dispatch(setIsLoggedInAC(false));
        dispatch(appSetStatusAC('succeeded'));
      } else {
      }
    })
    .catch(error => {
      handleServerNetworkError(dispatch, error);
    });
};

type ActionsType =
  | ReturnType<typeof appSetStatusAC>
  | ReturnType<typeof appSetErrorAC>
  | ReturnType<typeof appSetinitializedAC>
  | ReturnType<typeof setIsLoggedInAC>
  | ReturnType<typeof appSetErrorAC>
  | ReturnType<typeof appSetStatusAC>;
