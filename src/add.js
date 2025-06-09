import { useState, useEffect } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db, auth } from './firebase';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';

function AddUser() {
  const [name, setName] = useState('');
  const [mail, setMail] = useState('');
  const [dorm, setDorm] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  const navigate = useNavigate();

  // ログイン状態を監視
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, 'mydata'), {
        name,
        mail,
        dorm,
      });
      alert('ユーザーを追加しました');
      navigate('/');
    } catch (error) {
      alert('追加に失敗しました: ' + error.message);
    }
  };

  // ログインしていないときの表示
  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600 text-xl">ログインするとデータが見られます。</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">ユーザー追加</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold mb-1">名前</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">メールアドレス</label>
            <input
              type="email"
              value={mail}
              onChange={(e) => setMail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">区分</label>
            <select
              value={dorm ? 'true' : 'false'}
              onChange={(e) => setDorm(e.target.value === 'true')}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="true">寮生</option>
              <option value="false">通学</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition"
          >
            追加
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddUser;
