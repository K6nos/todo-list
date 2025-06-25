import React, { useState } from 'react';

function TodoInput({ onAdd }) {
  const [text, setText] = useState('');

  const handleSubmit = () => {
    onAdd(text);
    setText('');
  };

  return (
    <div className="flex mb-4">
      <input
        type="text"
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="新しいタスクを入力"
        className="flex-grow border border-gray-300 rounded-l px-4 py-2 focus:outline-none focus:ring focus:border-blue-300"
      />
      <button
        onClick={handleSubmit}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r"
      >
        追加
      </button>
    </div>
  );
}

export default TodoInput;
