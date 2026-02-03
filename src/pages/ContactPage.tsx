import { motion } from 'framer-motion';
import { ContactForm } from '../components/ContactForm';

const contactInfo = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    label: 'Email',
    value: 'Hamzasokkardev@gmail.com',
    href: 'mailto:Hamzasokkardev@gmail.com',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
    label: 'Phone',
    value: '+20 1118777654',
    href: 'tel:+201118777654',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    label: 'Location',
    value: 'Egypt',
    subValue: 'Working Remotely',
    href: '#',
  },
];

const faqs = [
  {
    question: 'What is your typical project timeline?',
    answer: 'Project timelines vary based on scope and complexity. A simple landing page takes 1-2 weeks, while a full website might take 4-8 weeks.',
  },
  {
    question: 'Do you work with startups?',
    answer: 'Absolutely! I love working with startups and helping them build their digital presence from the ground up.',
  },
  {
    question: 'What is your pricing structure?',
    answer: 'I offer project-based pricing tailored to your specific needs. Contact me for a free quote based on your requirements.',
  },
  {
    question: 'Do you provide ongoing support?',
    answer: 'Yes, I offer ongoing maintenance and support packages to ensure your website continues to perform optimally.',
  },
  {
    question: 'Can you redesign my existing website?',
    answer: 'Absolutely! I specialize in website redesigns to make your site faster, more modern, and better at converting visitors.',
  },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export function ContactPage() {
  return (
    <div className="pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Get in <span className="gradient-text">Touch</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Ready to start your next project? I'd love to hear from you. Let's create something amazing together.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <h2 className="text-2xl font-bold mb-8">Contact Information</h2>
            
            <div className="space-y-6 mb-12">
              {contactInfo.map((info, index) => (
                <motion.a
                  key={info.label}
                  href={info.href}
                  className="flex items-center space-x-4 group"
                  initial="hidden"
                  animate="visible"
                  variants={fadeInUp}
                  transition={{ duration: 0.7, delay: 0.2 + index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  <div className="w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500/20 transition-colors duration-500">
                    {info.icon}
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">{info.label}</p>
                    <p className="text-white font-medium group-hover:text-indigo-400 transition-colors duration-500">
                      {info.value}
                      {info.subValue && (
                        <span className="text-indigo-400 ml-2">• {info.subValue}</span>
                      )}
                    </p>
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="glass-effect rounded-3xl p-8"
          >
            <h2 className="text-2xl font-bold mb-8">Send me a Message</h2>
            <ContactForm />
          </motion.div>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                transition={{ duration: 0.7, delay: index * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
                whileHover={{ y: -3, transition: { duration: 0.4 } }}
                className="glass-effect rounded-2xl p-6 transition-all duration-500"
              >
                <h3 className="text-lg font-semibold mb-3">{faq.question}</h3>
                <p className="text-gray-400 text-sm">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
