import { useEffect, useState, useCallback } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from './firebase';

function FindUser() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [keyword, setKeyword] = useState('');
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
      setFilteredUsers(userList);
    } catch (error) {
      console.error('ユーザー取得エラー:', error);
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchUsers();
    }
  }, [currentUser, fetchUsers]);

  // 検索キーワードの変更時に絞り込み
  const handleSearch = (e) => {
    const kw = e.target.value;
    setKeyword(kw);

    const filtered = users.filter(user =>
      (user.name || '').toLowerCase().includes(kw.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600 text-xl">ログインするとデータが見られます。</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">ユーザー検索ページ</h2>

      <input
        type="text"
        placeholder="名前で検索"
        value={keyword}
        onChange={handleSearch}
        className="w-full p-2 mb-4 border border-gray-300 rounded"
      />

      {filteredUsers.length === 0 ? (
        <p className="text-gray-600">該当するユーザーがいません。</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 p-2">名前</th>
              <th className="border border-gray-300 p-2">メール</th>
              <th className="border border-gray-300 p-2">区分</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(u => (
              <tr key={u.id} className="odd:bg-white even:bg-gray-50">
                <td className="border border-gray-300 p-2">{u.name}</td>
                <td className="border border-gray-300 p-2">{u.mail}</td>
                <td className="border border-gray-300 p-2">{u.dorm ? '寮生' : '通学'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default FindUser;
