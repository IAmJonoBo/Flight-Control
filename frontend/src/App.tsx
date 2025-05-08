// Ensure 'react-router-dom' is installed: npm install react-router-dom
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import Login from './pages/Login';
import DocsPortal from './pages/DocsPortal';
import FeedbackButton from './components/FeedbackButton';
import FeedbackModal from './components/FeedbackModal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState, useCallback, useEffect } from 'react';

const App = () => {
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [networkError, setNetworkError] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>('');

  // Keyboard shortcut: Ctrl+Shift+F
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'f') {
      setFeedbackOpen(true);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Network status monitoring
  useEffect(() => {
    const updateStatus = () => setNetworkError(!navigator.onLine);
    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);
    updateStatus();
    return () => {
      window.removeEventListener('online', updateStatus);
      window.removeEventListener('offline', updateStatus);
    };
  }, []);

  const handleFeedbackSubmit = async (data: FormData) => {
    toast.promise(
      fetch('/feedback', {
        method: 'POST',
        body: data,
      }).then(async (res) => {
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          const detail = typeof err === 'object' && err !== null && 'detail' in err ? (err as any).detail : undefined;
          throw new Error(detail || 'Submission failed');
        }
        return res.json();
      }).catch((err) => {
        if (!navigator.onLine) setNetworkError(true);
        throw err;
      }),
      {
        pending: 'Submitting feedback...',
        success: 'Thank you for your feedback!',
        error: {
          render({ data }) {
            const detail = typeof data === 'object' && data !== null && 'detail' in data ? (data as any).detail : undefined;
            return detail || data?.toString() || 'Submission failed';
          },
        },
      },
      { position: 'top-right', autoClose: 5000, closeOnClick: true, pauseOnFocusLoss: true, draggable: true, role: 'status' }
    );
    setFeedbackOpen(false);
  };

  return (
    <Router>
      {networkError && (
        <div className="w-full bg-red-600 text-white text-center py-2 fixed top-0 left-0 z-50" role="alert" aria-live="assertive">
          <span>Network connection lost. Please check your connection and try again.</span>
        </div>
      )}
      <div className={networkError ? 'pt-10' : ''}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/settings" element={<Settings selectedModel={selectedModel} onModelChange={setSelectedModel} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/docs" element={<DocsPortal />} />
        </Routes>
        <FeedbackButton onClick={() => setFeedbackOpen(true)} />
        <FeedbackModal
          open={feedbackOpen}
          onClose={() => setFeedbackOpen(false)}
          onSubmit={handleFeedbackSubmit}
        />
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          role="status"
          aria-live="polite"
        />
      </div>
    </Router>
  );
};

export default App;