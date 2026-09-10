import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const api = {
  async screenDocument(file: File | null, documentType: string, demoMode?: string) {
    const formData = new FormData();

    if (file) {
      formData.append('document', file);
    } else {
      // Create a placeholder blob for demo mode (real file is not needed server-side for demos)
      const blob = new Blob(['demo-placeholder'], { type: 'text/plain' });
      formData.append('document', blob, 'demo-document.txt');
    }

    formData.append('document_type', documentType);
    if (demoMode) {
      formData.append('demo_mode', demoMode);
    }

    const response = await axios.post(`${API_URL}/screen`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 30000,
    });
    return response.data;
  },

  async getHistory() {
    const response = await axios.get(`${API_URL}/history`, { timeout: 10000 });
    return response.data;
  }
};
