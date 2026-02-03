import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const services = [
  {
    id: 1,
    title: 'Website Development',
    description: 'Custom-built, fast, and scalable websites from scratch using modern technologies.',
    features: ['Custom design', 'Responsive', 'SEO optimized', 'Fast performance'],
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
  },
  {
    id: 2,
    title: 'Website Redesign',
    description: 'Transform your outdated website into a modern, fast, and user-friendly experience.',
    features: ['Visual overhaul', 'Performance boost', 'Better UX', 'Modern tech'],
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
  },
  {
    id: 3,
    title: 'E-commerce & Shopify',
    description: 'Powerful online stores with Shopify or custom solutions that drive sales and conversions.',
    features: ['Shopify stores', 'Custom e-commerce', 'Secure checkout', 'Inventory system'],
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    ),
  },
  {
    id: 4,
    title: 'Landing Pages',
    description: 'High-converting landing pages designed to capture leads and drive action.',
    features: ['Conversion focused', 'Fast loading', 'Lead capture', 'Mobile optimized'],
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
];

const benefits = [
  { 
    title: 'Lightning Fast', 
    description: 'Optimized for sub-second load times',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  { 
    title: 'SEO Ready', 
    description: 'Built for maximum visibility',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
  { 
    title: 'Mobile First', 
    description: 'Perfect on every device',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
  },
  { 
    title: 'Secure & Reliable', 
    description: 'Industry best practices applied',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
];

const process = [
  { step: '01', title: 'Discovery', description: 'Understand your goals' },
  { step: '02', title: 'Design', description: 'Create the vision' },
  { step: '03', title: 'Develop', description: 'Build with precision' },
  { step: '04', title: 'Launch', description: 'Go live & support' },
];

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.15
    }
  }
};

export function ServicesPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            My <span className="gradient-text">Services</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Comprehensive web solutions to establish your online presence.
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20"
          variants={stagger}
          initial="initial"
          animate="animate"
        >
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, delay: index * 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
              whileHover={{ y: -5, transition: { duration: 0.3 } }}
              className="glass-effect p-6 rounded-2xl hover:border-indigo-500/30 transition-all duration-500 group"
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-600/20 flex items-center justify-center text-indigo-400 shrink-0 group-hover:scale-110 transition-transform duration-500">
                  {service.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                  <p className="text-gray-400 text-sm mb-4">{service.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {service.features.map((feature) => (
                      <span
                        key={feature}
                        className="px-3 py-1 text-xs rounded-full bg-white/5 text-gray-300 border border-white/10"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mb-20"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
            Why Choose <span className="gradient-text">Me</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                whileHover={{ y: -3, transition: { duration: 0.3 } }}
                className="glass-effect rounded-xl p-5 text-center group hover:border-indigo-500/20 transition-all duration-500"
              >
                <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-gradient-to-br from-indigo-500/10 to-purple-600/10 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform duration-500">
                  {benefit.icon}
                </div>
                <h3 className="font-semibold text-sm mb-1">{benefit.title}</h3>
                <p className="text-gray-500 text-xs">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mb-20"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
            My <span className="gradient-text">Process</span>
          </h2>
          
          {/* Mobile: Horizontal Scroll */}
          <div className="md:hidden">
            <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide -mx-6 px-6">
              {process.map((step, index) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="glass-effect rounded-2xl p-6 min-w-[200px] w-[70vw] max-w-[250px] flex-shrink-0 snap-center text-center"
                >
                  <span className="text-4xl font-bold text-indigo-500/30 block mb-2">{step.step}</span>
                  <h3 className="font-semibold text-lg mb-1">{step.title}</h3>
                  <p className="text-gray-500 text-sm">{step.description}</p>
                </motion.div>
              ))}
            </div>
            <p className="text-center text-gray-500 text-xs mt-4">← Swipe to see more →</p>
          </div>

          {/* Desktop: Horizontal Layout */}
          <div className="hidden md:flex items-center justify-center gap-2">
            {process.map((step, index) => (
              <div key={step.step} className="flex items-center">
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="flex items-center gap-3 px-5 py-3 glass-effect rounded-xl"
                >
                  <span className="text-2xl font-bold text-indigo-500/40">{step.step}</span>
                  <div>
                    <h3 className="font-semibold text-sm">{step.title}</h3>
                    <p className="text-gray-500 text-xs">{step.description}</p>
                  </div>
                </motion.div>
                {index < process.length - 1 && (
                  <svg className="w-5 h-5 text-indigo-500/30 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center glass-effect rounded-2xl p-8"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Ready to Get Started?
          </h2>
          <p className="text-gray-400 mb-6 max-w-lg mx-auto">
            Let's discuss your project and create something amazing together.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-500"
          >
            Start a Project
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
