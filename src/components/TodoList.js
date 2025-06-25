import React from 'react';
import TodoItem from './TodoItem';

function TodoList({ todos, onToggle, onDelete }) {
  if (todos.length === 0) {
    return <p className="text-center text-gray-500">タスクがありません</p>;
  }

  return (
    <ul className="space-y-2">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={() => onToggle(todo)}
          onDelete={() => onDelete(todo.id)}
        />
      ))}
    </ul>
  );
}

export default TodoList;
