import express from 'express';
import cors from 'cors';

import * as todoService from './services/todos'

const app = express();

app.use(cors());

app.get('/todos', (req, res) => {
  const todos = todoService.getAll();

  res.send(todos);
});

app.get('/todos/:todoId', (req, res) => {
  const { todoId } = req.params; 
  const foundTodo = todoService.getById(Number(todoId));

  if (!foundTodo) {
    res.sendStatus(404);
    return;
  }

  res.send(foundTodo);
});

app.post('/todos', express.json(), (req, res) => {
  const { title } = req.body;

  if (!title) {
    res.sendStatus(422);
    return;
  }

  const newTodo = todoService.createTodo(title);

  res.sendStatus(201);
  res.send(newTodo);
})

app.delete('/todos/:todoId', (req, res) => {
  const { todoId } = req.params;
  const foundTodo = todoService.getById(Number(todoId));

  if (!foundTodo) {
    res.sendStatus(404);
    return;
  }

  todoService.removeTodo(Number(todoId));

  res.sendStatus(204);
});

app.put('/todos/:todoId', express.json(), (req, res) => {
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
});

app.patch('/todos', express.json(), (req, res) => {
  const { action } = req.query;

  if (action === 'delete') {
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
    return;
  }

  if (action === 'update') {
    const { items } = req.body;

    if (!Array.isArray(items)) {
      res.sendStatus(422);
      return;
    }

    const results = [];
    const errors = [];

    for (const { id, title, completed } of items) {
      const foundTodo = todoService.getById(id);
  
      if (foundTodo) {
        todoService.updateTodo({ id, title, completed })
        results.push({ id, status: 'ok' })
      } else {
        errors.push({ id, status: 'NOT FOUND'})
      }
  
      todoService.updateTodo({id, title, completed});
    }

    res.send({ results, errors });
    return;
  }

  res.sendStatus(400);
});

app.listen(5000);
