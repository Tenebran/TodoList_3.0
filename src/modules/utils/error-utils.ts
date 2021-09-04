import { Dispatch } from 'redux';
import { ResponseType } from '../../api/todolists-api';
import { appSetErrorAC, appSetStatusAC } from '../state/app-reducer';
import { addTaskAC } from '../state/task-reducer';

export const handleServerNetworkError = (dispatch: Dispatch<ErrorActiomType>, message: string) => {
  dispatch(appSetErrorAC(message));
  dispatch(appSetStatusAC('failed'));
};

type ErrorActiomType = ReturnType<typeof appSetErrorAC> | ReturnType<typeof appSetStatusAC>;

export const handleServerAppError = (dispatch: Dispatch, data: any) => {
  if (data.resultCode === 0) {
    dispatch(addTaskAC(data.data.item));
  } else {
    if (data.messages.length) {
      dispatch(appSetErrorAC(data.messages[0]));
    } else {
      dispatch(appSetErrorAC('Some Error'));
    }
  }
};
