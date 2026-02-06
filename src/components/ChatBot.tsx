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

// Normalize text - expand shortcuts and common abbreviations
function normalizeText(text: string): string {
  const shortcuts: { [key: string]: string } = {
    'u': 'you', 'ur': 'your', 'r': 'are', 'y': 'why', 'w': 'with',
    'b': 'be', 'n': 'and', 'k': 'okay', 'ok': 'okay', 'pls': 'please',
    'plz': 'please', 'thx': 'thanks', 'ty': 'thank you', 'bc': 'because',
    'cuz': 'because', 'coz': 'because', 'idk': 'i do not know',
    'idc': 'i do not care', 'imo': 'in my opinion', 'tbh': 'to be honest',
    'rn': 'right now', 'asap': 'as soon as possible', 'btw': 'by the way',
    'fyi': 'for your information', 'lmk': 'let me know', 'hmu': 'hit me up',
    'msg': 'message', 'txt': 'text', 'info': 'information', 'abt': 'about',
    'w/': 'with', 'w/o': 'without', 'b4': 'before', '2': 'to', '4': 'for',
    'gr8': 'great', 'm8': 'mate', 'l8': 'late', 'l8r': 'later',
    'wanna': 'want to', 'gonna': 'going to', 'gotta': 'got to',
    'kinda': 'kind of', 'sorta': 'sort of', 'outta': 'out of',
    'coulda': 'could have', 'shoulda': 'should have', 'woulda': 'would have',
    'aint': 'is not', 'cant': 'cannot', 'dont': 'do not', 'wont': 'will not',
    'didnt': 'did not', 'doesnt': 'does not', 'isnt': 'is not',
    'wasnt': 'was not', 'werent': 'were not', 'havent': 'have not',
    'hasnt': 'has not', 'hadnt': 'had not', 'wouldnt': 'would not',
    'couldnt': 'could not', 'shouldnt': 'should not', 'mustnt': 'must not',
    'whats': 'what is', 'thats': 'that is', 'heres': 'here is',
    'theres': 'there is', 'wheres': 'where is', 'hows': 'how is',
    'whos': 'who is', 'whens': 'when is', 'whys': 'why is',
    'im': 'i am', 'ive': 'i have', 'id': 'i would', 'ill': 'i will',
    'youre': 'you are', 'youve': 'you have', 'youd': 'you would', 'youll': 'you will',
    'hes': 'he is', 'shes': 'she is', 'its': 'it is', 'theyre': 'they are',
    'weve': 'we have', 'theyve': 'they have', 'wed': 'we would',
    'dev': 'developer', 'devs': 'developers', 'biz': 'business',
    'tech': 'technology', 'govt': 'government', 'mgmt': 'management',
    'yrs': 'years', 'yr': 'year', 'mo': 'month', 'mos': 'months',
    'hr': 'hour', 'hrs': 'hours', 'min': 'minute', 'mins': 'minutes',
    'sec': 'second', 'secs': 'seconds', 'approx': 'approximately',
    'est': 'estimated', 'amt': 'amount', 'qty': 'quantity',
    'sm': 'small', 'med': 'medium', 'lg': 'large', 'xl': 'extra large',
    'fb': 'facebook', 'ig': 'instagram', 'tw': 'twitter', 'li': 'linkedin',
    'yt': 'youtube', 'wp': 'wordpress', 'js': 'javascript', 'ts': 'typescript',
    'exp': 'experience', 'xp': 'experience', 'xperience': 'experience',
  };
  
  let normalized = text.toLowerCase().trim();
  
  // Handle word boundaries for shortcuts
  Object.keys(shortcuts).forEach(shortcut => {
    const regex = new RegExp(`\\b${shortcut}\\b`, 'gi');
    normalized = normalized.replace(regex, shortcuts[shortcut]);
  });
  
  return normalized;
}

// Calculate similarity between two strings (Levenshtein-based)
function similarity(s1: string, s2: string): number {
  const longer = s1.length > s2.length ? s1 : s2;
  const shorter = s1.length > s2.length ? s2 : s1;
  
  if (longer.length === 0) return 1.0;
  
  const costs: number[] = [];
  for (let i = 0; i <= shorter.length; i++) {
    let lastValue = i;
    for (let j = 0; j <= longer.length; j++) {
      if (i === 0) {
        costs[j] = j;
      } else if (j > 0) {
        let newValue = costs[j - 1];
        if (shorter[i - 1] !== longer[j - 1]) {
          newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
        }
        costs[j - 1] = lastValue;
        lastValue = newValue;
      }
    }
    if (i > 0) costs[longer.length] = lastValue;
  }
  
  return (longer.length - costs[longer.length]) / longer.length;
}

// Check if any keyword/phrase matches
function matchesAny(text: string, patterns: string[]): boolean {
  const normalizedText = normalizeText(text);
  
  for (const pattern of patterns) {
    const normalizedPattern = normalizeText(pattern);
    
    // Direct inclusion
    if (normalizedText.includes(normalizedPattern)) return true;
    
    // Word-by-word fuzzy matching for short phrases
    const patternWords = normalizedPattern.split(' ');
    const textWords = normalizedText.split(' ');
    
    // Check if all pattern words appear (with fuzzy matching)
    let allWordsFound = true;
    for (const pWord of patternWords) {
      if (pWord.length < 3) continue; // Skip very short words
      
      let wordFound = false;
      for (const tWord of textWords) {
        if (similarity(pWord, tWord) > 0.8) {
          wordFound = true;
          break;
        }
      }
      if (!wordFound && pWord.length > 3) {
        allWordsFound = false;
        break;
      }
    }
    if (allWordsFound && patternWords.filter(w => w.length > 3).length > 0) {
      return true;
    }
  }
  
  return false;
}

const botResponses: { [key: string]: string } = {
  greeting: "Hey there! 👋 I'm Sokkar.Dev's assistant. I can help you with questions about services, pricing, experience, how to get started, or anything else. What would you like to know?",
  
  services: `I offer professional web development services including:

• **New Website Development** - Custom websites built from scratch with modern technologies
• **Website Redesign** - Transform your existing site into something modern, fast & stunning
• **E-commerce & Shopify** - Online stores that convert visitors into customers
• **Landing Pages** - High-converting pages for campaigns & product launches

Would you like more details about any specific service?`,
  
  experience: `I have **3+ years of professional web development experience**! 🚀

During this time, I've:
• Built various websites including business, personal, and e-commerce sites
• Specialized in e-commerce websites and online stores
• Became an expert in WordPress and Shopify development
• Worked with clients from different industries worldwide

I'm constantly learning and staying up-to-date with the latest technologies!`,
  
  pricing: `I don't have fixed pricing — every project is unique! 💡

Your investment is tailored specifically to **your business goals and needs**. This way, you only pay for what truly adds value to your business — no unnecessary extras.

Want to discuss your project? Fill out the contact form or message me on WhatsApp to get a custom quote!`,
  
  packages: `I don't offer pre-made packages — and here's why:

Every business has its own unique goals and challenges. Rather than fitting you into a one-size-fits-all solution, I work closely with you to **build the perfect custom solution** that addresses exactly what you need.

Let's chat about your business goals! Reach out via the contact form or WhatsApp. 📱`,
  
  payment: `I accept multiple payment methods for your convenience:

💳 **PayPal** - For international clients
📱 **Vodafone Cash** - For local payments in Egypt
🏦 **Instapay** - Fast local bank transfers
🏛️ **Bank Transfers** - Direct wire transfers

Payment is typically split: 50% upfront to start, 50% upon completion. We can discuss flexible arrangements based on your project!`,
  
  benefits: `Great question! Here's what a professional website can do for your business:

📈 **Increased Credibility** - Look professional and trustworthy
💰 **More Sales & Leads** - Convert visitors into customers 24/7
🌍 **Wider Reach** - Be accessible to customers worldwide
📱 **Mobile Customers** - Capture the 60%+ of mobile users
🔍 **Better Visibility** - Rank higher on Google
🏆 **Competitive Edge** - Stand out from competitors

A website is your digital storefront that works for you around the clock!`,
  
  mobile: `Absolutely! **Mobile optimization is included in every project** I build. 📱

All websites I create are:
• Fully responsive (works on all screen sizes)
• Mobile-first designed
• Touch-friendly navigation
• Fast-loading on mobile networks
• Tested on multiple devices

Over 60% of web traffic comes from mobile, so this is non-negotiable for me!`,
  
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

📧 **Email:** hamzasokkardev@gmail.com
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

🏠 **Home** - Main page with about me, projects, skills, and contact
💼 **Projects** - See my portfolio of completed websites
🛠️ **Services** - Detailed info about what I offer
📧 **Contact** - Full contact page with form and info

Use the menu at the top of the page to navigate!`,
  
  technologies: `I work with cutting-edge technologies:

• **Frontend:** React, Next.js, TypeScript, Tailwind CSS
• **E-commerce:** Shopify, Custom Solutions
• **Animation:** Framer Motion
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

Click "Projects" in the top menu or scroll down on the homepage to see featured work including:
• 💪 Elev8Fitness Gym Website
• 🛒 E-commerce Fashion Store
• 🏢 Corporate Business Websites
• 📸 Creative Portfolio Sites

Each project showcases different skills and industries!`,
  
  about: `I'm **Hamza Sokkar**, a passionate web developer based in Egypt! 

With 3+ years of experience, I specialize in creating modern, high-performance websites that help businesses succeed online. I work remotely with clients worldwide and pride myself on clear communication and delivering exceptional results.

Want to know more? Check out the About section on the homepage! 💬`,
  
  reviews: `You can find client testimonials on the homepage! 

Just scroll down past the projects section and you'll see feedback from satisfied clients. They share their experience working with me and the results they achieved.

Spoiler: They're pretty happy! ⭐`,
  
  skills: `My main skills and technologies include:

**Frontend (Advanced):**
React, TypeScript, Next.js, Tailwind CSS, Framer Motion

**Backend & E-commerce:**
Node.js, Shopify, WordPress, REST APIs

**Tools:**
Git, Figma, Vercel, VS Code

Check out the Skills section on the homepage for the full list!`,
  
  default: `I'm not quite sure about that specific question, but I'd love to help! 

Here's what I can help you with:
• **Services** - What I offer
• **Experience** - My background (3+ years!)
• **Pricing** - How pricing works
• **Payment** - How to pay me
• **Timeline** - How long projects take
• **Getting Started** - How to begin
• **Contact** - Ways to reach me

What would you like to know?`
};

const quickReplies = [
  { text: "Services", keyword: "services" },
  { text: "Experience", keyword: "experience" },
  { text: "Pricing", keyword: "pricing" },
  { text: "Get Started", keyword: "started" },
];

function getResponse(message: string): string {
  const normalizedMessage = normalizeText(message);
  
  // Greeting patterns
  if (/^(hello|hi|hey|hola|greetings|yo|sup|howdy|good morning|good afternoon|good evening)[\s!?.]*$/i.test(message.trim()) || 
      (normalizedMessage.includes('start') && normalizedMessage.length < 20 && !normalizedMessage.includes('get') && !normalizedMessage.includes('how'))) {
    return botResponses.greeting;
  }
  
  // Experience questions
  if (matchesAny(message, [
    'experience', 'years of experience', 'how long have you been', 'how many years',
    'how much experience', 'your experience', 'background', 'track record',
    'how experienced', 'portfolio history', 'work history', 'career',
    'been doing this', 'been working', 'professional experience', 'in the field',
    'industry experience', 'expertise level', 'skill level', 'how skilled',
    'qualifications', 'credentials', 'how good are you'
  ])) {
    return botResponses.experience;
  }
  
  // Payment questions
  if (matchesAny(message, [
    'pay', 'payment', 'how can i pay', 'how do i pay', 'payment method',
    'payment options', 'send money', 'transfer money', 'pay you',
    'paypal', 'vodafone cash', 'instapay', 'bank transfer', 'wire',
    'accept payment', 'take payment', 'receive payment', 'get paid',
    'payment platform', 'money transfer', 'how to pay', 'ways to pay',
    'payment gateway', 'credit card', 'debit card', 'billing'
  ])) {
    return botResponses.payment;
  }
  
  // Benefits questions
  if (matchesAny(message, [
    'benefit', 'how can you benefit', 'what will a website do', 'why need website',
    'why do i need', 'advantages', 'value', 'worth it', 'roi', 'return',
    'help my business', 'grow my business', 'what can a website do',
    'why should i', 'is it worth', 'need a website', 'purpose of website',
    'website importance', 'benefits of having', 'advantage of', 'help me grow',
    'increase sales', 'get more customers', 'good for business'
  ])) {
    return botResponses.benefits;
  }
  
  // Mobile optimization questions
  if (matchesAny(message, [
    'mobile', 'responsive', 'phone', 'tablet', 'mobile friendly',
    'mobile optimization', 'work on phone', 'look on phone', 'mobile version',
    'support mobile', 'mobile support', 'iphone', 'android', 'smartphone',
    'mobile device', 'small screen', 'touch screen', 'mobile first',
    'responsive design', 'adapts to screen', 'different screen sizes'
  ])) {
    return botResponses.mobile;
  }
  
  // Service questions
  if (matchesAny(message, [
    'service', 'services', 'offer', 'what do you do', 'what can you do',
    'what you do', 'provide', 'help with', 'work on', 'build',
    'create', 'develop', 'make website', 'make site', 'offerings'
  ])) {
    return botResponses.services;
  }
  
  // Pricing questions
  if (matchesAny(message, [
    'price', 'pricing', 'cost', 'how much', 'budget', 'quote', 'estimate',
    'rate', 'charge', 'fee', 'expensive', 'cheap', 'affordable', 'investment',
    'money', 'dollar', 'usd', 'egp', 'pound', 'currency'
  ])) {
    return botResponses.pricing;
  }
  
  // Package questions
  if (matchesAny(message, [
    'package', 'packages', 'bundle', 'plan', 'plans', 'tier', 'tiers',
    'subscription', 'membership', 'offering packages', 'price list'
  ])) {
    return botResponses.packages;
  }
  
  // Process questions
  if (matchesAny(message, [
    'process', 'how do you work', 'workflow', 'steps', 'how does it work',
    'working process', 'development process', 'project process', 'procedure',
    'how you work', 'way you work', 'approach', 'methodology'
  ])) {
    return botResponses.process;
  }
  
  // Timeline questions
  if (matchesAny(message, [
    'time', 'timeline', 'long', 'duration', 'deadline', 'deliver', 'delivery',
    'when', 'week', 'days', 'month', 'fast', 'quick', 'turnaround',
    'how soon', 'finish', 'complete', 'done', 'ready', 'launch date',
    'when can you', 'how quickly', 'timeframe', 'time frame', 'eta'
  ])) {
    return botResponses.timeline;
  }
  
  // Revision questions
  if (matchesAny(message, [
    'revision', 'revisions', 'change', 'changes', 'edit', 'edits', 'modify',
    'modification', 'update', 'updates', 'fix', 'adjust', 'tweak', 'redo',
    'not satisfied', 'dont like', 'change something', 'make changes'
  ])) {
    return botResponses.revisions;
  }
  
  // Domain questions
  if (matchesAny(message, [
    'domain', 'url', 'hosting', 'host', 'website address', 'web address',
    'domain name', 'website name', 'godaddy', 'namecheap', 'register domain'
  ])) {
    return botResponses.domain;
  }
  
  // Getting started questions
  if (matchesAny(message, [
    'get started', 'getting started', 'start', 'begin', 'how to start',
    'how can i start', 'how do i start', 'how i start', 'to start',
    'start a project', 'begin a project', 'starting', 'kick off',
    'next step', 'first step', 'hire', 'hire you', 'work with you',
    'engage you', 'book you', 'commission', 'get going', 'proceed'
  ])) {
    return botResponses.started;
  }
  
  // Contact questions
  if (matchesAny(message, [
    'contact', 'email', 'phone', 'reach', 'get in touch', 'touch',
    'talk to you', 'speak', 'call', 'connect', 'communication',
    'how to contact', 'ways to reach', 'contact info', 'contact details',
    'how can we talk', 'how to reach'
  ])) {
    return botResponses.contact;
  }
  
  // WhatsApp questions
  if (matchesAny(message, [
    'whatsapp', 'whats app', 'message you', 'text you', 'dm', 'direct message',
    'green button', 'chat with you', 'instant message', 'wa'
  ])) {
    return botResponses.whatsapp;
  }
  
  // Form questions
  if (matchesAny(message, [
    'form', 'contact form', 'fill', 'fill out', 'submit', 'send message',
    'inquiry form', 'enquiry', 'message form'
  ])) {
    return botResponses.form;
  }
  
  // Navigation questions
  if (matchesAny(message, [
    'navigate', 'navigation', 'menu', 'pages', 'where', 'find', 'go to',
    'location of', 'how to find', 'where is', 'website sections', 'sitemap'
  ])) {
    return botResponses.navigation;
  }
  
  // Technology questions
  if (matchesAny(message, [
    'tech', 'technology', 'technologies', 'stack', 'framework', 'language',
    'react', 'next', 'javascript', 'typescript', 'built with', 'tools',
    'what do you use', 'programming', 'code', 'coding', 'languages'
  ])) {
    return botResponses.technologies;
  }
  
  // Shopify questions
  if (matchesAny(message, [
    'shopify', 'ecommerce', 'e-commerce', 'online store', 'shop', 'store',
    'sell online', 'products', 'shopping cart', 'checkout', 'woocommerce',
    'selling', 'retail', 'merchandise', 'inventory'
  ])) {
    return botResponses.shopify;
  }
  
  // Redesign questions
  if (matchesAny(message, [
    'redesign', 'rebuild', 'improve', 'existing', 'already have', 'current website',
    'old website', 'makeover', 'refresh', 'update website', 'revamp', 'modernize',
    'outdated', 'new look', 'facelift', 'redo my website'
  ])) {
    return botResponses.redesign;
  }
  
  // Remote/location questions
  if (matchesAny(message, [
    'remote', 'location', 'where are you', 'based', 'egypt', 'worldwide',
    'international', 'country', 'timezone', 'time zone', 'local', 'distance',
    'work remotely', 'virtual', 'online work', 'anywhere'
  ])) {
    return botResponses.remote;
  }
  
  // Projects questions
  if (matchesAny(message, [
    'project', 'projects', 'portfolio', 'example', 'examples', 'work',
    'previous', 'past work', 'show me', 'sample', 'samples', 'case study',
    'case studies', 'showcase', 'what have you built', 'websites you made'
  ])) {
    return botResponses.projects;
  }
  
  // About questions
  if (matchesAny(message, [
    'about', 'who are you', 'who is', 'hamza', 'sokkar', 'yourself',
    'introduce', 'introduction', 'tell me about', 'bio', 'biography',
    'personal', 'developer behind', 'creator'
  ])) {
    return botResponses.about;
  }
  
  // Skills questions
  if (matchesAny(message, [
    'skill', 'skills', 'abilities', 'capable', 'expertise', 'proficient',
    'good at', 'specialize', 'specialty', 'specialization', 'competencies'
  ])) {
    return botResponses.skills;
  }
  
  // Reviews/testimonials questions
  if (matchesAny(message, [
    'review', 'reviews', 'testimonial', 'testimonials', 'feedback',
    'client', 'clients', 'rating', 'ratings', 'star', 'stars',
    'what do people say', 'recommendations', 'references'
  ])) {
    return botResponses.reviews;
  }
  
  // Thank you responses
  if (matchesAny(message, [
    'thank', 'thanks', 'thx', 'appreciate', 'grateful', 'ty', 'cheers'
  ])) {
    return "You're welcome! 😊 Is there anything else you'd like to know? I'm happy to help!";
  }
  
  // Goodbye responses
  if (matchesAny(message, [
    'bye', 'goodbye', 'see you', 'later', 'gotta go', 'leaving', 'cya'
  ])) {
    return "Goodbye! 👋 Feel free to come back anytime you have questions. Good luck with your project!";
  }
  
  // Affirmative responses
  if (/^(yes|yeah|yep|sure|ok|okay|yup|definitely|absolutely|of course)[\s!?.]*$/i.test(message.trim())) {
    return "Great! What would you like to know more about? Feel free to ask about services, pricing, experience, timeline, or anything else!";
  }
  
  // Negative responses
  if (/^(no|nope|nah|not really|im good|i am good)[\s!?.]*$/i.test(message.trim())) {
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
            className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-dark"
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
