import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const categories = ['All', 'Business', 'Personal', 'E-commerce', 'Service'];

const projects = [
  {
    id: 1,
    title: 'Corporate Business Website',
    description: 'A sleek and professional website for a financial consulting firm with modern design, client portal, and comprehensive service showcases.',
    category: 'Business',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
    tags: ['Next.js', 'TypeScript', 'Tailwind CSS'],
  },
  {
    id: 2,
    title: 'Personal Portfolio',
    description: 'A creative and interactive personal portfolio for a photographer showcasing their work with stunning galleries and smooth animations.',
    category: 'Personal',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
    tags: ['React', 'Framer Motion', 'CSS Grid'],
  },
  {
    id: 3,
    title: 'Shopify Fashion Store',
    description: 'A high-performance Shopify e-commerce store for a fashion brand with custom theme, product filtering, and seamless checkout.',
    category: 'E-commerce',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop',
    tags: ['Shopify', 'Liquid', 'Custom Theme'],
  },
  {
    id: 4,
    title: 'Cleaning Service Platform',
    description: 'A service-based website for a cleaning company featuring online booking, service packages, customer reviews, and area coverage maps.',
    category: 'Service',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&h=600&fit=crop',
    tags: ['React', 'Node.js', 'Calendar Integration'],
  },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredProjects = projects.filter(
    (project) => activeCategory === 'All' || project.category === activeCategory
  );

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            My <span className="gradient-text">Projects</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Explore my recent web development projects across different industries and purposes.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-500 ${
                activeCategory === category
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10'
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="group"
              >
                <div className="glass-effect rounded-2xl overflow-hidden hover-glow transition-all duration-500">
                  <div className="relative overflow-hidden aspect-video">
                    <img
                      src={project.image}
                      alt={project.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-darker via-transparent to-transparent" />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-white/10 backdrop-blur-sm">
                        {project.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-indigo-400 transition-colors duration-500">
                      {project.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 rounded-md text-xs bg-white/5 text-gray-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center mt-20"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Have a project in mind?
          </h2>
          <p className="text-gray-400 mb-8">
            Let's work together to create something amazing.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-500"
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
