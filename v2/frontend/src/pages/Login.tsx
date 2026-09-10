import { type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, User } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#0A0A0A]">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-md w-full bg-[#0A0A0A] border border-neutral-900 p-10 rounded-2xl"
      >
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-neutral-900 rounded-xl flex items-center justify-center border border-neutral-800 mb-6">
            <Shield className="w-8 h-8 text-neutral-100" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-100 mb-2">IDENTRA</h1>
          <p className="text-neutral-500 text-sm text-center">AI-Powered Identity & Document Screening</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-semibold tracking-wider text-neutral-500 uppercase">Officer ID / Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-4 w-4 text-neutral-500" />
              </div>
              <input
                type="text"
                defaultValue="demo-officer"
                className="w-full bg-[#0A0A0A] border border-neutral-800 rounded-md py-2.5 pl-10 pr-4 text-neutral-200 text-sm focus:outline-none focus:border-neutral-600 transition-colors"
                placeholder="Enter ID"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-[10px] font-semibold tracking-wider text-neutral-500 uppercase">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-neutral-500" />
              </div>
              <input
                type="password"
                defaultValue="password123"
                className="w-full bg-[#0A0A0A] border border-neutral-800 rounded-md py-2.5 pl-10 pr-4 text-neutral-200 text-sm focus:outline-none focus:border-neutral-600 transition-colors"
                placeholder="Enter password"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-white hover:bg-neutral-200 text-black text-sm font-medium py-2.5 rounded-md transition-colors mt-6"
          >
            Secure Login
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-[10px] text-neutral-600 uppercase tracking-widest">
            Authorized personnel only.<br/>All access is monitored.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
