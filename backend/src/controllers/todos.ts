import * as todoService from '../services/todos';

export const getAll = async (req, res) => {
  const todos = await todoService.getAll();

  res.send(todos);
};

export const getOne = async (req, res) => {
  const { todoId } = await req.params; 
  const foundTodo = todoService.getById(Number(todoId));

  if (!foundTodo) {
    res.sendStatus(404);
    return;
  }

  res.send(foundTodo);
};

export const postTodo = async (req, res) => {
  const { title } = req.body;

  if (!title) {
    res.sendStatus(422);
    return;
  }

  const newTodo = await todoService.createTodo(title);

  res.sendStatus(201);
  res.send(newTodo);
};

export const removeTodo = async (req, res) => {
  const { todoId } = req.params;
  const foundTodo = await todoService.getById(Number(todoId));

  if (!foundTodo) {
    res.sendStatus(404);
    return;
  }

  todoService.removeTodo(Number(todoId));

  res.sendStatus(204);
};

export const updateTodo = async (req, res) => {
  const { todoId } = req.params; 
  const { title, completed } = req.body;

  if (typeof title !== 'string' || typeof completed !== 'boolean') {
    res.sendStatus(422);
    return;
  }

  await todoService.updateTodo({ id: Number(todoId), title, completed });

  res.sendStatus(200);
};

export const removeMany = async (req, res, next) => {
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

  res.sendStatus(200);
}

export const updateMany = async (req, res, next) => {
  const { items } = req.body;

  if (!Array.isArray(items)) {
    res.sendStatus(422);
    return;
  }

  await todoService.updateMany(items);

  res.sendStatus(200);
};