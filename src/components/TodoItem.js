import React from 'react';

function TodoItem({ todo, onToggle, onDelete }) {
  return (
    <li className="flex justify-between items-center bg-gray-50 px-4 py-2 rounded border">
      <span
        onClick={onToggle}
        className={`cursor-pointer flex-grow ${todo.completed ? 'line-through text-gray-400' : ''}`}
      >
        {todo.text}
      </span>
      <button
        onClick={onDelete}
        className="ml-4 text-sm text-red-500 hover:text-red-700"
      >
        削除
      </button>
    </li>
  );
}

export default TodoItem;
