import { useEffect, useState, useCallback } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from './firebase';

function DeleteUser() {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  // ログインユーザーの取得
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // ユーザー一覧取得処理
  const fetchUsers = useCallback(async () => {
    try {
      const usersCol = collection(db, 'mydata');
      const userSnapshot = await getDocs(usersCol);
      const userList = userSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(userList);
    } catch (error) {
      console.error('ユーザー取得エラー:', error);
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchUsers();
    }
  }, [currentUser, fetchUsers]);

  // ユーザー削除関数
  const deleteUser = async (id) => {
    const confirmDelete = window.confirm('このユーザーを本当に削除しますか？');
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, 'mydata', id));
      alert('ユーザーを削除しました');
      fetchUsers(); // 再取得
    } catch (error) {
      alert('削除に失敗しました: ' + error.message);
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600 text-xl">ログインするとデータが見られます。</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">ユーザー削除ページ</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead className="bg-gray-200">
            <tr>
              <th className="text-left p-4">名前</th>
              <th className="text-left p-4">メール</th>
              <th className="text-left p-4">区分</th>
              <th className="text-left p-4">操作</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-b hover:bg-gray-50">
                <td className="p-4">{user.name}</td>
                <td className="p-4">{user.mail}</td>
                <td className="p-4">{user.dorm ? '寮生' : '通学'}</td>
                <td className="p-4">
                  <button
                    onClick={() => deleteUser(user.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    削除
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-500">ユーザーが見つかりません</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DeleteUser;
