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

  benefits: `A professional website can transform your business! Here's how I can benefit you:

📈 **Increased Credibility** - Look professional and build trust with customers
💰 **More Sales/Leads** - Convert visitors into paying customers
🌍 **24/7 Availability** - Your business is accessible anytime, anywhere
🔍 **Better Visibility** - SEO optimization helps people find you on Google
📱 **Mobile Customers** - Reach users on phones and tablets
⚡ **Competitive Edge** - Stand out from competitors with a modern site

A website is an investment that pays for itself! Want to discuss your goals?`,

  mobile: `Absolutely! **Mobile optimization is included in every project** 📱

Here's what you get:
• **Responsive Design** - Looks perfect on phones, tablets & desktops
• **Touch-Friendly** - Easy navigation on touchscreens
• **Fast Loading** - Optimized for mobile networks
• **Mobile-First Approach** - I design for mobile users first
• **Cross-Browser** - Works on Safari, Chrome, Firefox & more

Over 60% of web traffic comes from mobile — your site will be ready! ✨`,

  payment: `I accept multiple payment methods for your convenience! 💳

• **Instapay** - Quick local transfers
• **PayPal** - International payments
• **Vodafone Cash** - Mobile wallet
• **Bank Transfers** - Direct deposits

Payment is typically split into milestones (deposit + final payment). We'll discuss the details based on your project! 

Any questions about payments? Feel free to ask!`,
  
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

// Normalize text: expand shortcuts and common abbreviations
function normalizeText(text: string): string {
  let normalized = text.toLowerCase().trim();
  
  // Common shortcuts and abbreviations
  const shortcuts: { [key: string]: string } = {
    'u': 'you',
    'ur': 'your',
    'r': 'are',
    'y': 'why',
    'pls': 'please',
    'plz': 'please',
    'thx': 'thanks',
    'ty': 'thank you',
    'tysm': 'thank you so much',
    'bc': 'because',
    'cuz': 'because',
    'b4': 'before',
    'w/': 'with',
    'w/o': 'without',
    'abt': 'about',
    'rn': 'right now',
    'asap': 'as soon as possible',
    'msg': 'message',
    'msgs': 'messages',
    'info': 'information',
    'idk': 'i dont know',
    'imo': 'in my opinion',
    'fyi': 'for your information',
    'btw': 'by the way',
    'dm': 'direct message',
    'ppl': 'people',
    'smth': 'something',
    'sth': 'something',
    'gonna': 'going to',
    'wanna': 'want to',
    'gotta': 'got to',
    'kinda': 'kind of',
    'sorta': 'sort of',
    'lemme': 'let me',
    'gimme': 'give me',
    'howdy': 'hello',
    'hru': 'how are you',
    'wbu': 'what about you',
    'ik': 'i know',
    'nvm': 'never mind',
    'omw': 'on my way',
    'tbh': 'to be honest',
    'tho': 'though',
    'coz': 'because',
    'cos': 'because',
    'wat': 'what',
    'wut': 'what',
    'dis': 'this',
    'dat': 'that',
    'dem': 'them',
    'da': 'the',
    'n': 'and',
    '&': 'and',
    'yr': 'your',
    'yrs': 'years',
    'hrs': 'hours',
    'mins': 'minutes',
    'secs': 'seconds',
    'approx': 'approximately',
    'esp': 'especially',
    'govt': 'government',
    'dev': 'developer',
    'devs': 'developers',
    'biz': 'business',
    'mgmt': 'management',
    'mkt': 'market',
    'amt': 'amount',
    'qty': 'quantity',
    'req': 'require',
    'reqs': 'requirements',
    'specs': 'specifications',
    'tech': 'technology',
    'diff': 'difference',
    'prob': 'probably',
    'probs': 'problems',
    'obv': 'obviously',
    'def': 'definitely',
    'thnk': 'think',
    'cn': 'can',
    'shud': 'should',
    'cud': 'could',
    'wud': 'would',
    'hv': 'have',
    'dnt': 'dont',
    'cnt': 'cant',
    'isnt': 'is not',
    'arent': 'are not',
    'wasnt': 'was not',
    'werent': 'were not',
    'doesnt': 'does not',
    'didnt': 'did not',
    'wont': 'will not',
    'cant': 'can not',
    'shouldnt': 'should not',
    'couldnt': 'could not',
    'wouldnt': 'would not',
    'havent': 'have not',
    'hasnt': 'has not',
    'hadnt': 'had not',
  };
  
  // Replace shortcuts with full words (word boundaries)
  Object.entries(shortcuts).forEach(([short, full]) => {
    const regex = new RegExp(`\\b${short}\\b`, 'gi');
    normalized = normalized.replace(regex, full);
  });
  
  return normalized;
}

function getResponse(message: string): string {
  const originalMessage = message.toLowerCase().trim();
  const normalizedMessage = normalizeText(message);
  
  // Helper function to check if message matches any patterns
  const matchesAny = (patterns: string[]): boolean => {
    return patterns.some(pattern => {
      const lowerPattern = pattern.toLowerCase();
      // Check in both original and normalized message
      return originalMessage.includes(lowerPattern) || normalizedMessage.includes(lowerPattern);
    });
  };
  
  // Greetings
  if (/^(hello|hi|hey|hola|greetings|yo|sup|howdy|what's up|whats up|hii|hiii|heya|hiya|ello|wassup|wazzup|wsg)[\\s!?.]*$/i.test(message) || 
      (normalizedMessage.includes('start') && normalizedMessage.length < 15)) {
    return botResponses.greeting;
  }
  
  // Payment methods
  if (matchesAny(['pay', 'payment', 'instapay', 'paypal', 'vodafone cash', 'bank transfer', 'how do i pay', 'how can i pay', 'how to pay', 'send money', 'transfer money', 'accept money', 'receive payment', 'payment method', 'pay you', 'paying', 'transaction', 'wire', 'cash', 'platform do you take', 'take the money', 'get paid', 'get the money', 'money from', 'send you money', 'give you money'])) {
    return botResponses.payment;
  }
  
  // Benefits / Value
  if (matchesAny(['benefit', 'help me', 'help my business', 'why do i need', 'why should i', 'what will', 'what can a website do', 'what does a website do', 'advantage', 'value', 'worth it', 'why website', 'need a website', 'website do for me', 'how can you help', 'what do i get', 'why hire', 'roi', 'return on investment', 'grow my business', 'improve my business', 'boost my business', 'benefit me', 'benefit my', 'good for me', 'good for my'])) {
    return botResponses.benefits;
  }
  
  // Mobile optimization
  if (matchesAny(['mobile', 'responsive', 'phone', 'tablet', 'iphone', 'android', 'smartphone', 'mobile friendly', 'mobile optimized', 'mobile optimization', 'work on mobile', 'work on phone', 'look on phone', 'look on mobile', 'support mobile', 'mobile support', 'mobile version', 'phone version', 'small screen', 'touch screen', 'touchscreen', 'portable', 'handheld'])) {
    return botResponses.mobile;
  }
  
  // Services
  if (matchesAny(['service', 'offer', 'what do you do', 'what can you', 'what you do', 'your work', 'help me with', 'can you do', 'do you do', 'provide', 'specialize', 'expertise', 'what are your', 'what services'])) {
    return botResponses.services;
  }
  
  // Pricing (but not payment)
  if (matchesAny(['price', 'cost', 'how much', 'budget', 'quote', 'pricing', 'rate', 'charge', 'fee', 'expensive', 'cheap', 'affordable', 'invest', 'investment', 'worth', 'estimate', 'ballpark']) && !matchesAny(['pay', 'instapay', 'paypal', 'vodafone', 'bank'])) {
    return botResponses.pricing;
  }
  
  // Packages
  if (matchesAny(['package', 'bundle', 'plan', 'tier', 'option', 'combo', 'deal'])) {
    return botResponses.packages;
  }
  
  // Process/Workflow
  if (matchesAny(['process', 'how do you work', 'workflow', 'steps', 'how does it work', 'how it work', 'methodology', 'approach', 'procedure', 'way you work', 'working style', 'collaborate', 'collaboration', 'how you work'])) {
    return botResponses.process;
  }
  
  // Timeline/Duration
  if (matchesAny(['time', 'long', 'deadline', 'duration', 'week', 'days', 'fast', 'quick', 'deliver', 'delivery', 'when can', 'how soon', 'turnaround', 'complete', 'finish', 'done', 'ready', 'urgent', 'rush', 'asap', 'speed', 'eta', 'timeframe', 'time frame', 'schedule', 'when will', 'when do', 'when would', 'takes to', 'take to build'])) {
    return botResponses.timeline;
  }
  
  // Revisions
  if (matchesAny(['revision', 'change', 'edit', 'modify', 'update', 'fix', 'tweak', 'adjust', 'alteration', 'correction', 'redo', 'undo', 'not happy', 'dont like', "don't like", 'satisfied', 'not satisfied', 'changes'])) {
    return botResponses.revisions;
  }
  
  // Domain/Hosting
  if (matchesAny(['domain', 'url', 'hosting', 'host', 'server', 'dns', 'ssl', 'website address', 'web address', '.com', 'godaddy', 'namecheap', 'deploy', 'deployment', 'live', 'online', 'publish'])) {
    return botResponses.domain;
  }
  
  // Getting Started
  if (matchesAny(['get started', 'begin', 'how do i start', 'how can i start', 'how to start', 'how i start', 'can i start', 'to start', 'next step', 'hire', 'work with you', 'work together', 'start project', 'new project', 'kick off', 'initiate', 'commence', 'lets go', "let's go", 'ready to', 'want to start', 'interested', 'sign up', 'onboard', 'onboarding', 'first step', 'where do i start', 'how to begin', 'start working', 'starting', 'get start', 'wanna start', 'want start', 'like to start', 'need to start', 'start now', 'begin now', 'start a project', 'begin a project', 'starting a project'])) {
    return botResponses.started;
  }
  
  // Contact (general)
  if (matchesAny(['contact', 'email', 'reach you', 'get in touch', 'touch with you', 'talk to you', 'speak with', 'call you', 'how can we talk', 'communicate', 'connect', 'connection', 'reach out', 'get hold', 'available', 'contact you', 'how to contact', 'ways to contact', 'how we talk', 'talk with you', 'speak to you', 'get to you'])) {
    if (normalizedMessage.includes('form')) {
      return botResponses.form;
    }
    return botResponses.contact;
  }
  
  // WhatsApp
  if (matchesAny(['whatsapp', 'whats app', 'message you', 'green button', 'text you', 'dm', 'direct message', 'instant message', 'messenger', 'sms', 'wa', 'whatapp']) || 
      (normalizedMessage.includes('chat') && !normalizedMessage.includes('chatbot') && !normalizedMessage.includes('chat bot'))) {
    return botResponses.whatsapp;
  }
  
  // Form
  if (matchesAny(['form', 'fill', 'submit', 'send message', 'inquiry', 'enquiry', 'write to', 'fill out', 'fill in'])) {
    return botResponses.form;
  }
  
  // Navigation
  if (matchesAny(['navigate', 'menu', 'page', 'where', 'find', 'go to', 'look for', 'looking for', 'locate', 'section', 'how to use', 'website work', 'site work', 'use this site', 'use the website', 'find the'])) {
    return botResponses.navigation;
  }
  
  // Technologies
  if (matchesAny(['tech', 'stack', 'framework', 'language', 'react', 'next', 'built with', 'tools', 'software', 'platform', 'wordpress', 'html', 'css', 'javascript', 'typescript', 'node', 'code', 'coding', 'programming', 'develop with', 'technology', 'what do you use', 'technologies'])) {
    return botResponses.technologies;
  }
  
  // Shopify/E-commerce
  if (matchesAny(['shopify', 'ecommerce', 'e-commerce', 'online store', 'shop', 'sell online', 'products', 'store', 'cart', 'checkout', 'woocommerce', 'magento', 'selling', 'merchant', 'inventory', 'orders', 'sell stuff', 'sell things'])) {
    return botResponses.shopify;
  }
  
  // Redesign
  if (matchesAny(['redesign', 'rebuild', 'improve', 'existing', 'already have', 'current website', 'old website', 'makeover', 'revamp', 'refresh', 'modernize', 'upgrade', 'outdated', 'update my', 'redo my', 'new look', 'facelift', 'renovation', 'have a website', 'existing site', 'my current'])) {
    return botResponses.redesign;
  }
  
  // Remote/Location
  if (matchesAny(['remote', 'location', 'egypt', 'worldwide', 'country', 'international', 'timezone', 'time zone', 'where are you', 'based', 'located', 'from where', 'geography', 'distance', 'abroad', 'overseas', 'global', 'local', 'your location', 'work from', 'where do you'])) {
    return botResponses.remote;
  }
  
  // Projects/Portfolio
  if (matchesAny(['project', 'portfolio', 'example', 'previous', 'show me', 'sample', 'case study', 'past work', 'done before', 'experience', 'clients', 'built', 'created', 'made', 'showcase', 'gallery', 'proof', 'demonstrate', 'your work', 'see your work', 'examples of'])) {
    return botResponses.projects;
  }
  
  // About
  if (matchesAny(['about', 'who are you', 'who is', 'hamza', 'sokkar', 'yourself', 'background', 'bio', 'biography', 'story', 'history', 'introduce', 'introduction', 'tell me about', 'developer', 'designer', 'founder', 'owner', 'about you', 'who you are'])) {
    return botResponses.about;
  }
  
  // Reviews
  if (matchesAny(['review', 'testimonial', 'feedback', 'rating', 'star', 'reputation', 'trust', 'reliable', 'recommend', 'recommendation', 'opinion', 'what people say', 'what others say', 'satisfied customers', 'happy clients', 'reviews', 'testimonials'])) {
    return botResponses.reviews;
  }
  
  // Buttons help
  if (matchesAny(['button', 'bottom left', 'bottom right', 'corner', 'icon', 'floating'])) {
    if (normalizedMessage.includes('whatsapp') || normalizedMessage.includes('green') || normalizedMessage.includes('left')) {
      return botResponses.whatsapp;
    }
    return "There are a few buttons you might be looking for:\n\n💚 **WhatsApp button** - Green button on the **bottom left** corner\n💬 **Chat button** - Purple button on the **bottom right** (that opened this chat!)\n📝 **Contact form** - Scroll down on homepage or go to Contact page";
  }
  
  // Thanks
  if (matchesAny(['thank', 'thanks', 'thx', 'appreciate', 'grateful', 'cheers', 'awesome', 'great', 'perfect', 'helpful', 'amazing', 'wonderful', 'fantastic', 'excellent', 'nice', 'cool', 'good job', 'well done', 'ty', 'tysm'])) {
    return "You're welcome! 😊 Is there anything else you'd like to know? I'm happy to help!";
  }
  
  // Goodbye
  if (matchesAny(['bye', 'goodbye', 'see you', 'later', 'take care', 'gotta go', 'leaving', 'cya', 'peace', 'gtg', 'im out', "i'm out", 'catch you later', 'ttyl', 'talk later'])) {
    return "Goodbye! 👋 Feel free to come back anytime you have questions. Good luck with your project!";
  }
  
  // Yes responses
  if (/^(yes|yeah|yep|sure|ok|okay|yup|absolutely|definitely|of course|certainly|ye|ya|yea|yas|yass|alright|aight|k|kk|okie|oki)[\\s!?.]*$/i.test(message)) {
    return "Great! What would you like to know more about? Feel free to ask about services, pricing, timeline, or anything else!";
  }
  
  // No responses
  if (/^(no|nope|nah|not really|no thanks|no thank you|na|naw|negative)[\\s!?.]*$/i.test(message)) {
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
        
        {!isOpen && (
          <motion.span
            className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-black"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.5, type: "spring" }}
          />
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed bottom-24 right-6 z-50 w-[350px] h-[500px] max-h-[70vh] bg-gray-900/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl shadow-purple-500/10 flex flex-col overflow-hidden"
          >
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
