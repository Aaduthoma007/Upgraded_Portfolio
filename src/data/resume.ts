export const personalInfo = {
  name: 'TOM GEO',
  phone: '+91 9497353492',
  email: 'tomgeo110@gmail.com',
  linkedin: 'linkedin.com/in/tom-geo',
  github: 'github.com/Aaduthoma007',
};

export const summary = `Detail-oriented Software Developer and MCA candidate with a focus on Artificial Intelligence, Computer Vision, and Cybersecurity. Experienced in building data pipelines and implementing Large Language Models (LLMs) to address analytical challenges. Committed to applying academic foundations to develop practical, secure solutions, from piracy detection tools to real-time sentiment analysis systems.`;

export const skills = {
  languages: ['Python', 'Java', 'C', 'SQL (MySQL, SQLite)', 'JavaScript', 'Bash'],
  ai: ['LLM Integration (LangChain, Gemini API)', 'NLP', 'TensorFlow', 'PyTorch', 'Scikit-learn'],
  cv: ['OpenCV', 'ImageHash', 'PIL', 'Perceptual Hashing', 'Feature Extraction'],
  web: ['Flask', 'Django', 'RESTful APIs', 'JSON', 'HTML5', 'CSS3', 'Bootstrap'],
  security: ['Wireshark', 'Nmap', 'Burp Suite', 'Git', 'GitHub', 'Docker', 'OWASP Standards'],
  data: ['NumPy', 'Pandas', 'Matplotlib', 'Chart.js', 'Data Visualization'],
};

export const coreCompetencies = [
  'Full-Stack Development',
  'Vulnerability Assessment',
  'Sentiment Analysis',
  'Computer Vision Systems',
  'Secure Coding (OWASP)',
  'Cloud Security',
];

export interface Project {
  name: string;
  subtitle: string;
  stack: string[];
  bullets: string[];
  color: string;
}

export const projects: Project[] = [
  {
    name: 'Hype Analyzer',
    subtitle: 'AI-Driven Sentiment Engine',
    stack: ['Python', 'LangChain', 'Gemini API', 'Flask'],
    bullets: [
      'Developed an AI pipeline to analyze 1,000+ real-time data points from YouTube to quantify audience sentiment.',
      'Utilized LangChain to process qualitative nuances from feedback, achieving high-accuracy sentiment scoring.',
      'Created an interactive visualization suite using Chart.js to track sentiment trends over custom timelines.',
    ],
    color: '#E8A87C',
  },
  {
    name: 'Advanced Video Piracy Detection',
    subtitle: 'Computer Vision Security System',
    stack: ['Python', 'OpenCV', 'ImageHash'],
    bullets: [
      'Built a framework utilizing Perceptual Hashing (pHash) to identify potential copyright infringements in digital media.',
      'Implemented an algorithm to identify content variations despite re-encoding, resolution changes, or watermarking.',
      'Designed an efficient database schema for similarity matching across video datasets.',
    ],
    color: '#6C9BCF',
  },
  {
    name: 'Network Analytics & WiFi Mapping',
    subtitle: 'Spatial Analytics Tool',
    stack: ['Python', 'Flask', 'JSON'],
    bullets: [
      'Created a spatial analytics tool to visualize signal-to-noise ratios and assist in network optimization.',
      'Developed a JSON-based persistence layer to manage high-frequency sampling data for network performance metrics.',
    ],
    color: '#D35F5F',
  },
];

export const experience = {
  title: 'Cybersecurity Project Intern',
  period: 'Jun 2022 – Aug 2022',
  company: 'NIELIT, Chennai',
  bullets: [
    'Conducted network security audits and penetration testing using Wireshark and Nmap to identify vulnerabilities.',
    'Audited web applications against OWASP Top 10 standards and prepared technical remediation reports.',
    'Developed a prototype for an automated vulnerability scanner to assist in security review processes.',
  ],
};

export const education = [
  {
    institution: 'Rajagiri College of Social Sciences (RCSS)',
    degree: 'Master of Computer Applications (MCA)',
    period: '2025 – Present',
    location: 'Kochi, India',
  },
  {
    institution: 'Kristu Jayanti College (KJC)',
    degree: 'Bachelor of Computer Applications (BCA)',
    period: '2022 – 2025',
    location: 'Bengaluru, India',
  },
];

export const certifications = [
  'The Joy of Computing Using Python – IIT Madras',
  'Cloud Security Fundamentals – Palo Alto Networks Academy',
  'Database Management Systems – IIT Kharagpur',
];

export const githubStats = {
  username: 'Aaduthoma007',
  languages: { Python: 40, Java: 25, C: 15, JavaScript: 12, Other: 8 } as Record<string, number>,
  totalCommits: 150,
  topRepos: ['Hype-Analyzer', 'Video-Piracy-Detection', 'WiFi-Mapping'],
};
