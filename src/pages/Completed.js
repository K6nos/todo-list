import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { FaTrash } from 'react-icons/fa';

function Completed() {
  const [todos, setTodos] = useState([]);

  const fetchCompletedTodos = async () => {
    const todoCol = collection(db, 'todo');
    const snapshot = await getDocs(todoCol);
    const list = snapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));

    const completed = list.filter(todo => todo.completed);
    setTodos(completed);
  };

  useEffect(() => {
    fetchCompletedTodos();
  }, []);

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'todo', id));
    fetchCompletedTodos();
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">完了済みタスク</h2>
      <ul>
        {todos.map(todo => (
          <li
            key={todo.id}
            className="mb-4 p-4 bg-white rounded-lg border shadow transition-transform duration-200 ease-in-out transform hover:-translate-y-1 hover:shadow-lg flex justify-between items-center"
          >
            <div>
              <div className="text-lg">{todo.text}</div>
              <div className="text-sm text-gray-500">
                登録日時:{' '}
                {todo.time && typeof todo.time.toDate === 'function'
                  ? todo.time.toDate().toLocaleString()
                  : '日時なし'}
              </div>
              <div className="text-sm text-gray-500">
                期限:{' '}
                {todo.dueDate && typeof todo.dueDate.toDate === 'function'
                  ? todo.dueDate.toDate().toLocaleDateString()
                  : 'なし'}
              </div>
            </div>
            <button
              onClick={() => handleDelete(todo.id)}
              className="focus:outline-none"
              title="削除"
            >
              <FaTrash className="w-5 h-5 text-red-500 hover:text-red-700" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Completed;
