import React, { useState } from 'react';
import { db } from '../firebase';
import { addDoc, collection, serverTimestamp, Timestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

function AddTodo() {
  const [text, setText] = useState('');
  const [dueDate, setDueDate] = useState('');
  const navigate = useNavigate();

  const handleAdd = async () => {
    if (!text.trim()) return;

    const dueDateTimestamp = dueDate ? Timestamp.fromDate(new Date(dueDate)) : null;

    await addDoc(collection(db, 'todo'), {
      text,
      completed: false,
      time: serverTimestamp(),
      dueDate: dueDateTimestamp,
    });

    navigate('/');
  };

  return (
    <div className="max-w-lg mx-auto mt-16 bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-8">
        タスクを追加
      </h2>
      <div className="space-y-6">
        <input
          type="text"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="タスクを入力してください"
          className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-400 focus:border-blue-600 text-lg transition"
        />

        <label className="block text-gray-700 font-medium">
          期限（任意）
          <input
            type="date"
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
            className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-400 focus:border-blue-600 text-base transition"
          />
        </label>

        <button
          onClick={handleAdd}
          disabled={!text.trim()}
          className={`w-full py-3 rounded-lg text-white font-semibold text-lg
            transition-colors duration-300
            ${text.trim() ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-300 cursor-not-allowed'}`}
        >
          追加
        </button>
      </div>
    </div>
  );
}

export default AddTodo;
