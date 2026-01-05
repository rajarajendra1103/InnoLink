import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import Home from './pages/Home';
import PostPage from './pages/PostPage';
import SearchIdeas from './pages/SearchIdeas';
import SearchProblems from './pages/SearchProblems';
import ProblemPoll from './pages/ProblemPoll';
import Messages from './pages/Messages';
import Notifications from './pages/Notifications';
import RegisterIdea from './pages/RegisterIdea';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900">
          <Header />
          <main className="flex-1 pb-10">
            <Routes>
              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* Default Feed */}
              <Route path="/" element={<Home />} />

              {/* Core Features */}
              <Route path="/post" element={<PostPage />} />
              <Route path="/ideas" element={<SearchIdeas />} />
              <Route path="/problems" element={<SearchProblems />} />
              <Route path="/poll/:id" element={<ProblemPoll />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/register-idea" element={<RegisterIdea />} />
              <Route path="/profile" element={<Profile />} />

              {/* Admin */}
              <Route path="/admin" element={<AdminDashboard />} />

              {/* Redirect legacy */}
              <Route path="/feed" element={<Navigate to="/" />} />
            </Routes>
          </main>
          <footer className="py-6 text-center bg-white border-t border-slate-200 text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} InnoLink. All rights reserved.
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
