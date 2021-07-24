import { addTodolistAC, removeTodoListAC } from './todolists-reducers';
import { TasksStateType } from '../App';
import {
  removeTaskAC,
  tasksReducers,
  addTaskAC,
  changeTaskStatusAC,
  changeTaskTitleAC,
} from './tasks-reducers';

let startState: TasksStateType;

beforeEach(() => {
  startState = {
    todolistId1: [
      { id: '1', title: 'CSS', isDone: false },
      { id: '2', title: 'JS', isDone: true },
      { id: '3', title: 'React', isDone: false },
    ],
    todolistId2: [
      { id: '1', title: 'bread', isDone: false },
      { id: '2', title: 'milk', isDone: true },
      { id: '3', title: 'tea', isDone: false },
    ],
  };
});

test('correct task should be deleted from correct array', () => {
  const action = removeTaskAC('2', 'todolistId2');

  const endState = tasksReducers(startState, action);

  expect(endState).toEqual({
    todolistId1: [
      { id: '1', title: 'CSS', isDone: false },
      { id: '2', title: 'JS', isDone: true },
      { id: '3', title: 'React', isDone: false },
    ],
    todolistId2: [
      { id: '1', title: 'bread', isDone: false },
      { id: '3', title: 'tea', isDone: false },
    ],
  });
  expect(endState['todolistId2'].length).toBe(2);
  expect(endState['todolistId1'].length).toBe(3);
});

test('correct task should be added to correct array', () => {
  const action = addTaskAC('juce', 'todolistId2');

  const endState = tasksReducers(startState, action);

  expect(endState).toEqual({
    todolistId1: [
      { id: '1', title: 'CSS', isDone: false },
      { id: '2', title: 'JS', isDone: true },
      { id: '3', title: 'React', isDone: false },
    ],
    todolistId2: [
      { id: action.id, title: 'juce', isDone: false },
      { id: '1', title: 'bread', isDone: false },
      { id: '2', title: 'milk', isDone: true },
      { id: '3', title: 'tea', isDone: false },
    ],
  });

  expect(endState['todolistId1'].length).toBe(3);
  expect(endState['todolistId2'].length).toBe(4);
  expect(endState['todolistId2'][0].id).toBeDefined();
  expect(endState['todolistId2'][0].title).toBe('juce');
  expect(endState['todolistId2'][0].isDone).toBe(false);
});

test('status of specified task should be changed', () => {
  const action = changeTaskStatusAC('2', false, 'todolistId2');

  const endState = tasksReducers(startState, action);

  expect(endState).toEqual({
    todolistId1: [
      { id: '1', title: 'CSS', isDone: false },
      { id: '2', title: 'JS', isDone: true },
      { id: '3', title: 'React', isDone: false },
    ],
    todolistId2: [
      { id: '1', title: 'bread', isDone: false },
      { id: '2', title: 'milk', isDone: false },
      { id: '3', title: 'tea', isDone: false },
    ],
  });

  expect(endState['todolistId2'][1].isDone).toBe(false);
  expect(endState['todolistId1'][1].isDone).toBe(true);
});

test('status of specified task should be changed', () => {
  const action = changeTaskTitleAC('2', 'New title', 'todolistId2');

  const endState = tasksReducers(startState, action);

  expect(endState).toEqual({
    todolistId1: [
      { id: '1', title: 'CSS', isDone: false },
      { id: '2', title: 'JS', isDone: true },
      { id: '3', title: 'React', isDone: false },
    ],
    todolistId2: [
      { id: '1', title: 'bread', isDone: false },
      { id: '2', title: 'New title', isDone: true },
      { id: '3', title: 'tea', isDone: false },
    ],
  });

  expect(endState['todolistId2'][1].title).toBe('New title');
  expect(endState['todolistId1'][1].title).toBe('JS');
});

test('new property with array should be added when new todolis is added', () => {
  const startState: TasksStateType = {
    todolist1: [
      { id: '1', title: 'CSS', isDone: true },
      { id: '2', title: 'JS', isDone: true },
      { id: '3', title: 'React', isDone: false },
      { id: '4', title: 'Redux', isDone: false },
    ],

    todolist2: [
      { id: '1', title: 'Terminator', isDone: true },
      { id: '2', title: 'Marvel', isDone: true },
      { id: '3', title: 'Iron Man', isDone: false },
      { id: '4', title: 'Spider Man', isDone: false },
    ],
  };

  const action = addTodolistAC('new todolist');
  const endState = tasksReducers(startState, action);

  const keys = Object.keys(endState);
  const newKey = keys.find(k => k != 'todolist1' && k != 'todolist2');

  if (!newKey) {
    throw Error('new key should be added');
  }
  expect(keys.length).toBe(3);
  expect(endState[newKey]).toEqual([]);
});

test('property with todolistId should be deleted', () => {
  const startState: TasksStateType = {
    todolist1: [
      { id: '1', title: 'CSS', isDone: true },
      { id: '2', title: 'JS', isDone: true },
      { id: '3', title: 'React', isDone: false },
      { id: '4', title: 'Redux', isDone: false },
    ],

    todolist2: [
      { id: '1', title: 'Terminator', isDone: true },
      { id: '2', title: 'Marvel', isDone: true },
      { id: '3', title: 'Iron Man', isDone: false },
      { id: '4', title: 'Spider Man', isDone: false },
    ],
  };

  const action = removeTodoListAC('todolist2');
  const endState = tasksReducers(startState, action);

  const keys = Object.keys(endState);

  expect(keys.length).toBe(1);
  expect(endState['todolist2']).not.toBeDefined();
});
