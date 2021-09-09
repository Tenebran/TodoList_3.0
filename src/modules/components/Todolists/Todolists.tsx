import { Container, Grid, Paper } from '@material-ui/core';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { TaskType } from '../../../api/todolists-api';
import { AppRootState } from '../../state/store/store';
import { TodolistDomainType } from '../../state/todolists-reducer';
import AddItemForm from '../AddItemForm/AddItemForm';
import Todolist from '../Todolist/Todolist';
import { KeyType } from '../../state/todolists-reducer';
import { addTaskAC, updateTaskTC } from '../../state/task-reducer';
import { Redirect } from 'react-router-dom';

export type TasksStateType = {
  [key: string]: Array<TaskType>;
};

type PropsType = {
  changeFilter: (changeValue: KeyType, todolistId: string) => void;
  removeTodolist: (todolistId: string) => void;
  changeTodolistTitle: (id: string, title: string) => void;
  addItem: (title: string) => void;
};

export const Todolists = (props: PropsType) => {
  const todolist = useSelector<AppRootState, Array<TodolistDomainType>>(state => state.todolist);
  const isLoggedIn = useSelector<AppRootState, boolean>(state => state.login.isLoggedIn);
  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }
  }, []);

  if (!isLoggedIn) {
    return <Redirect to={'/login'} />;
  }

  return (
    <Container fixed className="todoList__form">
      <Grid container justifyContent="center">
        <AddItemForm addItem={props.addItem} />
      </Grid>

      <Grid container spacing={3} justifyContent="center">
        {todolist.map(list => (
          <Grid item key={list.id}>
            <Paper elevation={3} className="paper__style">
              <Todolist
                title={list.title}
                changeFilter={props.changeFilter}
                filterTask={list.filter}
                id={list.id}
                removeTodolist={props.removeTodolist}
                changeTodolistTitle={props.changeTodolistTitle}
                addTaskAC={addTaskAC}
                updateTaskTC={updateTaskTC}
                entityStatus={list.entityStatus}
              />
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};
