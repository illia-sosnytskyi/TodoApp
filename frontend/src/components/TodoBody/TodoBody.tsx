import React from 'react';
import { TodoItem } from '../TodoItem';
import { AddingTodoItem } from '../AddingTodoItem';
import { Todo } from '../../types/Todo';

type Props = {
  filteredTodos: Todo[],
  isLoading: boolean,
  todoTitle: string,
  deleteTodo: (todoId: number) => void;
  proccessedTodoIds: number[],
  changeTodo: (todo: Todo) => void;
};

export const TodoBody: React.FC<Props> = React.memo(({
  filteredTodos,
  isLoading,
  todoTitle,
  deleteTodo,
  proccessedTodoIds,
  changeTodo,
}) => (
  <section className="todoapp__main" data-cy="TodoList">

    {filteredTodos.map(todo => (
      <TodoItem
        key={todo.id}
        todo={todo}
        deleteTodo={deleteTodo}
        proccessedTodoIds={proccessedTodoIds}
        changeTodo={changeTodo}
      />
    ))}

    {isLoading && (
      <AddingTodoItem
        title={todoTitle}
      />
    )}
  </section>
));
