import { useLocation, useNavigate } from 'react-router-dom';
import { ShieldAlert, ShieldCheck, Download, UserCheck, AlertTriangle, FileText, CheckCircle2, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const StatusIcon = ({ status }: { status: string }) => {
  if (status === 'PASS' || status === 'VALID' || status === 'MATCH' || status === 'CLEAR') {
    return <CheckCircle2 className="w-4 h-4 text-green-500" />;
  }
  if (status === 'WARNING' || status === 'REVIEW') {
    return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
  }
  return <XCircle className="w-4 h-4 text-red-500" />;
};

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result;

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <h2 className="text-sm text-neutral-400 font-medium">No result data found.</h2>
        <button onClick={() => navigate('/screening')} className="text-neutral-200 hover:underline transition-colors text-sm">Go back to screening</button>
      </div>
    );
  }

  const isHighRisk = result.risk.level === 'HIGH';
  const isReview = result.risk.level === 'REVIEW';
  const riskColor = isHighRisk ? 'text-red-500' : isReview ? 'text-yellow-500' : 'text-green-500';
  const bgRiskColor = isHighRisk ? 'bg-red-950 border-red-900' : isReview ? 'bg-yellow-950 border-yellow-900' : 'bg-green-950 border-green-900';

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-100 tracking-tight mb-1">Screening Result</h1>
          <p className="text-neutral-500 text-sm">ID: <span className="text-neutral-300 font-mono">{result.id}</span> • {new Date(result.timestamp).toLocaleString()}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-[#0A0A0A] hover:bg-neutral-900 text-neutral-300 rounded-md border border-neutral-800 transition-colors text-sm font-medium">
            <Download className="w-4 h-4" />
            Save Report
          </button>
          {(isHighRisk || isReview) && (
            <button className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-neutral-200 text-black rounded-md transition-colors text-sm font-medium">
              <UserCheck className="w-4 h-4" />
              Manual Review
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Score & Document */}
        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`p-8 rounded-xl border flex flex-col items-center justify-center text-center ${bgRiskColor}`}
          >
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-4">Final Risk Score</h3>
            <div className="flex items-end gap-1 mb-4">
              <span className={`text-6xl font-bold tracking-tight ${riskColor}`}>{result.risk.score}</span>
              <span className="text-lg text-neutral-500 font-medium mb-1.5">/ 100</span>
            </div>
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded bg-black/20 text-xs font-bold border border-black/10 uppercase ${riskColor}`}>
              {isHighRisk ? <ShieldAlert className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
              {result.risk.level} Risk
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-[#0A0A0A] rounded-xl border border-neutral-900 overflow-hidden"
          >
            <div className="p-5 border-b border-neutral-900">
              <h3 className="text-sm font-semibold text-neutral-200">Extracted Data</h3>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex justify-between items-center border-b border-neutral-900/50 pb-2">
                <span className="text-neutral-500 text-xs uppercase tracking-wider font-medium">Name</span>
                <span className="text-neutral-200 text-sm font-medium">{result.ocr.name}</span>
              </div>
              <div className="flex justify-between items-center border-b border-neutral-900/50 pb-2">
                <span className="text-neutral-500 text-xs uppercase tracking-wider font-medium">Document No.</span>
                <span className="text-neutral-200 text-sm font-medium font-mono">{result.ocr.passport_number}</span>
              </div>
              <div className="flex justify-between items-center border-b border-neutral-900/50 pb-2">
                <span className="text-neutral-500 text-xs uppercase tracking-wider font-medium">Nationality</span>
                <span className="text-neutral-200 text-sm font-medium">{result.ocr.nationality}</span>
              </div>
              <div className="flex justify-between items-center border-b border-neutral-900/50 pb-2">
                <span className="text-neutral-500 text-xs uppercase tracking-wider font-medium">Date of Birth</span>
                <span className="text-neutral-200 text-sm font-medium">{result.ocr.dob}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-500 text-xs uppercase tracking-wider font-medium">Expiry</span>
                <span className="text-neutral-200 text-sm font-medium">{result.ocr.expiry}</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column - Analysis Details */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-[#0A0A0A] rounded-xl border border-neutral-900 overflow-hidden"
          >
            <div className="p-5 border-b border-neutral-900">
              <h3 className="text-sm font-semibold text-neutral-200">Analysis Details</h3>
            </div>
            <div className="divide-y divide-neutral-900">
              
              {/* OCR */}
              <div className="p-5 flex items-center justify-between hover:bg-neutral-900/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-neutral-900 border border-neutral-800 rounded-md"><FileText className="w-4 h-4 text-neutral-400" /></div>
                  <div>
                    <h4 className="font-medium text-sm text-neutral-200">OCR Extraction</h4>
                    <p className="text-xs text-neutral-500 mt-0.5">Document text recognition</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-neutral-300 bg-neutral-900 px-2 py-1 rounded border border-neutral-800">PASS</span>
                  <StatusIcon status="PASS" />
                </div>
              </div>

              {/* Validation */}
              <div className="p-5 flex items-center justify-between hover:bg-neutral-900/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-neutral-900 border border-neutral-800 rounded-md"><CheckCircle2 className="w-4 h-4 text-neutral-400" /></div>
                  <div>
                    <h4 className="font-medium text-sm text-neutral-200">Document Validation</h4>
                    <p className="text-xs text-neutral-500 mt-0.5">Logical & format consistency</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-neutral-300 bg-neutral-900 px-2 py-1 rounded border border-neutral-800 uppercase">{result.validation.status}</span>
                  <StatusIcon status={result.validation.status} />
                </div>
              </div>

              {/* Tampering */}
              <div className="p-5 flex items-center justify-between hover:bg-neutral-900/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-neutral-900 border border-neutral-800 rounded-md"><ShieldAlert className="w-4 h-4 text-neutral-400" /></div>
                  <div>
                    <h4 className="font-medium text-sm text-neutral-200">Tampering Detection</h4>
                    <p className="text-xs text-neutral-500 mt-0.5">Image forensic analysis</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-neutral-300 bg-neutral-900 px-2 py-1 rounded border border-neutral-800 uppercase">{result.tampering.status === 'PASS' ? 'CLEAR' : 'DETECTED'}</span>
                  <StatusIcon status={result.tampering.status} />
                </div>
              </div>

              {/* Face */}
              <div className="p-5 flex items-center justify-between hover:bg-neutral-900/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-neutral-900 border border-neutral-800 rounded-md"><UserCheck className="w-4 h-4 text-neutral-400" /></div>
                  <div>
                    <h4 className="font-medium text-sm text-neutral-200">Face Verification</h4>
                    <p className="text-xs text-neutral-500 mt-0.5">Similarity: {result.face.similarity}%</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-neutral-300 bg-neutral-900 px-2 py-1 rounded border border-neutral-800 uppercase">{result.face.status}</span>
                  <StatusIcon status={result.face.status} />
                </div>
              </div>

              {/* Database */}
              <div className="p-5 flex items-center justify-between hover:bg-neutral-900/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-neutral-900 border border-neutral-800 rounded-md"><CheckCircle2 className="w-4 h-4 text-neutral-400" /></div>
                  <div>
                    <h4 className="font-medium text-sm text-neutral-200">Database Verification</h4>
                    <p className="text-xs text-neutral-500 mt-0.5">Mock reference check</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-neutral-300 bg-neutral-900 px-2 py-1 rounded border border-neutral-800 uppercase">{result.database.status}</span>
                  <StatusIcon status={result.database.status} />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Detected Anomalies Section */}
          {(result.validation.issues.length > 0 || result.tampering.regions.length > 0 || result.face.status === 'MISMATCH') && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="bg-[#0A0A0A] rounded-xl border border-red-900/50 overflow-hidden"
            >
              <div className="p-5 border-b border-red-900/50 bg-red-950/20">
                <h3 className="text-sm font-semibold text-red-500 flex items-center gap-2 uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4" />
                  Detected Anomalies
                </h3>
              </div>
              <div className="p-5">
                <ul className="space-y-3">
                  {result.validation.issues.map((issue: string, i: number) => (
                    <li key={`val-${i}`} className="flex items-start gap-3">
                      <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                      <span className="text-neutral-300 text-sm">{issue}</span>
                    </li>
                  ))}
                  {result.tampering.regions.map((region: string, i: number) => (
                    <li key={`tamp-${i}`} className="flex items-start gap-3">
                      <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                      <span className="text-neutral-300 text-sm">Possible manipulation in <strong className="text-neutral-200">{region}</strong> region</span>
                    </li>
                  ))}
                  {result.face.status === 'MISMATCH' && (
                    <li className="flex items-start gap-3">
                      <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                      <span className="text-neutral-300 text-sm">Face similarity below threshold ({result.face.similarity}%)</span>
                    </li>
                  )}
                </ul>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Result;
