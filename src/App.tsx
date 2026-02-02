import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, lazy, Suspense, useState, createContext, useContext } from 'react';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { Preloader } from './components/Preloader';
import ChatBot from './components/ChatBot';
import CustomCursor from './components/CustomCursor';

// Create context to signal when app is ready for heavy initialization
export const AppReadyContext = createContext(false);

export function useAppReady() {
  return useContext(AppReadyContext);
}

// Lazy load pages for better initial load
const HomePage = lazy(() => import('./pages/HomePage').then(m => ({ default: m.HomePage })));
const ProjectsPage = lazy(() => import('./pages/ProjectsPage').then(m => ({ default: m.ProjectsPage })));
const ServicesPage = lazy(() => import('./pages/ServicesPage').then(m => ({ default: m.ServicesPage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then(m => ({ default: m.ContactPage })));

// Minimal loading fallback - just empty space to prevent layout shift
function PageLoader() {
  return <div className="min-h-screen" />;
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function AppContent({ isReady }: { isReady: boolean }) {
  return (
    <AppReadyContext.Provider value={isReady}>
      <div className="min-h-screen bg-dark text-white">
        <ScrollToTop />
        <Navigation />
        <main className="pt-16">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/contact" element={<ContactPage />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
        
        {/* AI Chat Assistant */}
        {isReady && <ChatBot />}
        
        {/* Custom Cursor */}
        {isReady && <CustomCursor />}
      </div>
    </AppReadyContext.Provider>
  );
}

export function App() {
  const [appReady, setAppReady] = useState(false);

  // Check if we should skip preloader (already loaded this session)
  const [skipPreloader] = useState(() => {
    return sessionStorage.getItem('sokkar-loaded') === 'true';
  });

  const handlePreloaderComplete = () => {
    // Small delay before initializing heavy components
    // This ensures smooth transition after preloader fades
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setAppReady(true);
      });
    });
  };

  // If skipping preloader, mark as ready immediately
  useEffect(() => {
    if (skipPreloader) {
      setAppReady(true);
    }
  }, [skipPreloader]);

  return (
    <Router>
      {/* Preloader overlay */}
      {!skipPreloader && <Preloader onComplete={handlePreloaderComplete} />}
      
      {/* Main app content - always rendered but heavy stuff waits for appReady */}
      <AppContent isReady={appReady} />
    </Router>
  );
}
