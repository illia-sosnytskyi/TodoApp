import { Todo } from "../types/Todo";
import { TodoModel } from "../models/TodoModel";

export function normalize({ id, title, completed }: Todo) {
  return { id, title, completed };
}

export function getAll() {
  const result = TodoModel.findAll({
    order: ["created_at"],
  });

  return result;
}

export function getById(todoId: number) {
  return TodoModel.findByPk(todoId);
}

export async function createTodo(title: string) {
  const todos = await getAll();

  const maxId = todos.length
    ? Math.max(...todos.map((todo) => todo.id)) + 1
    : 1;

  return TodoModel.create({ id: maxId, title });
}

export function removeTodo(todoId: number) {
  todos = todos.filter((todo) => todo.id !== todoId);
}

export function updateTodo({ id, title, completed }: Todo) {
  const todo = getById(id);

  Object.assign(todo!, { title, completed });

  return todo;
}

export function removeMany(ids: number[]) {
  if (!ids.every(getById)) {
    throw new Error();
  }

  todos = todos.filter((todo) => !ids.includes(todo.id));
}

export function updateMany(todos: Todo[]) {
  for (const { id, title, completed } of todos) {
    const foundTodo = getById(id);

    if (!foundTodo) {
      continue;
    }

    updateTodo({ id, title, completed });
  }
}
