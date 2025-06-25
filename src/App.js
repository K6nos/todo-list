// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AddTodo from './pages/AddTodo';
import Completed from './pages/Completed';
import Login from './pages/Login';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <p className="p-10">読み込み中...</p>;

  return (
    <Router>
      <div className="flex min-h-screen">
        <Navbar user={user} />
        <main className="flex-1 p-6 bg-gray-50 min-h-screen overflow-auto">
          <Routes>
            <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
            <Route path="/add" element={user ? <AddTodo /> : <Navigate to="/login" />} />
            <Route path="/completed" element={user ? <Completed /> : <Navigate to="/login" />} />
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
