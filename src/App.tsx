import { HashRouter as Router, useLocation } from 'react-router-dom';
import { useEffect, useState, createContext, useContext } from 'react';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { Preloader } from './components/Preloader';
import ChatBot from './components/ChatBot';
import { HomePage } from './pages/HomePage';

export const AppReadyContext = createContext(false);

export function useAppReady() {
  return useContext(AppReadyContext);
}

function ScrollToSection() {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.replace('#', ''));
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [hash]);

  return null;
}

function AppContent({ isReady }: { isReady: boolean }) {
  return (
    <AppReadyContext.Provider value={isReady}>
      <div className="min-h-screen bg-dark text-white">
        <ScrollToSection />
        <Navigation />
        <main className="pt-16">
          <HomePage />
        </main>
        <Footer />
        
        {isReady && <ChatBot />}
      </div>
    </AppReadyContext.Provider>
  );
}

export function App() {
  const [appReady, setAppReady] = useState(false);
  const [skipPreloader] = useState(() => {
    return sessionStorage.getItem('sokkar-loaded') === 'true';
  });

  const handlePreloaderComplete = () => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setAppReady(true);
      });
    });
  };

  useEffect(() => {
    if (skipPreloader) {
      setAppReady(true);
    }
  }, [skipPreloader]);

  return (
    <Router>
      {!skipPreloader && <Preloader onComplete={handlePreloaderComplete} />}
      <AppContent isReady={appReady} />
    </Router>
  );
}
