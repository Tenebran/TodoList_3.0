import React, { useEffect, useState } from 'react';
import { todolistAPI } from '../api/todolist-api';
export default {
  title: 'API',
};

export const GetTodolists = () => {
  const [state, setState] = useState<any>(null);
  useEffect(() => {
    todolistAPI.getTodolist().then(res => {
      setState(res.data);
    });
  }, []);

  return <div> {JSON.stringify(state)}</div>;
};
export const CreateTodolist = () => {
  const [state, setState] = useState<any>(null);
  const title = 'newTodolist';
  useEffect(() => {
    todolistAPI.createTodolist(title).then(res => {
      setState(res.data);
    });
  }, []);

  return <div> {JSON.stringify(state)}</div>;
};
export const DeleteTodolist = () => {
  const [state, setState] = useState<any>(null);
  const todolistId = '57f9c440-9c2b-47d8-9f2e-4b19243417ee';
  useEffect(() => {
    todolistAPI.deleteTodolist(todolistId).then(res => {
      setState(res.data);
    });
  }, []);

  return <div> {JSON.stringify(state)}</div>;
};
export const UpdateTodolistTitle = () => {
  const [state, setState] = useState<any>(null);
  const todolistId = 'b4ae52eb-e597-4633-baab-ab6ffaefb79f';
  let title = 'FrontEND>>>>>>>>>';
  useEffect(() => {
    todolistAPI.updateTodolistTitle(todolistId, title).then(res => {
      setState(res.data);
    });
  }, []);

  return <div> {JSON.stringify(state)}</div>;
};
