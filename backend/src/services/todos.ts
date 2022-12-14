import { QueryTypes } from 'sequelize';

import { sequelize } from '../utils/db';
import { Todo } from "../types/Todo";
import { TodoModel } from "../models/TodoModel";

export function normalize({ id, title, completed }: Todo) {
  return { id, title, completed };
}

export function getAll() {
  return TodoModel.findAll({
    order: ["created_at"],
  })
}

export async function getById(todoId: number) {
  return TodoModel.findByPk(todoId);
}

export async function createTodo(title: string) {
  const newTodo = {
    title,
    completed: false,
  };

  return TodoModel.create(newTodo);
}

export async function removeTodo(todoId: number) {
  return TodoModel.destroy({
    where: {
      id: todoId,
    },
  });
}

export function updateTodo({ id, title, completed }: Todo) {
  return TodoModel.update({ title, completed }, {
    where: { id },
  });
}

export function removeMany(ids: number[]) {

  return sequelize.query(
    `DELETE FROM todos WHERE id IN (:ids)`, {
      replacements: { ids },
      type: QueryTypes.BULKDELETE,
    }
  )
}

export async function updateMany(todos: Todo[]) {
  return sequelize.transaction(async (t) => {
    for (const { id, title, completed } of todos) {
      await TodoModel.update({ title, completed }, {
        where: { id },
        transaction: t,
      });
    }
  });
}
