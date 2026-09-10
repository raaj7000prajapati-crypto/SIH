import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import DocumentScreening from './pages/DocumentScreening';
import Analysis from './pages/Analysis';
import Result from './pages/Result';
import History from './pages/History';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/screening" element={<DocumentScreening />} />
          <Route path="/analysis" element={<Analysis />} />
          <Route path="/result/:id" element={<Result />} />
          <Route path="/history" element={<History />} />
          <Route path="/admin" element={<div className="p-8 text-white">Admin overview — coming soon.</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
