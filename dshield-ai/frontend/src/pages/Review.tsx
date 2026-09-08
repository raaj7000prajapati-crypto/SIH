import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import client from '../api/client';
import { AlertTriangle, CheckCircle, ShieldAlert, User, Search } from 'lucide-react';

export default function Review() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchSub = async () => {
      try {
        const res = await client.get(`/decision/${id}`);
        setData(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSub();
  }, [id]);

  const handleDecision = async (decision: string) => {
    try {
      await client.post(`/decision/${id}/review?decision=${decision}&reviewer=Officer1`);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
    }
  };

  if (!data) return <div className="text-center p-10">Loading evidence...</div>;

  const isReject = data.risk_score >= 60;
  const isReview = data.risk_score >= 20 && data.risk_score < 60;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Verification Report #{data.id}</h1>
          <p className="text-slate-500 text-sm mt-1">Submitted on {new Date(data.created_at).toLocaleString()}</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Risk Score</div>
            <div className={`text-4xl font-black ${isReject ? 'text-red-600' : isReview ? 'text-amber-500' : 'text-emerald-500'}`}>
              {data.risk_score}/100
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Core Extractions */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center space-x-2">
            <User className="w-5 h-5 text-blue-500" />
            <span>Extracted Data</span>
          </h3>
          <div className="space-y-4">
            {data.extracted_fields && Object.entries(data.extracted_fields).map(([k, v]) => (
              <div key={k}>
                <div className="text-xs text-slate-500 uppercase font-semibold">{k}</div>
                <div className="text-slate-800 font-medium">{String(v)}</div>
              </div>
            ))}
            <div>
              <div className="text-xs text-slate-500 uppercase font-semibold">MRZ Checksum</div>
              <div className={`font-medium flex items-center space-x-1 ${data.mrz_valid ? 'text-emerald-600' : 'text-red-600'}`}>
                {data.mrz_valid ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                <span>{data.mrz_valid ? 'Valid' : 'Invalid'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Forensics */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center space-x-2">
            <Search className="w-5 h-5 text-blue-500" />
            <span>Forensics & Match</span>
          </h3>
          <div className="space-y-6">
            <div>
              <div className="text-sm font-semibold text-slate-600 mb-1">ELA Tamper Score</div>
              <div className="w-full bg-slate-200 rounded-full h-2.5">
                <div className={`h-2.5 rounded-full ${data.tamper_score > 50 ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${Math.min(data.tamper_score, 100)}%` }}></div>
              </div>
              <div className="text-xs text-slate-500 mt-1">{data.tamper_score.toFixed(1)} / 100</div>
            </div>
            
            <div>
              <div className="text-sm font-semibold text-slate-600 mb-1">Facial Similarity</div>
              <div className="w-full bg-slate-200 rounded-full h-2.5">
                <div className={`h-2.5 rounded-full ${data.face_similarity < 0.5 ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${(data.face_similarity * 100).toFixed(0)}%` }}></div>
              </div>
              <div className="text-xs text-slate-500 mt-1">{(data.face_similarity * 100).toFixed(1)}% match</div>
            </div>
          </div>
        </div>

        {/* Reason Codes & Decision */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center space-x-2">
              <ShieldAlert className="w-5 h-5 text-blue-500" />
              <span>Flags & Reasons</span>
            </h3>
            {data.reason_codes && data.reason_codes.length > 0 ? (
              <ul className="space-y-2">
                {data.reason_codes.map((r: string, i: number) => (
                  <li key={i} className="flex items-start space-x-2 text-red-600 bg-red-50 p-2 rounded text-sm font-medium">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-emerald-600 flex items-center space-x-2 bg-emerald-50 p-3 rounded font-medium">
                <CheckCircle className="w-5 h-5" />
                <span>No anomalies detected.</span>
              </div>
            )}
          </div>
          
          <div className="mt-8 pt-6 border-t border-slate-100">
            <h4 className="text-sm font-semibold text-slate-500 mb-3 uppercase tracking-wide text-center">Officer Action</h4>
            <div className="flex space-x-3">
              <button onClick={() => handleDecision('APPROVED')} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded transition-colors">
                Approve
              </button>
              <button onClick={() => handleDecision('REJECTED')} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded transition-colors">
                Reject
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
