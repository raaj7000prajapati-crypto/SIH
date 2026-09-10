import { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle2, Circle, Loader2, AlertCircle } from 'lucide-react';
import { api } from '../services/api';
import { motion } from 'framer-motion';

const steps = [
  "Document Uploaded",
  "Image Preprocessed",
  "OCR Extraction",
  "Document Validation",
  "Tampering Detection",
  "Face Verification",
  "Database Check",
  "Risk Assessment"
];

const Analysis = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  // Use a ref to avoid stale closure issues with the interval
  const hasNavigated = useRef(false);

  useEffect(() => {
    const state = location.state as { docType?: string; demoMode?: string; file?: File } | null;
    const docType = state?.docType || 'passport';
    const demoMode = state?.demoMode;
    const file = state?.file;

    let interval: ReturnType<typeof setInterval>;
    let navTimeout: ReturnType<typeof setTimeout>;

    // Start animation
    interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= steps.length - 1) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 650);

    // Run API call
    const run = async () => {
      try {
        const result = await api.screenDocument(file as File, docType, demoMode);
        // Navigate after animation completes
        navTimeout = setTimeout(() => {
          if (!hasNavigated.current) {
            hasNavigated.current = true;
            navigate(`/result/${result.id}`, { state: { result } });
          }
        }, steps.length * 650 + 600);
      } catch (err) {
        console.error("Analysis error:", err);
        clearInterval(interval);
        setError('Analysis failed. Please check that the backend is running and try again.');
      }
    };

    run();

    // Cleanup on unmount
    return () => {
      clearInterval(interval);
      clearTimeout(navTimeout);
    };
  }, [location.state, navigate]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 bg-[#0A0A0A] border border-red-900 rounded-xl flex items-start gap-4 max-w-lg w-full"
        >
          <div className="bg-red-950 p-2 rounded-full border border-red-900 shrink-0">
            <AlertCircle className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <p className="text-red-500 font-semibold text-sm">Analysis Failed</p>
            <p className="text-neutral-400 mt-1 text-sm">{error}</p>
          </div>
        </motion.div>
        <button
          onClick={() => navigate('/screening')}
          className="px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 text-sm font-medium rounded-md transition-colors"
        >
          Return to Screening
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <div className="text-center mb-10">
        <Loader2 className="w-8 h-8 text-neutral-400 animate-spin mx-auto mb-6" />
        <h2 className="text-xl font-semibold text-neutral-100 mb-2 tracking-tight">Analysis in Progress</h2>
        <p className="text-neutral-500 text-sm">Please wait while the document is being verified.</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-[#0A0A0A] rounded-xl p-8 border border-neutral-900 shadow-sm"
      >
        <div className="space-y-6">
          {steps.map((step, index) => {
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;

            return (
              <div
                key={step}
                className={`flex items-center gap-4 transition-all duration-300 ${
                  isCompleted ? 'opacity-100' : isCurrent ? 'opacity-100' : 'opacity-40'
                }`}
              >
                <div className="shrink-0">
                  {isCompleted ? (
                    <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
                      <CheckCircle2 className="w-5 h-5 text-neutral-300" />
                    </motion.div>
                  ) : isCurrent ? (
                    <Loader2 className="w-5 h-5 text-neutral-400 animate-spin" />
                  ) : (
                    <Circle className="w-5 h-5 text-neutral-700" />
                  )}
                </div>
                <span className={`text-sm font-medium transition-colors ${
                  isCompleted ? 'text-neutral-300' : isCurrent ? 'text-neutral-100' : 'text-neutral-600'
                }`}>
                  {step}
                </span>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default Analysis;
