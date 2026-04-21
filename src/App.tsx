import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { useAuthStore } from './store/authStore';

function App() {
  const initialize = useAuthStore(state => state.initialize);
  const isInitialized = useAuthStore(state => state.isInitialized);

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-amber-300 flex items-center justify-center animate-pulse shadow-lg shadow-brand-500/20">
          <span className="text-white font-bold text-xl leading-none">C</span>
        </div>
      </div>
    );
  }

  return (
    <RouterProvider router={router} />
  );
}

export default App;
