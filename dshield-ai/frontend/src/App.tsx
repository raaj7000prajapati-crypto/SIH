import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Upload from './pages/Upload';
import Review from './pages/Review';
import Dashboard from './pages/Dashboard';
import { ShieldCheck } from 'lucide-react';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <header className="bg-slate-900 text-white p-4 shadow-md">
          <div className="container mx-auto flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2 text-xl font-bold">
              <ShieldCheck className="w-8 h-8 text-blue-400" />
              <span>DShield AI</span>
            </Link>
            <nav className="space-x-6">
              <Link to="/upload" className="hover:text-blue-400 transition-colors">Upload</Link>
              <Link to="/dashboard" className="hover:text-blue-400 transition-colors">Dashboard</Link>
            </nav>
          </div>
        </header>
        
        <main className="flex-1 container mx-auto p-6">
          <Routes>
            <Route path="/" element={<Upload />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/review/:id" element={<Review />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
