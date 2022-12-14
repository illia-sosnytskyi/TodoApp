import express from 'express';
import * as todoController from '../controllers/todos';

export const router = express.Router();

router.get('/', todoController.getAll);

router.get('/:todoId', todoController.getOne);

router.post('/', todoController.postTodo);

router.delete('/:todoId', todoController.removeTodo);

router.put('/:todoId', todoController.updateTodo);

const hasAcion = (action) => {
  return (req, res, next) => {
    if (req.query.action === action) {
      next();
    } else {
      next('route');
    }
  };
};

router.patch('/', hasAcion('delete'), todoController.removeMany);
router.patch('/', hasAcion('update'), todoController.updateMany);
