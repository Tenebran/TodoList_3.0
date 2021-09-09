import React, { useCallback, useEffect } from 'react';
import './App.scss';
import AppBar from '@material-ui/core/AppBar';
import { Toolbar, Button, Typography, CircularProgress } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import IconButton from '@material-ui/core/IconButton';
import {
  changeTodolistFilterAC,
  KeyType,
  TodolistDomainType,
  fetchTodolistsThunk,
  removeTodolistTC,
  addTodolistTC,
  changeTodolistTitleTC,
} from './modules/state/todolists-reducer';
import { useDispatch, useSelector } from 'react-redux';
import { AppRootState } from './modules/state/store/store';
import { TaskType } from './api/todolists-api';
import LinearProgress from '@material-ui/core/LinearProgress';
import { logoutTC, RequestStatusType } from './modules/state/app-reducer';
import { ErrorSnackbar } from './modules/components/ErrorSnackbar/ErrorSnackbar';
import { Todolists } from './modules/components/Todolists/Todolists';
import { Login } from './modules/components/Login/Login';
import { Redirect, Route, Switch } from 'react-router-dom';
import { initializeAppTC } from './modules/state/app-reducer';

export type TasksStateType = {
  [key: string]: Array<TaskType>;
};

const App = React.memo(() => {
  useEffect(() => {
    dispatch(initializeAppTC());
    dispatch(fetchTodolistsThunk);
  }, []);

  const dispatch = useDispatch();
  const todolist = useSelector<AppRootState, Array<TodolistDomainType>>(state => state.todolist);
  const initialize = useSelector<AppRootState, boolean>(state => state.app.initialize);
  const status = useSelector<AppRootState, RequestStatusType>(state => state.app.status);
  const isLoggedIn = useSelector<AppRootState, boolean>(state => state.login.isLoggedIn);

  const addItem = useCallback(
    (title: string) => {
      dispatch(addTodolistTC(title));
    },
    [dispatch]
  );

  const changeFilter = useCallback(
    (changeValue: KeyType, todolistId: string) => {
      const action = changeTodolistFilterAC(changeValue, todolistId);
      dispatch(action);
    },
    [dispatch]
  );

  const removeTodolist = useCallback(
    (todolistId: string) => {
      dispatch(removeTodolistTC(todolistId));
    },
    [dispatch]
  );

  const changeTodolistTitle = useCallback(
    (id: string, title: string) => {
      dispatch(changeTodolistTitleTC(id, title));
    },
    [dispatch]
  );

  console.log(todolist);

  if (!initialize) {
    return (
      <div style={{ position: 'fixed', top: '30%', textAlign: 'center', width: '100%' }}>
        <CircularProgress />
      </div>
    );
  }

  const loggooutHandler = () => {
    dispatch(logoutTC());
  };

  return (
    <div className="App">
      <AppBar position="fixed">
        <Toolbar className="header">
          <IconButton edge="start" color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6">News</Typography>
          {isLoggedIn && (
            <Button color="inherit" variant={'outlined'} onClick={loggooutHandler}>
              LOGOUT
            </Button>
          )}
        </Toolbar>
        {status === 'loading' && <LinearProgress color="secondary" />}
      </AppBar>
      <Switch>
        <Route path={'/login'} render={() => <Login />} />
        <Route
          exact
          path={'/'}
          render={() => (
            <Todolists
              changeFilter={changeFilter}
              removeTodolist={removeTodolist}
              changeTodolistTitle={changeTodolistTitle}
              addItem={addItem}
            />
          )}
        />
        <Route path={'/404'} render={() => <h1>404 PAGE NOT FOUND</h1>} />
        <Redirect from={'*'} to={'/404'} />
      </Switch>

      <ErrorSnackbar />
    </div>
  );
});

export default App;
