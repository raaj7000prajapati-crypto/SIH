import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';
import { Eye, Clock, ShieldCheck, ShieldAlert, AlertTriangle } from 'lucide-react';

export default function Dashboard() {
  const [submissions, setSubmissions] = useState<any[]>([]);

  useEffect(() => {
    const fetchSubs = async () => {
      try {
        const res = await client.get('/decision/');
        setSubmissions(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSubs();
  }, []);

  const getStatusBadge = (decision: string) => {
    if (decision === 'APPROVED' || decision === 'VERIFIED') {
      return <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800"><ShieldCheck className="w-3 h-3" /> <span>{decision}</span></span>;
    }
    if (decision === 'REJECTED') {
      return <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"><ShieldAlert className="w-3 h-3" /> <span>{decision}</span></span>;
    }
    if (decision === 'REVIEW' || decision === 'PENDING') {
      return <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800"><Clock className="w-3 h-3" /> <span>{decision}</span></span>;
    }
    return <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800"><span>{decision}</span></span>;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50">
        <h2 className="text-xl font-bold text-slate-800">Audit Log & Dashboard</h2>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-500">
          <thead className="text-xs text-slate-700 uppercase bg-slate-100">
            <tr>
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Risk Score</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Reviewer</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((sub) => (
              <tr key={sub.id} className="bg-white border-b hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900">#{sub.id}</td>
                <td className="px-6 py-4">{new Date(sub.created_at).toLocaleString()}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <span className={`font-bold ${sub.risk_score >= 60 ? 'text-red-600' : sub.risk_score >= 20 ? 'text-amber-500' : 'text-emerald-600'}`}>
                      {sub.risk_score !== null ? sub.risk_score : '-'}
                    </span>
                    {sub.reason_codes && sub.reason_codes.length > 0 && <AlertTriangle className="w-4 h-4 text-red-400" />}
                  </div>
                </td>
                <td className="px-6 py-4">{getStatusBadge(sub.decision)}</td>
                <td className="px-6 py-4">{sub.reviewed_by || '-'}</td>
                <td className="px-6 py-4 text-right">
                  <Link to={`/review/${sub.id}`} className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-800 font-medium bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded transition-colors">
                    <Eye className="w-4 h-4" />
                    <span>View</span>
                  </Link>
                </td>
              </tr>
            ))}
            {submissions.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                  No submissions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
