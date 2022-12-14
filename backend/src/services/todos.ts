import { DataTypes } from 'sequelize';

import { sequelize } from '../utils/db';
import { Todo } from '../types/Todo';

const Todo = sequelize.define('Todo', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  completed: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    field: 'created_at',
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'todos',
  updatedAt: false,
});

export async function getAll() {
  const result = await Todo.findAll({
    order: [
      'created_at'
    ]
  });

  return result;
}

export function getById(todoId: number) {
  const foundTodo = todos.find(todo => todo.id === todoId);

  return foundTodo || null;
}

export function createTodo(title: string) {
  const maxId = todos.length
    ? Math.max(...todos.map(todo => todo.id)) + 1
    : 1;

  const newTodo = {
    id: maxId,
    title,
    completed: false,
  };

  todos.push(newTodo);

  return newTodo;
}

export function removeTodo(todoId: number) {
  todos = todos.filter(todo => todo.id !== todoId);
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

  todos = todos.filter(todo => !ids.includes(todo.id));
}

export function updateMany(todos: Todo[]) {
  for (const { id, title, completed } of todos) {
    const foundTodo = getById(id);

    if (!foundTodo) {
      continue;
    }

    updateTodo({id, title, completed});
  }
}
