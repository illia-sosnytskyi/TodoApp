import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react';

import { ErrorMessages } from './components/ErrorMessages';
import { TodoContent } from './components/TodoContent/TodoContent';

import { Todo } from './types/Todo';
import { ErrorType } from './types/ErrorType';

import { TodosContext } from './context/todosContext';

import {
  getTodos,
  createTodo,
  removeTodo,
  updateTodo,
  updateAllTodos,
  deleteCompletedTodos,
} from './api/todos';

import { manageErrors } from './utils/manageErrors';

export const App: React.FC = () => {
  const newTodoField = useRef<HTMLInputElement>(null);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [proccessedTodoIds, setProccessedTodoIds] = useState<number[]>([]);
  const [todoTitle, setTodoTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const showError = useCallback((errorType: ErrorType) => {
    setErrorMessage(manageErrors(errorType));
    setTimeout(() => {
      setErrorMessage(ErrorType.None);
    }, 3000);
  }, []);

  const getTodosFromServer = useCallback(async () => {
    try {
      const todosFromServer = await getTodos();

      setTodos(todosFromServer);
    } catch (error) {
      showError(ErrorType.Endpoint);
    }
  }, []);

  const createNewTodo = useCallback(async (title: string) => {
    try {
      if (!title) {
        showError(ErrorType.Title);
      }

      if (title) {
        setIsLoading(true);

        await createTodo(title);
        await getTodosFromServer();
      }
    } catch (error) {
      showError(ErrorType.Add);
    } finally {
      setTodoTitle('');
      setIsLoading(false);
    }
  }, [todos]);

  const deleteTodo = useCallback(async (todoId: number) => {
    try {
      setProccessedTodoIds(currentIds => ([
        ...currentIds,
        todoId,
      ]));

      await removeTodo(todoId);
      await getTodosFromServer();
    } catch (error) {
      showError(ErrorType.Delete);
    } finally {
      setProccessedTodoIds(currentIds => currentIds.slice(todoId, 1));
    }
  }, [todos]);

  const changeTodo = useCallback(async ({id, title, completed}: Todo) => {
    try {
      setProccessedTodoIds(currentIds => ([
        ...currentIds,
        id,
      ]));

      await updateTodo({id, title, completed});
      await getTodosFromServer();

      if (title === '') {
        deleteTodo(id);
      }
    } catch (error) {
      showError(ErrorType.Update);
    } finally {
      setProccessedTodoIds(currentIds => currentIds.slice(id, 1));
    }
  }, [todos]);

  const toggleAllTodos = useCallback(async (completed: boolean) => {
    try {
      setIsLoading(true);

    await updateAllTodos(
      todos
        .filter(todo => todo.completed !== completed)
        .map(todo => ({ ...todo, completed }))
    );
    await getTodosFromServer();
    } catch (error) {
      showError(ErrorType.Update);
    } finally {
      setIsLoading(false);
    }
  }, [todos]);

  const deleteAllCompletedTodos = useCallback(async () => {
    try {
      setIsLoading(true);

    await deleteCompletedTodos(
      todos
        .filter(todo => todo.completed)
        .map(todo => todo.id)
    );
    await getTodosFromServer();
    } catch (error) {
      showError(ErrorType.Update);
    } finally {
      setIsLoading(false);
    }
  }, [todos])

  useEffect(() => {
    getTodosFromServer();
  }, []);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [todos]);

  const onChangeTitle = useCallback((title: string) => {
    setTodoTitle(title);
  }, [todoTitle]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <TodosContext.Provider value={todos}>
        <TodoContent
          newTodoField={newTodoField}
          onChangeTitle={onChangeTitle}
          todoTitle={todoTitle}
          createNewTodo={createNewTodo}
          isLoading={isLoading}
          deleteTodo={deleteTodo}
          proccessedTodoIds={proccessedTodoIds}
          deleteAllCompletedTodos={deleteAllCompletedTodos}
          changeTodo={changeTodo}
          toggleAllTodos={toggleAllTodos}
        />

        <ErrorMessages
          errorMessage={errorMessage}
          manageErrors={manageErrors}
        />
      </TodosContext.Provider>
    </div>
  );
};
