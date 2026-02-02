import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const services = [
  { id: 'new-website', label: 'New Website', icon: '🌐' },
  { id: 'redesign', label: 'Website Redesign', icon: '🔄' },
  { id: 'ecommerce', label: 'E-commerce', icon: '🛒' },
  { id: 'landing-page', label: 'Landing Page', icon: '📄' },
];

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: '',
    message: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedService = services.find(s => s.id === formData.service);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Name <span className="text-indigo-400">*</span>
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:bg-white/[0.07] transition-all duration-500"
          placeholder="Your name"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Email <span className="text-indigo-400">*</span>
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:bg-white/[0.07] transition-all duration-500"
          placeholder="your@email.com"
          required
        />
      </div>

      <div ref={dropdownRef} className="relative">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Service of Interest <span className="text-gray-500">(optional)</span>
        </label>
        <button
          type="button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-left flex items-center justify-between transition-all duration-500 ${
            isDropdownOpen 
              ? 'border-indigo-500 bg-white/[0.07]' 
              : 'border-white/10 hover:border-white/20'
          }`}
        >
          <span className={selectedService ? 'text-white flex items-center gap-2' : 'text-gray-500'}>
            {selectedService ? (
              <>
                <span>{selectedService.icon}</span>
                <span>{selectedService.label}</span>
              </>
            ) : (
              'Select a service'
            )}
          </span>
          <motion.svg 
            animate={{ rotate: isDropdownOpen ? 180 : 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="w-5 h-5 text-gray-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </motion.svg>
        </button>

        <AnimatePresence>
          {isDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="absolute z-50 w-full mt-2 py-2 bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden"
            >
              <button
                type="button"
                onClick={() => {
                  setFormData({ ...formData, service: '' });
                  setIsDropdownOpen(false);
                }}
                className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-colors duration-300 ${
                  !formData.service 
                    ? 'bg-indigo-500/20 text-indigo-300' 
                    : 'text-gray-400 hover:bg-white/5'
                }`}
              >
                <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-sm">—</span>
                <span>No preference</span>
              </button>
              {services.map((service) => (
                <button
                  key={service.id}
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, service: service.id });
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-colors duration-300 ${
                    formData.service === service.id 
                      ? 'bg-indigo-500/20 text-indigo-300' 
                      : 'text-white hover:bg-white/5'
                  }`}
                >
                  <span className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500/30 to-purple-600/30 flex items-center justify-center text-sm">
                    {service.icon}
                  </span>
                  <span>{service.label}</span>
                  {formData.service === service.id && (
                    <svg className="w-5 h-5 ml-auto text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Message <span className="text-indigo-400">*</span>
        </label>
        <textarea
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          rows={4}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:bg-white/[0.07] transition-all duration-500 resize-none"
          placeholder="Tell me about your project..."
          required
        />
      </div>

      <motion.button
        whileHover={{ scale: 1.02, transition: { duration: 0.4 } }}
        whileTap={{ scale: 0.98, transition: { duration: 0.15 } }}
        type="submit"
        className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-500"
      >
        {isSubmitted ? '✓ Message Sent!' : 'Send Message'}
      </motion.button>
    </form>
  );
}
