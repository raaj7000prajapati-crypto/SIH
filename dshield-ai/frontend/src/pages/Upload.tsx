import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';
import { UploadCloud, FileImage, Camera } from 'lucide-react';

export default function Upload() {
  const [docFile, setDocFile] = useState<File | null>(null);
  const [liveFile, setLiveFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docFile || !liveFile) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('doc_file', docFile);
      formData.append('live_file', liveFile);

      const res = await client.post('/upload/', formData);
      const submissionId = res.data.id;
      
      // Trigger pipeline sequentially for demo
      await client.post(`/extract/${submissionId}`);
      await client.post(`/forensics/${submissionId}`);
      await client.post(`/face/${submissionId}`);
      await client.post(`/risk/${submissionId}`);
      
      navigate(`/review/${submissionId}`);
    } catch (error) {
      console.error(error);
      alert('Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-slate-200 mt-10">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800">New Verification</h1>
        <p className="text-slate-500 mt-2">Upload ID document and a live facial capture</p>
      </div>

      <form onSubmit={handleUpload} className="space-y-6">
        <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 flex flex-col items-center justify-center text-slate-600 bg-slate-50 hover:bg-slate-100 transition-colors">
          <FileImage className="w-12 h-12 text-slate-400 mb-3" />
          <label className="font-semibold cursor-pointer text-blue-600 hover:text-blue-700">
            <span>Choose Document Image</span>
            <input type="file" className="hidden" accept="image/*" onChange={(e) => setDocFile(e.target.files?.[0] || null)} />
          </label>
          <p className="text-sm mt-1">{docFile ? docFile.name : 'Passport, ID Card, or Driver License'}</p>
        </div>

        <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 flex flex-col items-center justify-center text-slate-600 bg-slate-50 hover:bg-slate-100 transition-colors">
          <Camera className="w-12 h-12 text-slate-400 mb-3" />
          <label className="font-semibold cursor-pointer text-blue-600 hover:text-blue-700">
            <span>Choose Live Photo</span>
            <input type="file" className="hidden" accept="image/*" onChange={(e) => setLiveFile(e.target.files?.[0] || null)} />
          </label>
          <p className="text-sm mt-1">{liveFile ? liveFile.name : 'Clear frontal face capture'}</p>
        </div>

        <button 
          type="submit" 
          disabled={!docFile || !liveFile || loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <span className="flex items-center space-x-2">
              <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
              <span>Processing AI Pipeline...</span>
            </span>
          ) : (
            <span className="flex items-center space-x-2">
              <UploadCloud className="w-5 h-5" />
              <span>Verify Identity</span>
            </span>
          )}
        </button>
      </form>
    </div>
  );
}
