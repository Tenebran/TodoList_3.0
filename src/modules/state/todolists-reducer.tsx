import { AxiosError } from 'axios';
import { Dispatch } from 'redux';
import { v1 } from 'uuid';
import { todolistsAPI, TodoListType } from '../../api/todolists-api';
import { appSetErrorAC, appSetStatusAC, RequestStatusType } from './app-reducer';
import { AppRootState } from './store/store';
import { handleServerNetworkError } from '../utils/error-utils';
export const REMOVE_TODOLIST = 'REMOVE-TODOLIST';
export const ADD_TODOLIST = 'ADD-TODOLIST';
const CHANGE_TODOLIST_TITLE = 'CHANGE-TODOLIST-TITLE';
const CHANGE_TODOLIST_FILTE = 'CHANGE-TODOLIST-FILTER';

export type ActionsTypes =
  | ReturnType<typeof RemoveTodolistAC>
  | ReturnType<typeof AddTodolistAc>
  | ReturnType<typeof changeTodolistTitleAC>
  | ReturnType<typeof changeTodolistFilterAC>
  | ReturnType<typeof setTodolistsAC>
  | ReturnType<typeof changeTodolistEntityStatusAC>;

export let todolist1 = v1();
export let todolist2 = v1();
const initialState: Array<TodolistDomainType> = [];

export type KeyType = 'all' | 'complited' | 'active';

export type TodolistDomainType = TodoListType & {
  filter: KeyType;
  entityStatus: RequestStatusType;
};

export const todolistReducer = (
  state: Array<TodolistDomainType> = initialState,
  action: ActionsTypes
): Array<TodolistDomainType> => {
  switch (action.type) {
    case 'SET-TODOLISTS': {
      return action.todolists.map(list => {
        return { ...list, filter: 'all', entityStatus: 'idle' };
      });
    }

    case REMOVE_TODOLIST:
      return state.filter(list => list.id !== action.id);

    case ADD_TODOLIST: {
      const newTodolist: TodolistDomainType = {
        ...action.todolist,
        filter: 'all',
        entityStatus: 'idle',
      };
      return [newTodolist, ...state];
    }

    case CHANGE_TODOLIST_TITLE: {
      const todolistFind = state.find(list => list.id === action.id);
      if (todolistFind) {
        todolistFind.title = action.title;
      }
      return [...state];
    }
    case CHANGE_TODOLIST_FILTE: {
      const todolist = state.find(list => list.id === action.id);
      if (todolist) {
        todolist.filter = action.filter;
      }
      return [...state];
    }

    case 'CHANGE-TODOLIST-ENTITY-STATUS': {
      return state.map(list =>
        list.id === action.id ? { ...list, entityStatus: action.status } : list
      );
    }
    default:
      return state;
  }
};

export const RemoveTodolistAC = (todolistId: string) => {
  return { type: REMOVE_TODOLIST, id: todolistId } as const;
};

export const AddTodolistAc = (todolist: TodoListType) => {
  return {
    type: ADD_TODOLIST,
    todolist,
  } as const;
};

export const changeTodolistTitleAC = (newTodolistTitle: string, todolistId: string) => {
  return {
    type: CHANGE_TODOLIST_TITLE,
    id: todolistId,
    title: newTodolistTitle,
  } as const;
};

export const changeTodolistFilterAC = (filter: KeyType, id: string) => {
  return {
    type: CHANGE_TODOLIST_FILTE,
    id: id,
    filter: filter,
  } as const;
};

export const setTodolistsAC = (todolists: Array<TodoListType>) => {
  return { type: 'SET-TODOLISTS', todolists } as const;
};

export const fetchTodolistsThunk = (dispatch: Dispatch, getState: () => AppRootState) => {
  dispatch(appSetStatusAC('loading'));
  todolistsAPI.getTodolists().then(res => {
    let action = setTodolistsAC(res.data);
    dispatch(action);
    dispatch(appSetStatusAC('succeeded'));
  });
};

export const changeTodolistEntityStatusAC = (status: RequestStatusType, id: string) => {
  return { type: 'CHANGE-TODOLIST-ENTITY-STATUS', status, id } as const;
};

export const removeTodolistTC = (todolistId: string) => (dispatch: Dispatch) => {
  dispatch(appSetStatusAC('loading'));
  dispatch(changeTodolistEntityStatusAC('loading', todolistId));
  todolistsAPI.deleteTodoList(todolistId).then(res => {
    if (res.data.resultCode === 0) {
      dispatch(RemoveTodolistAC(todolistId));
      dispatch(appSetStatusAC('succeeded'));
    }
  });
};

export const addTodolistTC = (title: string) => (dispatch: Dispatch) => {
  dispatch(appSetStatusAC('loading'));

  todolistsAPI
    .createTodolists(title)
    .then(resp => {
      if (resp.data.resultCode === 0) {
        dispatch(AddTodolistAc(resp.data.data.item));
        dispatch(appSetStatusAC('succeeded'));
      } else {
        dispatch(appSetErrorAC(resp.data.messages[0]));
        dispatch(appSetStatusAC('failed'));
      }
    })
    .catch((err: AxiosError) => {
      handleServerNetworkError(dispatch, err.message);
    });
};

export const changeTodolistTitleTC = (todolisID: string, title: string) => (dispatch: Dispatch) => {
  dispatch(appSetStatusAC('loading'));

  todolistsAPI.updateTodolist(todolisID, title).then(resp => {
    dispatch(changeTodolistTitleAC(title, todolisID));
    dispatch(appSetStatusAC('succeeded'));
  });
};
