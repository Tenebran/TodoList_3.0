import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://social-network.samuraijs.com/api/1.1',
  withCredentials: true,
  headers: {
    'API-KEY': 'e2aa960b-33d4-4875-9d72-648602b61592',
  },
});

type TodoType = {
  id: string;
  title: string;
  addedDate: string;
  order: number;
};

type CommonResponseType<T = {}> = {
  data: T;
  fieldsErrors: Array<string>;
  messages: Array<string>;
  resultCode: number;
};

export const todolistAPI = {
  getTodolist() {
    return instance.get<Array<TodoType>>('/todo-lists');
  },

  createTodolist(title: string) {
    return instance.post<CommonResponseType<{ item: TodoType }>>('/todo-lists', { title });
  },

  deleteTodolist(todolistId: string) {
    return instance.delete<CommonResponseType>(`/todo-lists/${todolistId}`);
  },
  updateTodolistTitle(todolistId: string, title: string) {
    return instance.put<CommonResponseType>(`/todo-lists/${todolistId}`, { title });
  },
};
