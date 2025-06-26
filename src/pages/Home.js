import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { FaCheckCircle, FaTrash, FaEdit, FaSave, FaTimes } from 'react-icons/fa';

function Home() {
  const [todos, setTodos] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState('');

  const fetchTodos = async () => {
    const todoCol = collection(db, 'todo');
    const snapshot = await getDocs(todoCol);
    const now = new Date();

    const list = await Promise.all(snapshot.docs.map(async docSnap => {
      const data = docSnap.data();
      const todo = { id: docSnap.id, ...data };

      if (data.completed && data.completedAt?.toDate) {
        const completedAt = data.completedAt.toDate();
        const timeDiff = now - completedAt;
        const oneDay = 24 * 60 * 60 * 1000;
        if (timeDiff > oneDay) {
          await deleteDoc(doc(db, 'todo', docSnap.id));
          return null;
        }
      }

      return todo;
    }));

    setTodos(list.filter(todo => todo && !todo.completed));
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const toggleComplete = async (todo) => {
    const todoRef = doc(db, 'todo', todo.id);
    await updateDoc(todoRef, {
      completed: true,
      completedAt: new Date(),
    });
    fetchTodos();
  };

  const handleDelete = async (todo) => {
    await deleteDoc(doc(db, 'todo', todo.id));
    fetchTodos();
  };

  const startEdit = (todo) => {
    setEditId(todo.id);
    setEditText(todo.text);
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditText('');
  };

  const saveEdit = async (todo) => {
    const todoRef = doc(db, 'todo', todo.id);
    await updateDoc(todoRef, {
      text: editText,
    });
    setEditId(null);
    setEditText('');
    fetchTodos();
  };

  return (
    <div className="relative p-6 min-h-screen bg-gray-50">
      <h2 className="text-xl font-bold mb-4">タスク一覧</h2>

      {todos.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">タスクはありません</p>
      ) : (
        <ul>
          {todos.map(todo => (
            <li
              key={todo.id}
              className="mb-4 p-4 bg-white rounded-lg border shadow transition-transform transform hover:-translate-y-1 hover:shadow-lg flex justify-between items-center"
            >
              <div className="flex-1">
                {editId === todo.id ? (
                  <>
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="text-lg w-full border px-2 py-1 rounded"
                    />
                  </>
                ) : (
                  <>
                    <div className="text-lg">{todo.text}</div>
                  </>
                )}
                <div className="text-sm text-gray-500">
                  登録日時:{' '}
                  {todo.time?.toDate?.() ? todo.time.toDate().toLocaleString() : '日時なし'}
                </div>
                <div className="text-sm text-gray-500">
                  期限:{' '}
                  {todo.dueDate?.toDate?.() ? todo.dueDate.toDate().toLocaleDateString() : 'なし'}
                </div>
              </div>

              <div className="flex items-center space-x-3 ml-4">
                {editId === todo.id ? (
                  <>
                    <button onClick={() => saveEdit(todo)} title="保存">
                      <FaSave className="w-6 h-6 text-blue-500 hover:text-blue-700" />
                    </button>
                    <button onClick={cancelEdit} title="キャンセル">
                      <FaTimes className="w-6 h-6 text-gray-400 hover:text-gray-600" />
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => startEdit(todo)} title="編集">
                      <FaEdit className="w-6 h-6 text-gray-500 hover:text-blue-500" />
                    </button>
                    <button onClick={() => toggleComplete(todo)} title="完了">
                      <FaCheckCircle className="w-6 h-6 text-gray-400 hover:text-green-500" />
                    </button>
                    <button onClick={() => handleDelete(todo)} title="削除">
                      <FaTrash className="w-6 h-6 text-red-500 hover:text-red-700" />
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Home;
