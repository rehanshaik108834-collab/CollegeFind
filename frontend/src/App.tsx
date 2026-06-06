import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { CompareBar } from './components/layout/CompareBar';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { HomePage } from './pages/HomePage';
import { CollegesPage } from './pages/CollegesPage';
import { CollegeDetailPage } from './pages/CollegeDetailPage';
import { ComparePage } from './pages/ComparePage';
import { SavedPage } from './pages/SavedPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { PredictorPage } from './pages/PredictorPage';
import { DiscussionsPage } from './pages/DiscussionsPage';
import { ThreadDetailPage } from './pages/ThreadDetailPage';
import { AskQuestionPage } from './pages/AskQuestionPage';

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 1000 * 60 * 2, retry: 1 } },
});

function AppLayout() {
  const location = useLocation();
  const isAuthPage = ['/login', '/register'].includes(location.pathname);
  if (isAuthPage) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    );
  }
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/colleges" element={<CollegesPage />} />
          <Route path="/colleges/:slug" element={<CollegeDetailPage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/saved" element={<ProtectedRoute><SavedPage /></ProtectedRoute>} />
          <Route path="/predictor" element={<PredictorPage />} />
          <Route path="/discussions" element={<DiscussionsPage />} />
          <Route path="/discussions/ask" element={<ProtectedRoute><AskQuestionPage /></ProtectedRoute>} />
          <Route path="/discussions/:id" element={<ThreadDetailPage />} />
        </Routes>
      </main>
      <Footer />
      <CompareBar />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;

