import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const WHATSAPP_NUMBER = '+201118777654';
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER.replace(/[^0-9]/g, '')}`;

const botResponses: { [key: string]: string } = {
  greeting: "Hey there! 👋 I'm Sokkar.Dev's assistant. I can help you with questions about services, pricing, how to get started, or anything else about the website. What would you like to know?",
  
  services: `I offer professional web development services including:

• **New Website Development** - Custom websites built from scratch with modern technologies
• **Website Redesign** - Transform your existing site into something modern, fast & stunning
• **E-commerce** - Online stores (including Shopify) that convert visitors into customers
• **Landing Pages** - High-converting pages for campaigns & product launches

Would you like more details about any specific service?`,
  
  pricing: `I don't have fixed pricing — every project is unique! 💡

Your investment is tailored specifically to **your business goals and needs**. This way, you only pay for what truly adds value to your business — no unnecessary extras.

Want to discuss your project? Fill out the contact form or message me on WhatsApp to get a custom quote!`,
  
  packages: `I don't offer pre-made packages — and here's why:

Every business has its own unique goals and challenges. Rather than fitting you into a one-size-fits-all solution, I work closely with you to **build the perfect custom package** that addresses exactly what you need.

Let's chat about your business goals! Reach out via the contact form or WhatsApp. 📱`,
  
  process: `Here's how we'll work together:

1️⃣ **Discovery** - We discuss your vision, goals & requirements
2️⃣ **Strategy** - I create a tailored plan for your project
3️⃣ **Design & Development** - Building your dream website
4️⃣ **Review & Revisions** - Unlimited revisions until you're 100% happy
5️⃣ **Launch** - Your site goes live!

I keep you updated throughout the entire journey.`,
  
  timeline: `Project timelines typically range from **1-8 weeks** depending on complexity:

• Landing Page: 1-2 weeks
• Business Website: 2-4 weeks
• E-commerce Store: 3-6 weeks
• Complex Projects: 6-8 weeks

Rush delivery is available for urgent projects! ⚡`,
  
  revisions: `**Unlimited revisions** during development! ✨

I want you to be completely satisfied with your website. Throughout the development phase, we'll refine and perfect every detail until it matches exactly what you envisioned.

Your complete satisfaction is my top priority!`,
  
  domain: `Custom domains aren't included since they're purchased through third-party providers (like GoDaddy, Namecheap, etc.). 🌐

However, I'll **walk you through the entire process for free**:
• Choosing the right domain name
• Purchasing it from a reliable registrar
• Connecting it to your new website

Domains typically cost around $10-15/year. Easy!`,
  
  started: `Getting started is super easy! 🚀

**Option 1:** Fill out the contact form on this website
→ Just enter your name, email, and message. Service selection is optional!

**Option 2:** Message me directly on WhatsApp
→ Look for the **green WhatsApp button** on the bottom left corner of your screen. Click it to start chatting!

Once you reach out, I'll personally guide you through every step.`,
  
  contact: `You can reach me through:

📧 **Email:** Hamzasokkardev@gmail.com
📱 **WhatsApp:** +20 1118777654 (click the green button on the bottom left!)
📝 **Contact Form:** Available on the Contact page

I'm based in Egypt and work remotely with clients worldwide! 🌍`,
  
  whatsapp: `To reach me on WhatsApp:

📱 **Click the green WhatsApp button** on the **bottom left corner** of your screen — it'll open a chat with me directly!

Or manually message: **+20 1118777654**

I typically respond within a few hours! 💬`,
  
  form: `To fill out the contact form:

1. Go to the **Contact** page (click "Contact" in the top menu)
2. Or scroll down on the homepage to find the form
3. Fill in your **Name** and **Email** (required)
4. Select a **Service** if you want (it's optional!)
5. Write your **Message** describing your project
6. Click **Send Message**

That's it! I'll get back to you soon. 📬`,
  
  navigation: `Here's how to navigate the website:

🏠 **Home** - Main page with overview, reviews, and contact form
💼 **Projects** - See my portfolio of completed websites
🛠️ **Services** - Detailed info about what I offer
📧 **Contact** - Full contact page with form and info

Use the menu at the top of the page to navigate!`,
  
  technologies: `I work with cutting-edge technologies:

• **Frontend:** React, Next.js, TypeScript, Tailwind CSS
• **E-commerce:** Shopify, WooCommerce
• **Backend:** Node.js, APIs
• **Performance:** Optimized for speed & SEO
• **Responsive:** Works perfectly on all devices

Your site will be fast, secure, and built to scale! 🚀`,
  
  shopify: `Yes! I build Shopify stores:

• Custom Shopify themes
• Store setup & configuration
• Product migration
• Payment & shipping setup
• App integrations

Shopify is included under my E-commerce service. Let's discuss your store! 🛍️`,
  
  redesign: `Website redesign includes:

✨ Modern, fresh design
📱 Mobile responsiveness
⚡ Performance optimization (faster loading)
🔍 SEO improvements
📦 Content migration
🎨 Brand-aligned visuals

I'll transform your outdated site into something amazing!`,
  
  remote: `Yes, I work **100% remotely** with clients worldwide! 🌍

Based in Egypt, I collaborate with clients across different time zones through:
• Video calls
• WhatsApp messaging
• Email
• Screen sharing

Distance is never an obstacle — I've worked with clients from all over the world!`,
  
  projects: `You can view my portfolio on the **Projects** page! 

I showcase 4 types of websites:
• 🏢 **Business** - Corporate/professional websites
• 👤 **Personal** - Portfolio and personal brand sites
• 🛒 **E-commerce** - Online stores
• 🔧 **Service** - Service-based business websites

Click "Projects" in the top menu to see examples!`,
  
  about: `I'm **Hamza Sokkar**, a passionate web developer based in Egypt! 

I specialize in creating modern, high-performance websites that help businesses succeed online. I work remotely with clients worldwide and pride myself on clear communication and delivering exceptional results.

Want to know more? Let's chat! 💬`,
  
  reviews: `You can find client reviews on the homepage! 

Just scroll down past the hero section and you'll see testimonials from satisfied clients. They share their experience working with me and the results they achieved.

Spoiler: They're pretty happy! ⭐`,
  
  default: `I'm not quite sure about that specific question, but I'd love to help! 

Here's what I can help you with:
• **Services** - What I offer
• **Pricing** - How pricing works
• **Timeline** - How long projects take
• **Getting Started** - How to begin
• **Contact** - Ways to reach me
• **Navigation** - How to use this website

What would you like to know?`
};

const quickReplies = [
  { text: "Services", keyword: "services" },
  { text: "Pricing", keyword: "pricing" },
  { text: "Get Started", keyword: "started" },
  { text: "WhatsApp", keyword: "whatsapp" },
];

function getResponse(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  // Greetings
  if (/^(hello|hi|hey|hola|greetings|yo|sup)[\s!?.]*$/i.test(message) || (lowerMessage.includes('start') && lowerMessage.length < 15)) {
    return botResponses.greeting;
  }
  
  // Services
  if (lowerMessage.includes('service') || lowerMessage.includes('offer') || lowerMessage.includes('what do you do') || lowerMessage.includes('what can you')) {
    return botResponses.services;
  }
  
  // Pricing
  if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('how much') || lowerMessage.includes('budget') || lowerMessage.includes('quote') || lowerMessage.includes('pricing') || lowerMessage.includes('rate') || lowerMessage.includes('charge') || lowerMessage.includes('fee')) {
    return botResponses.pricing;
  }
  
  // Packages
  if (lowerMessage.includes('package') || lowerMessage.includes('bundle') || lowerMessage.includes('plan')) {
    return botResponses.packages;
  }
  
  // Process / Workflow
  if (lowerMessage.includes('process') || lowerMessage.includes('how do you work') || lowerMessage.includes('workflow') || lowerMessage.includes('steps') || lowerMessage.includes('how does it work')) {
    return botResponses.process;
  }
  
  // Timeline
  if (lowerMessage.includes('time') || lowerMessage.includes('long') || lowerMessage.includes('deadline') || lowerMessage.includes('duration') || lowerMessage.includes('week') || lowerMessage.includes('days') || lowerMessage.includes('fast') || lowerMessage.includes('quick')) {
    return botResponses.timeline;
  }
  
  // Revisions
  if (lowerMessage.includes('revision') || lowerMessage.includes('change') || lowerMessage.includes('edit') || lowerMessage.includes('modify') || lowerMessage.includes('update') || lowerMessage.includes('fix')) {
    return botResponses.revisions;
  }
  
  // Domain
  if (lowerMessage.includes('domain') || lowerMessage.includes('url') || lowerMessage.includes('hosting') || lowerMessage.includes('host')) {
    return botResponses.domain;
  }
  
  // Getting Started
  if (lowerMessage.includes('get started') || lowerMessage.includes('begin') || lowerMessage.includes('how do i start') || lowerMessage.includes('next step') || lowerMessage.includes('hire') || lowerMessage.includes('work with you')) {
    return botResponses.started;
  }
  
  // Contact (general)
  if ((lowerMessage.includes('contact') && !lowerMessage.includes('form')) || lowerMessage.includes('email') || lowerMessage.includes('phone') || lowerMessage.includes('reach you') || lowerMessage.includes('get in touch')) {
    return botResponses.contact;
  }
  
  // WhatsApp specific
  if (lowerMessage.includes('whatsapp') || lowerMessage.includes('whats app') || lowerMessage.includes('message you') || (lowerMessage.includes('chat') && !lowerMessage.includes('chatbot')) || lowerMessage.includes('green button') || lowerMessage.includes('text you')) {
    return botResponses.whatsapp;
  }
  
  // Form specific
  if (lowerMessage.includes('form') || lowerMessage.includes('fill') || lowerMessage.includes('submit') || lowerMessage.includes('send message')) {
    return botResponses.form;
  }
  
  // Navigation
  if (lowerMessage.includes('navigate') || lowerMessage.includes('menu') || lowerMessage.includes('page') || lowerMessage.includes('where') || lowerMessage.includes('find') || lowerMessage.includes('go to')) {
    return botResponses.navigation;
  }
  
  // Technologies
  if (lowerMessage.includes('tech') || lowerMessage.includes('stack') || lowerMessage.includes('framework') || lowerMessage.includes('language') || lowerMessage.includes('react') || lowerMessage.includes('next') || lowerMessage.includes('built with') || lowerMessage.includes('use')) {
    return botResponses.technologies;
  }
  
  // Shopify / E-commerce
  if (lowerMessage.includes('shopify') || lowerMessage.includes('ecommerce') || lowerMessage.includes('e-commerce') || lowerMessage.includes('online store') || lowerMessage.includes('shop') || lowerMessage.includes('sell online') || lowerMessage.includes('products')) {
    return botResponses.shopify;
  }
  
  // Redesign
  if (lowerMessage.includes('redesign') || lowerMessage.includes('rebuild') || lowerMessage.includes('improve') || lowerMessage.includes('existing') || lowerMessage.includes('already have') || lowerMessage.includes('current website') || lowerMessage.includes('old website') || lowerMessage.includes('makeover')) {
    return botResponses.redesign;
  }
  
  // Remote / Location
  if (lowerMessage.includes('remote') || lowerMessage.includes('location') || lowerMessage.includes('egypt') || lowerMessage.includes('worldwide') || lowerMessage.includes('country') || lowerMessage.includes('international') || lowerMessage.includes('timezone')) {
    return botResponses.remote;
  }
  
  // Projects / Portfolio
  if (lowerMessage.includes('project') || lowerMessage.includes('portfolio') || lowerMessage.includes('example') || lowerMessage.includes('work') || lowerMessage.includes('previous') || lowerMessage.includes('show me') || lowerMessage.includes('sample')) {
    return botResponses.projects;
  }
  
  // About
  if (lowerMessage.includes('about') || lowerMessage.includes('who are you') || lowerMessage.includes('who is') || lowerMessage.includes('hamza') || lowerMessage.includes('sokkar') || lowerMessage.includes('yourself') || lowerMessage.includes('background')) {
    return botResponses.about;
  }
  
  // Reviews / Testimonials
  if (lowerMessage.includes('review') || lowerMessage.includes('testimonial') || lowerMessage.includes('feedback') || lowerMessage.includes('client') || lowerMessage.includes('rating') || lowerMessage.includes('star')) {
    return botResponses.reviews;
  }
  
  // Button locations
  if (lowerMessage.includes('button') || lowerMessage.includes('bottom left') || lowerMessage.includes('bottom right') || lowerMessage.includes('corner')) {
    if (lowerMessage.includes('whatsapp') || lowerMessage.includes('green') || lowerMessage.includes('left')) {
      return botResponses.whatsapp;
    }
    return "There are a few buttons you might be looking for:\n\n💚 **WhatsApp button** - Green button on the **bottom left** corner\n💬 **Chat button** - Purple button on the **bottom right** (that opened this chat!)\n📝 **Contact form** - Scroll down on homepage or go to Contact page";
  }
  
  // Thank you responses
  if (lowerMessage.includes('thank') || lowerMessage.includes('thanks') || lowerMessage.includes('thx') || lowerMessage.includes('appreciate')) {
    return "You're welcome! 😊 Is there anything else you'd like to know? I'm happy to help!";
  }
  
  // Bye responses
  if (lowerMessage.includes('bye') || lowerMessage.includes('goodbye') || lowerMessage.includes('see you') || lowerMessage.includes('later')) {
    return "Goodbye! 👋 Feel free to come back anytime you have questions. Good luck with your project!";
  }
  
  // Yes/No responses
  if (/^(yes|yeah|yep|sure|ok|okay)[\s!?.]*$/i.test(message)) {
    return "Great! What would you like to know more about? Feel free to ask about services, pricing, timeline, or anything else!";
  }
  
  if (/^(no|nope|nah)[\s!?.]*$/i.test(message)) {
    return "No problem! If you have any questions later, I'm here to help. You can also reach out via WhatsApp or the contact form! 😊";
  }
  
  return botResponses.default;
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: botResponses.greeting,
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSend = (text?: string) => {
    const messageText = text || inputValue.trim();
    if (!messageText) return;

    const userMessage: Message = {
      id: Date.now(),
      text: messageText,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const botMessage: Message = {
        id: Date.now() + 1,
        text: getResponse(messageText),
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 800 + Math.random() * 400);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatMessage = (text: string) => {
    return text.split('\n').map((line, i) => {
      // Bold text
      const formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      return (
        <span key={i} dangerouslySetInnerHTML={{ __html: formattedLine }} />
      );
    }).reduce((acc: React.ReactNode[], curr, i) => {
      if (i === 0) return [curr];
      return [...acc, <br key={`br-${i}`} />, curr];
    }, []);
  };

  return (
    <>
      {/* WhatsApp Button - Bottom Left, Smaller */}
      <motion.a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 left-6 z-50 w-11 h-11 rounded-full bg-[#25D366] text-white shadow-lg shadow-green-500/30 flex items-center justify-center hover:shadow-green-500/50 hover:scale-110 transition-all duration-500"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], delay: 1.2 }}
        title="Chat on WhatsApp"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </motion.a>

      {/* Chat Button - Bottom Right */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-purple-500/30 flex items-center justify-center hover:shadow-purple-500/50 transition-shadow duration-500"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], delay: 1 }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.svg
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </motion.svg>
          ) : (
            <motion.svg
              key="chat"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </motion.svg>
          )}
        </AnimatePresence>
        
        {/* Notification dot */}
        {!isOpen && (
          <motion.span
            className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-black"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.5, type: "spring" }}
          />
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed bottom-24 right-6 z-50 w-[350px] h-[500px] max-h-[70vh] bg-gray-900/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl shadow-purple-500/10 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10 bg-gradient-to-r from-indigo-600/20 to-purple-600/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                  S
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm">Sokkar.Dev Assistant</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="text-gray-400 text-xs">Online • Here to help</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      message.isBot
                        ? 'bg-white/10 text-gray-200 rounded-tl-md'
                        : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-tr-md'
                    }`}
                  >
                    {formatMessage(message.text)}
                  </div>
                </motion.div>
              ))}
              
              {/* Typing indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-white/10 rounded-2xl rounded-tl-md px-4 py-3">
                    <div className="flex gap-1">
                      <motion.span
                        className="w-2 h-2 bg-gray-400 rounded-full"
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                      />
                      <motion.span
                        className="w-2 h-2 bg-gray-400 rounded-full"
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.15 }}
                      />
                      <motion.span
                        className="w-2 h-2 bg-gray-400 rounded-full"
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            {messages.length <= 2 && (
              <div className="px-4 pb-2">
                <div className="flex flex-wrap gap-2">
                  {quickReplies.map((reply) => (
                    <motion.button
                      key={reply.keyword}
                      onClick={() => handleSend(reply.text)}
                      className="px-3 py-1.5 text-xs rounded-full bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white transition-all duration-300 border border-white/10"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {reply.text}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-white/10 bg-black/30">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 bg-white/10 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all duration-300"
                />
                <motion.button
                  onClick={() => handleSend()}
                  disabled={!inputValue.trim()}
                  className="w-10 h-10 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
