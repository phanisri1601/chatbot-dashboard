import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI('AIzaSyAtrdc-OEh5dO8KRPG3yoXuDW7iYzo4hLk');

// Tuned generation config for concise, high-signal answers
const generationConfig = {
  temperature: 0.7,
  topP: 0.9,
  topK: 40,
  maxOutputTokens: 180
};

// Test if the API key is working
const testAPIKey = async () => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro", generationConfig });
    const result = await model.generateContent("Hello");
    console.log('API Key test successful');
    return true;
  } catch (error) {
    console.error('API Key test failed:', error);
    return false;
  }
};

// Test the API key on import
testAPIKey();

// Company information context from imsolutions_content.json
const companyContext = `
You are a customer service representative for IM Solutions, a full-service advertising and digital agency based in Bengaluru, India.

COMPANY DETAILS:
- Company: IM Solutions
- Founded: 2013
- Type: Full-service advertising and digital agency
- Team Size: 50+ members
- Offices: Bengaluru (Corporate), Alwar, Surat

COMPREHENSIVE SERVICES:
ONLINE SERVICES: Digital Marketing Services, Search Engine Optimization (SEO), Search Engine Marketing (SEM), Social Media Optimization, Social Media Marketing, Website Design & Development, Software Design & Development, Geolocation Analytical SMS, Creative Designing, API Integration, E-commerce Solutions, Email Marketing, Mobile Application Development, Real Estate Online Marketing, Display Advertisement, Blog Articles, Classified Portal Management, Press Releases Services.

OFFLINE SERVICES: Bus Branding, RWA Activation, BTL Advertising, Mall & Multiplex Advertising, Tech Park Advertising, Airport Advertising, Paper Insertion, Cafe/Gym/Supermarket Advertising, ATM Advertising, Auto Rickshaw Advertising, Magazine Advertising, Parking Lot Advertising, Branding & Re-Branding, Corporate Gifts, Corporate Training, Event Management, FM Campaigns, Fabrications, Hoarding Services, Marketing Collaterals, Start-up Marketing, Photographic Services, PR Services, Printing Services, Retail Advertising, Real Estate Videography, Signage, Washroom Advertising.

CONTACT INFORMATION:
- Corporate Office: 921, Laxmi Tower, 4th Floor, 5th Main Rd, Sector 7, HSR Layout, Bengaluru, Karnataka 560102
- Phone: +91-8880564488
- Email: info@imsolutions.mobi
- Branch Offices: Alwar (214, South West Block, Near Ram Mandir, Alwar, Rajasthan), Surat (219, Nilkanth Plaza, Near Kiran Chowk, Varachha Road, Surat, Gujarat 395010)

COMPANY JOURNEY:
- 2013: Founded with a team of 6 experts
- 2014: Expanded into BTL activities
- 2015: Reached 70+ team members
- 2016: Achieved 10,000+ happy customers
- 2017: Expanded operations and automated processes
- 2018: Formed strategic tie-ups
- 2019: Continued growth and innovation

VISION: To be the best advertising company in the world by providing innovative and pertinent advertising solutions that help businesses reach their highest potential.

MISSION:
- Create stunning ads to inspire and impact viewers
- Develop effective marketing strategies for measurable results
- Provide the best advertising solutions for brands
- Build collaborations and client network for business excellence
- Make a lasting impression in the advertising world

CORE PRINCIPLES:
- Strategy: We define clear paths to accomplish set goals
- Creativity: We help businesses stand apart through innovative solutions
- Technology: We utilize the latest technology to design and implement solutions

VALUES: Client-centric approach, high quality standards, flexibility and reliability, customizable solutions, competitive edge with latest trends.

CAREER OPPORTUNITIES: Vice President – Corporate Sales, Visual Content Creator, Business Development Manager, SEO Executive, Social Media Marketing, Web Design and Development, Content Writing, Graphic and Web Designing, Digital Marketing Manager, HR Executive.

IMPORTANT: When users ask about IM Solutions, provide specific, detailed information from the above context. Be conversational but informative. Always represent IM Solutions professionally and accurately.
`;

// Closing line appended to helpful replies (concise)
const closingLine = "Anything else I can help with?";
const withClosing = (text) => `${text} ${closingLine}`;

export const generateAIResponse = async (userInput) => {
  // First, try to use the AI API with intent-aware prompting
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro", generationConfig });

    const lower = userInput.toLowerCase().trim();
    const greetingSmallTalkRegex = /(\bhi+\b|\bhello+\b|\bhey+\b|\bthanks\b|\bthank you\b|\bok\b|\bokay\b|\bcool\b|\bnice\b|\bgreat\b|\bawesome\b|good\s*(morning|afternoon|evening))/i;
    const isGreetingSmallTalk = greetingSmallTalkRegex.test(userInput) || lower.length <= 2;

    const imKeywords = [
      'im solutions','imsolutions','advertising','digital marketing','seo','sem','website',
      'branding','btl','event','corporate training','bus branding','airport','mall',
      'tech park','real estate','social media','creative','api integration','e-commerce',
      'mobile app','press releases','blog','display','email marketing','bengaluru','alwar',
      'surat','india','2013','journey','team','vision','mission','appointment','pricing','quote'
    ];
    const isRelatedToIM = imKeywords.some(k => lower.includes(k));

    if (isGreetingSmallTalk) {
      const prompt = `STYLE GUIDE\n- Voice: warm, confident, concise.\n- Length: 1 sentence (<= 25 words).\n- Offer: present 2–3 next options using • separators.\n\nTASK\nYou are IM Solutions' friendly assistant. Greet and invite them to ask about services, pricing, booking, or company info. No limitations text.

User: "${userInput}"`;
      const result = await model.generateContent(prompt);
      return withClosing((await result.response).text());
    }

    if (isRelatedToIM) {
      const prompt = `${companyContext}

User Message: "${userInput}"

STYLE GUIDE\n- Length: 1–2 short sentences.\n- Content: only the most important benefit or answer; if listing, use up to 3 items separated by • (no long lists).\n- CTA: end with a simple, action-oriented question.\n- Interpretation: handle typos, shorthand, and incomplete phrasing by inferring likely intent. If still unclear, ask ONE brief clarifying question and suggest up to 3 options using •.\n\nProvide a helpful, professional response grounded in the above IM Solutions context. If they ask about services/pricing/contact, suggest the lead form. If they want to schedule, suggest using the Book Appointment button.`;
      const result = await model.generateContent(prompt);
      return withClosing((await result.response).text());
    }

    // Unrelated query → smart, friendly deflection (concise) that pivots back to IM Solutions
    const prompt = `STYLE GUIDE\n- Tone: friendly, nimble, positive.\n- Length: 1–2 short sentences.\n\nROLE\nYou are IM Solutions' assistant. The user's message may be unrelated or poorly phrased: "${userInput}".\nTASK\n1) First, try to infer if it maps to an IM Solutions topic (services, pricing, booking, company info) despite typos or shorthand.\n2) If you can map it, provide a concise IM Solutions answer (key point only) and end with a short CTA.\n3) If you cannot map it, acknowledge briefly and gently pivot with a friendly deflection AND one clarifying question, offering up to 3 IM topics using •.\nConstraints: Do not sound restrictive or dismissive. Do not imply web browsing or give facts outside IM Solutions.\n\nWrite a clever, friendly reply that:
- Acknowledges their topic without giving facts/advice beyond IM Solutions
- Gently deflects and pivots back to what you can help with: IM Solutions services, pricing, booking appointments, or company information
- Uses a light, positive framing to keep the conversation warm
- Ends with a simple IM Solutions–focused question
Avoid sounding restrictive or dismissive; keep it conversational. Do not imply web browsing or make external claims.`;
    const result = await model.generateContent(prompt);
    return withClosing((await result.response).text());
  } catch (error) {
    console.error('AI API failed, using fallback responses:', error);
    return generateFallbackResponse(userInput);
  }
};

// Intelligent fallback system using company information
const generateFallbackResponse = (userInput) => {
  const lowerInput = userInput.toLowerCase();
  
  // Small talk/greetings → friendly conversation
  if (lowerInput.includes('hello') || lowerInput.includes('hi') || lowerInput.includes('hey') || lowerInput === '' ) {
    return withClosing("Hi! I'm IM Solutions' assistant. How can I help — services, pricing, appointments, or company info?");
  } else if (lowerInput.includes('journey') || lowerInput.includes('history') || lowerInput.includes('story') || lowerInput.includes('founded')) {
    return withClosing("Founded in 2013, we’ve grown to 50+ experts and 10k+ customers, with offices in Bengaluru (HQ), Alwar, and Surat.");
  } else if (lowerInput.includes('services') || lowerInput.includes('what do you do') || lowerInput.includes('offer')) {
    return withClosing("We cover digital marketing (SEO/SEM/Social), web/app development, branding, and offline advertising. Which area interests you?");
  } else if (lowerInput.includes('pricing') || lowerInput.includes('cost') || lowerInput.includes('price') || lowerInput.includes('quote')) {
    return withClosing("Pricing depends on scope. Want me to capture a few details to prepare an accurate quote?");
  } else if (lowerInput.includes('contact') || lowerInput.includes('speak') || lowerInput.includes('call') || lowerInput.includes('reach')) {
    return withClosing("I can connect you with our team or capture your details now. You can also email info@imsolutions.mobi or call +91-8880564488.");
  } else if (lowerInput.includes('appointment') || lowerInput.includes('schedule') || lowerInput.includes('book') || lowerInput.includes('meeting') || lowerInput.includes('consultation')) {
    return withClosing("To schedule, click the ‘Book Appointment’ button below and pick your date/time.");
  } else if (lowerInput.includes('location') || lowerInput.includes('where') || lowerInput.includes('office')) {
    return withClosing("Offices: Bengaluru (HQ), Alwar, and Surat. Want the address details?");
  } else if (lowerInput.includes('experience') || lowerInput.includes('years') || lowerInput.includes('team') || lowerInput.includes('people') || lowerInput.includes('staff')) {
    return withClosing("Team of 50+ specialists; 10k+ customers served since 2013 across Bengaluru, Alwar, and Surat.");
  } else if (lowerInput.includes('vision') || lowerInput.includes('mission') || lowerInput.includes('goals')) {
    return withClosing("Vision: deliver innovative advertising that drives growth. Mission: creative, measurable marketing solutions.");
  } else if (lowerInput.includes('career') || lowerInput.includes('job') || lowerInput.includes('work') || lowerInput.includes('opportunities')) {
    return withClosing("We hire across sales, marketing, design, and development. Interested in a role? I can share details.");
  } else {
    // Unrelated/other → friendly redirect (concise)
    return withClosing("I focus on IM Solutions. I can help with services, pricing, appointments, or company info. What would you like to explore?");
  }
};
