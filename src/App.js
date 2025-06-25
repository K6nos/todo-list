import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import AddTodo from './pages/AddTodo';
import Completed from './pages/Completed';
import Navbar from './components/Navbar'; // Navbarのパスに合わせて調整してください
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <p className="p-10">読み込み中...</p>;

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={user ? <Home /> : <Navigate to="/login" />}
        />
        <Route path="/login" element={<Login />} />
        <Route
          path="/add"
          element={user ? <AddTodo /> : <Navigate to="/login" />}
        />
        <Route
          path="/completed"
          element={user ? <Completed /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
