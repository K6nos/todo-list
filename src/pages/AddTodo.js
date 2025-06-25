import React, { useState } from 'react';
import { db } from '../firebase';
import { addDoc, collection, serverTimestamp, Timestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

function AddTodo() {
  const [text, setText] = useState('');
  const [dueDate, setDueDate] = useState(''); // 期限用のstateを追加
  const navigate = useNavigate();

  const handleAdd = async () => {
    if (!text.trim()) return;

    // 期限の入力があればFirebaseのTimestampに変換
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
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">タスクを追加</h2>
      <div className="flex flex-col gap-4">
        <input
          type="text"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="タスクを入力"
          className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <label className="flex flex-col text-gray-700">
          期限（任意）
          <input
            type="date"
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 mt-1"
          />
        </label>
        <button
          onClick={handleAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition-colors duration-200"
        >
          追加
        </button>
      </div>
    </div>
  );
}

export default AddTodo;
