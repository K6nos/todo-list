import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { FaCheckCircle, FaTrash } from 'react-icons/fa';

function Home() {
  const [todos, setTodos] = useState([]);

  // Firestoreから未完了のデータ取得 + 自動削除処理
  const fetchTodos = async () => {
    const todoCol = collection(db, 'todo');
    const snapshot = await getDocs(todoCol);
    const now = new Date();

    const list = await Promise.all(snapshot.docs.map(async docSnap => {
      const data = docSnap.data();
      const todo = {
        id: docSnap.id,
        ...data,
      };

      // 完了済みかつ24時間以上経過 → 削除
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

    // 未完了だけ表示
    const filtered = list.filter(todo => todo && !todo.completed);
    setTodos(filtered);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // 完了に変更 + 完了時刻を記録
  const toggleComplete = async (todo) => {
    const todoRef = doc(db, 'todo', todo.id);
    await updateDoc(todoRef, {
      completed: true,
      completedAt: new Date(),
    });
    fetchTodos();
  };

  // 手動削除
  const handleDelete = async (todo) => {
    await deleteDoc(doc(db, 'todo', todo.id));
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
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => toggleComplete(todo)}
                  className="focus:outline-none"
                  title="完了"
                >
                  <FaCheckCircle
                    className="w-6 h-6 text-gray-400 hover:text-green-500 transition-transform transform hover:scale-110"
                  />
                </button>
                <button
                  onClick={() => handleDelete(todo)}
                  className="focus:outline-none"
                  title="削除"
                >
                  <FaTrash className="w-6 h-6 text-red-500 hover:text-red-700" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Home;
