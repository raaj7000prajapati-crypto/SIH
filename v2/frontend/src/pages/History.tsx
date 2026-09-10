import { useEffect, useState } from 'react';
import { Search, Filter, Download } from 'lucide-react';
import { api } from '../services/api';
import { motion } from 'framer-motion';

const History = () => {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await api.getHistory();
        setHistory(data);
      } catch (error) {
        console.error("Failed to fetch history", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-100 tracking-tight mb-1">Screening History</h1>
          <p className="text-neutral-500 text-sm">View and manage past document screenings</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#0A0A0A] hover:bg-neutral-900 text-neutral-300 rounded-md border border-neutral-800 transition-colors text-sm font-medium">
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-[#0A0A0A] rounded-xl border border-neutral-900 overflow-hidden"
      >
        {/* Filters and Search */}
        <div className="p-4 border-b border-neutral-900 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mr-2 flex items-center gap-1.5"><Filter className="w-3.5 h-3.5" /> Filters</span>
            {['All', 'Low Risk', 'Review', 'High Risk', 'Passport', 'Visa'].map(f => (
              <button key={f} className="px-3 py-1.5 rounded-md bg-neutral-900/50 hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 text-xs font-medium whitespace-nowrap transition-colors border border-neutral-800">
                {f}
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input 
              type="text" 
              placeholder="Search ID or Document..." 
              className="w-full bg-neutral-900/50 border border-neutral-800 rounded-md py-2 pl-9 pr-3 text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-neutral-700 transition-colors"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-900 text-neutral-500 text-xs uppercase tracking-wider bg-neutral-900/20">
                <th className="px-5 py-3 font-medium">ID</th>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Document Type</th>
                <th className="px-5 py-3 font-medium">Document No.</th>
                <th className="px-5 py-3 font-medium">Risk Score</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Officer</th>
                <th className="px-5 py-3 font-medium text-center">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm text-neutral-300">
              {loading ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-neutral-500 text-sm font-medium">Loading history...</td>
                </tr>
              ) : history.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-neutral-500 text-sm font-medium">No screening history found.</td>
                </tr>
              ) : (
                history.map((item, index) => (
                  <motion.tr 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    key={index} 
                    className="border-b border-neutral-900/50 hover:bg-neutral-900/30 transition-colors"
                  >
                    <td className="px-5 py-4 font-medium text-neutral-200">{item.id}</td>
                    <td className="px-5 py-4 text-neutral-500 text-xs">{item.date}</td>
                    <td className="px-5 py-4 text-neutral-400">{item.document_type}</td>
                    <td className="px-5 py-4 font-mono text-xs text-neutral-500">{item.document_number}</td>
                    <td className="px-5 py-4 font-semibold text-neutral-200">{item.risk_score}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-semibold border uppercase tracking-wider
                        ${item.status === 'LOW RISK' ? 'bg-green-950 text-green-500 border-green-900' : 
                          item.status === 'HIGH RISK' ? 'bg-red-950 text-red-500 border-red-900' : 
                          'bg-yellow-950 text-yellow-500 border-yellow-900'}
                      `}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-neutral-500 text-xs">{item.officer}</td>
                    <td className="px-5 py-4 text-center">
                      <button className="text-xs font-semibold text-neutral-400 hover:text-neutral-200 transition-colors bg-neutral-900/50 hover:bg-neutral-800 border border-neutral-800 px-3 py-1.5 rounded">View</button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default History;
