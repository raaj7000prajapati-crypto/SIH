import { useState, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Camera, FileText, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const DocumentScreening = () => {
  const navigate = useNavigate();
  const [docType, setDocType] = useState('passport');
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDemo = (mode: string) => {
    navigate('/analysis', { state: { demoMode: mode, docType } });
  };

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (file) {
      navigate('/analysis', { state: { file, docType } });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-neutral-100 tracking-tight mb-2">New Screening</h1>
        <p className="text-neutral-500 text-sm">Upload an identity document for verification.</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-[#0A0A0A] rounded-xl border border-neutral-900"
      >
        <form onSubmit={handleSubmit} className="divide-y divide-neutral-900">
          
          {/* Document Type Selection */}
          <div className="p-6 md:p-8 space-y-4">
            <label className="text-xs font-semibold tracking-wider text-neutral-400 uppercase">Document Type</label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {['passport', 'visa', 'national_id', 'driving_license', 'permit'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setDocType(type)}
                  className={`py-3 px-4 rounded-lg border text-sm font-medium transition-colors flex flex-col items-center gap-2
                    ${docType === type 
                      ? 'bg-neutral-900 border-neutral-700 text-neutral-100' 
                      : 'bg-[#0A0A0A] border-neutral-900 text-neutral-500 hover:border-neutral-800 hover:text-neutral-300'
                    }`}
                >
                  <FileText className={`w-5 h-5 ${docType === type ? 'text-neutral-100' : 'text-neutral-600'}`} />
                  <span>{type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Upload Area */}
          <div className="p-6 md:p-8 space-y-4">
            <label className="text-xs font-semibold tracking-wider text-neutral-400 uppercase">Document Image</label>
            
            <div className="border border-dashed border-neutral-800 rounded-xl bg-neutral-900/20 p-10 flex flex-col items-center justify-center text-center hover:bg-neutral-900/50 hover:border-neutral-700 transition-colors relative group">
              <input 
                type="file" 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                onChange={handleFileChange}
                accept="image/*"
              />
              
              {file ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 bg-neutral-900 rounded-full flex items-center justify-center border border-neutral-800">
                    <CheckCircle2 className="w-6 h-6 text-neutral-100" />
                  </div>
                  <div>
                    <p className="text-neutral-200 font-medium text-sm">{file.name}</p>
                    <p className="text-neutral-500 text-xs mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <p className="text-neutral-500 text-xs mt-2">Click to replace</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 bg-neutral-900 border border-neutral-800 rounded-full flex items-center justify-center group-hover:bg-neutral-800 transition-colors">
                    <Upload className="w-5 h-5 text-neutral-400 group-hover:text-neutral-300" />
                  </div>
                  <div>
                    <p className="text-neutral-200 font-medium text-sm">Drag & Drop</p>
                    <p className="text-neutral-500 text-xs mt-1">or click to browse</p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-center pt-2">
              <button type="button" className="flex items-center gap-2 text-xs font-medium text-neutral-400 hover:text-neutral-200 transition-colors">
                <Camera className="w-4 h-4" />
                Use Camera
              </button>
            </div>
          </div>

          <div className="p-6 md:p-8 bg-neutral-900/20 flex justify-end">
            <button
              type="submit"
              disabled={!file}
              className={`px-6 py-2.5 rounded-md text-sm font-medium transition-colors
                ${!file
                  ? 'bg-neutral-900 text-neutral-600 cursor-not-allowed' 
                  : 'bg-white text-black hover:bg-neutral-200'
                }`}
            >
              Start Analysis
            </button>
          </div>
        </form>
      </motion.div>

      {/* Demo Mode Actions */}
      <div className="pt-8">
        <h3 className="text-xs font-semibold tracking-wider text-neutral-400 uppercase mb-4">Demo Scenarios</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => handleDemo('genuine')}
            className="p-5 bg-[#0A0A0A] border border-neutral-900 rounded-xl hover:border-neutral-700 transition-colors text-left flex flex-col gap-2"
          >
            <div className="flex items-center justify-between w-full">
              <div className="font-medium text-neutral-200 text-sm">Genuine</div>
              <div className="w-2 h-2 rounded-full bg-neutral-400"></div>
            </div>
            <div className="text-xs text-neutral-500">Valid document, low risk score.</div>
          </button>
          
          <button 
            onClick={() => handleDemo('tampered')}
            className="p-5 bg-[#0A0A0A] border border-neutral-900 rounded-xl hover:border-neutral-700 transition-colors text-left flex flex-col gap-2"
          >
            <div className="flex items-center justify-between w-full">
              <div className="font-medium text-neutral-200 text-sm">Tampered</div>
              <div className="w-2 h-2 rounded-full bg-neutral-400"></div>
            </div>
            <div className="text-xs text-neutral-500">Document anomalies, high risk.</div>
          </button>
          
          <button 
            onClick={() => handleDemo('impersonation')}
            className="p-5 bg-[#0A0A0A] border border-neutral-900 rounded-xl hover:border-neutral-700 transition-colors text-left flex flex-col gap-2"
          >
            <div className="flex items-center justify-between w-full">
              <div className="font-medium text-neutral-200 text-sm">Impersonation</div>
              <div className="w-2 h-2 rounded-full bg-neutral-400"></div>
            </div>
            <div className="text-xs text-neutral-500">Face mismatch, high risk.</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentScreening;
