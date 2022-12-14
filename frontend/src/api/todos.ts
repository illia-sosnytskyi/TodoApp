import axios from 'axios';

import { Todo } from '../types/Todo';

axios.defaults.baseURL = 'http://localhost:5000';

export function getTodos(): Promise<Todo[]> {
  return axios.get('/todos')
    .then(res => res.data);
}

export function getOne(todoId: string): Promise<Todo> {
  return axios.get(`/todos/${todoId}`)
    .then(res => res.data);
}

export function createTodo(title: string): Promise<Todo> {
  return axios.post('/todos', { title })
    .then(res => res.data);
}

export function removeTodo(todoId: number): Promise<string> {
  return axios.delete(`/todos/${todoId}`)
    .then(res => res.data);
}

export function updateTodo({ id, title, completed  }: Todo): Promise<Todo> {
  return axios.put(`/todos/${id}`, { title, completed })
    .then(res => res.data);
}

export function updateAllTodos(todos: Todo[]): Promise<Todo[]> {
  return axios.patch('/todos?action=update', {
    items: todos,
  })
    .then(res => res.data);
}

export function deleteCompletedTodos(ids: number[]): Promise<Todo[]> {
  return axios.patch('/todos?action=delete', { ids })
    .then(res => res.data);
}
