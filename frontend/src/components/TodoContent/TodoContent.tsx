import React, {
  useMemo,
  useState,
  useContext,
} from 'react';

import { TodosContext } from '../../context/todosContext';

import { TodoHeader } from '../TodoHeader';
import { TodoBody } from '../TodoBody';
import { TodoFooter } from '../TodoFooter';

import { FilterStatus } from '../../types/FilterStatus';
import { Todo } from '../../types/Todo';

type Props = {
  newTodoField: React.RefObject<HTMLInputElement>;
  onChangeTitle: (title: string) => void;
  todoTitle: string;
  createNewTodo: (title: string) => void;
  isLoading: boolean;
  deleteTodo: (todoId: number) => void;
  proccessedTodoIds: number[];
  deleteAllCompletedTodos: () => void;
  changeTodo: (todo: Todo) => void;
  toggleAllTodos: (completed: boolean) => void;
};

export const TodoContent: React.FC<Props> = React.memo(
  ({
    newTodoField,
    onChangeTitle,
    todoTitle,
    createNewTodo,
    isLoading,
    deleteTodo,
    proccessedTodoIds,
    deleteAllCompletedTodos,
    changeTodo,
    toggleAllTodos,
  }) => {
    const [filterStatus, setFilterStatus] = useState(FilterStatus.All);
    const todos = useContext(TodosContext);

    const countOfTodos = todos.length;

    const isEveryTodoComplited = useMemo(
      () => todos.every((todo) => todo.completed),
      [todos],
    );

    const filterTodos = (filterBy: FilterStatus) => {
      setFilterStatus(filterBy);

      return todos.filter((todo) => {
        switch (filterBy) {
          case FilterStatus.Active:
            return !todo.completed;

          case FilterStatus.Completed:
            return todo.completed;

          default:
            return todo;
        }
      });
    };

    const filteredTodos = useMemo(
      () => filterTodos(filterStatus),
      [filterStatus, todos],
    );

    return (
      <div className="todoapp__content">
        <TodoHeader
          countOfTodos={countOfTodos}
          newTodoField={newTodoField}
          onChangeTitle={onChangeTitle}
          todoTitle={todoTitle}
          createNewTodo={createNewTodo}
          isAdding={isLoading}
          toggleAllTodos={toggleAllTodos}
          isEveryTodoComplited={isEveryTodoComplited}
        />

        {countOfTodos > 0 && (
          <>
            <TodoBody
              filteredTodos={filteredTodos}
              isLoading={isLoading}
              todoTitle={todoTitle}
              deleteTodo={deleteTodo}
              proccessedTodoIds={proccessedTodoIds}
              changeTodo={changeTodo}
            />

            <TodoFooter
              filterTodos={filterTodos}
              filterStatus={filterStatus}
              deleteAllCompletedTodos={deleteAllCompletedTodos}
            />
          </>
        )}
      </div>
    );
  },
);
