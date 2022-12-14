import * as todoService from '../services/todos';
import { Status } from '../types/Status';

export const getAll = async (req, res) => {
  const todos = await todoService.getAll();

  res.send(
    todos.map(todoService.normalize)
  );
};

export const getOne = async (req, res) => {
  const { todoId } = req.params; 
  const foundTodo = await todoService.getById(Number(todoId));

  if (!foundTodo) {
    res.sendStatus(404);
    return;
  }

  res.send(
    todoService.normalize(foundTodo)
  );
};

export const postTodo = (req, res) => {
  const { title } = req.body;

  if (!title) {
    res.sendStatus(422);
    return;
  }

  const newTodo = todoService.createTodo(title);

  res.sendStatus(201);
  res.send(newTodo);
};

export const removeTodo = (req, res) => {
  const { todoId } = req.params;
  const foundTodo = todoService.getById(Number(todoId));

  if (!foundTodo) {
    res.sendStatus(404);
    return;
  }

  todoService.removeTodo(Number(todoId));

  res.sendStatus(204);
};

export const updateTodo = (req, res) => {
  const { todoId } = req.params; 
  const foundTodo = todoService.getById(Number(todoId));

  if (!foundTodo) {
    res.sendStatus(404);
    return;
  }

  const { title, completed } = req.body;

  if (typeof title !== 'string' || typeof completed !== 'boolean') {
    res.sendStatus(422);
    return;
  }

  todoService.updateTodo({ id: Number(todoId), title, completed });

  res.send(foundTodo);
};

export const removeMany = (req, res, next) => {
  const { ids } = req.body;

  if (!Array.isArray(ids)) {
    res.sendStatus(422);
    return;
  }

  try {
    todoService.removeMany(ids);
  } catch (error) {
    res.sendStatus(404);
    return;
  } 

  res.sendStatus(204);
}

export const updateMany = (req, res, next) => {
  const { items } = req.body;

  if (!Array.isArray(items)) {
    res.sendStatus(422);
    return;
  }

  const results: Status[] = [];
  const errors: Status[] = [];

  for (const { id, title, completed } of items) {
    const foundTodo = todoService.getById(id);

    if (foundTodo) {
      todoService.updateTodo({ id, title, completed })
      results.push({ id, status: 'ok' })
    } else {
      errors.push({ id, status: 'NOT FOUND'})
    }
  }

  res.send({ results, errors });
};
