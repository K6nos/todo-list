import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import AddUser from './add';
import DeleteUser from './delete';
import FindUser from './find';

import { useEffect, useState } from 'react';
import { db, auth, provider } from './firebase';
import { collection, getDocs } from 'firebase/firestore';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';

function App() {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCol = collection(db, 'mydata');
      const userSnapshot = await getDocs(usersCol);
      const userList = userSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(userList);
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("ログインエラー :", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("ログアウトエラー :", error);
    }
  };

  return (
    <Router>
      <Navigation />
      
      {/* ログインバー */}
      <div className="p-4 flex justify-end bg-gray-100">
        {user ? (
          <div>
            <span className="mr-4">こんにちは、{user.displayName} さん</span>
            <button onClick={handleLogout} className="p-2 bg-red-500 text-white rounded">ログアウト</button>
          </div>
        ) : (
          <button onClick={handleLogin} className="p-2 bg-blue-500 text-white rounded">Googleでログイン</button>
        )}
      </div>

      <Routes>
        <Route path="/" element={
          <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Users from Firestore</h1>
            <table className="w-full border border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 border">名前</th>
                  <th className="p-2 border">メール</th>
                  <th className="p-2 border">区分</th>
                </tr>
              </thead>
              <tbody>
                {user ? (
                  users.map(u => (
                    <tr key={u.id} className="border-t">
                      <td className="p-2 border">{u.name}</td>
                      <td className="p-2 border">{u.mail}</td>
                      <td className="p-2 border">{u.dorm ? '寮生' : '通学'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="p-4 text-center text-gray-600">ログインするとデータが見られます。</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        } />
        
        <Route path="/add" element={<AddUser />} />
        <Route path="/delete" element={<DeleteUser />} />
        <Route path="/find" element={<FindUser />} />
      </Routes>
    </Router>
  );
}

export default App;
