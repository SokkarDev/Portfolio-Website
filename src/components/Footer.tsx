import { motion } from 'framer-motion';

export function Footer() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="border-t border-white/10 py-12 mt-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <button onClick={() => scrollToSection('home')} className="flex items-center space-x-1 mb-4">
              <span className="text-2xl font-bold tracking-tight">
                <span className="text-white">Sokkar</span>
                <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-500 bg-clip-text text-transparent">.Dev</span>
              </span>
              <motion.div
                className="w-2 h-2 rounded-full bg-gradient-to-r from-indigo-400 to-purple-500"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              />
            </button>
            <p className="text-gray-400 text-sm">
              Crafting exceptional web experiences that drive results.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { name: 'Home', id: 'home' },
                { name: 'About', id: 'about' },
                { name: 'Projects', id: 'projects' },
                { name: 'Contact', id: 'contact' },
              ].map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => scrollToSection(link.id)}
                    className="text-gray-400 hover:text-white transition-colors duration-400 text-sm"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <a href="mailto:Hamzasokkardev@gmail.com" className="hover:text-white transition-colors duration-400">
                  Hamzasokkardev@gmail.com
                </a>
              </li>
              <li>
                <a href="tel:+201118777654" className="hover:text-white transition-colors duration-400">
                  +20 1118777654
                </a>
              </li>
              <li className="text-gray-500">Remote - Worldwide</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 text-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Sokkar.Dev. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
