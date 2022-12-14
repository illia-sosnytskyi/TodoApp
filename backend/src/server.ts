import express from 'express';
import cors from 'cors';

import serverless from 'serverless-http';
import * as todoController from './controllers/todos';

const app = express();
const router = express.Router();

app.use(cors());

router.get('/', (req, res) => {
  res.json({
    "hello": "hello"
  });
});

router.get('/todos/', todoController.getAll);

router.get('/todos/:todoId', todoController.getOne);

router.post('/todos/', express.json(), todoController.postTodo);

router.delete('/todos/:todoId', todoController.removeTodo);

router.put('/todos/:todoId', express.json(), todoController.updateTodo);

const hasAcion = (action: string) => {
  return (req, res, next) => {
    if (req.query.action === action) {
      next();
    } else {
      next('route');
    }
  };
};

router.patch('/todos/', hasAcion('delete'), express.json(), todoController.removeMany);
router.patch('/todos/', hasAcion('update'), express.json(), todoController.updateMany);

app.use('/.netlify/functions/server', router);

// app.listen(5000);

export const handler = serverless(app);
