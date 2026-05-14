const timeline = {
  education: {
    tag: 'Education + communication',
    title: 'I started with teaching, structure, and clear explanation.',
    body: 'LinkedIn lists a Bachelor of Education from the University of KwaZulu-Natal. That foundation shows up in how I break down interfaces, write helpful UX copy, and explain technical choices.',
    skills: ['Lesson design', 'Research', 'Communication', 'Problem framing'],
  },
  data: {
    tag: 'Analytics + business clarity',
    title: 'I added data literacy so decisions feel grounded.',
    body: 'LinkedIn highlights Google Data Analytics and Microsoft Power BI learning. That gives the portfolio a stronger evidence layer: dashboards, metrics, patterns, and reporting.',
    skills: ['Google Data Analytics', 'Power BI', 'SQL thinking', 'Data storytelling'],
  },
  web: {
    tag: 'Frontend + UX',
    title: 'I moved into interfaces that are expressive and useful.',
    body: 'Meta Programming with JavaScript and UX-focused work connect the visual side of the portfolio with actual interaction, validation, and responsive design.',
    skills: ['HTML', 'CSS', 'JavaScript', 'Responsive UI', 'UX writing'],
  },
  fullstack: {
    tag: 'Full-stack JavaScript',
    title: 'I pushed into backend logic, DevOps, and delivery workflows.',
    body: 'The current portfolio highlights the IBM Full-Stack JavaScript Developer Professional Certificate, including Node, Express, React, GitHub, containers, microservices, and capstone delivery.',
    skills: ['Node.js', 'Express', 'React', 'GitHub', 'Docker', 'Kubernetes'],
  },
  client: {
    tag: 'Client-ready builds',
    title: 'The new work shows practical product thinking.',
    body: 'Recent builds include Vercel product concepts, a fishing companion, client website work, and testing assignments. They show range without losing the thread: make the work useful.',
    skills: ['Product concepts', 'Static sites', 'Testing', 'Documentation'],
  },
};

const root = document.documentElement;
const themeToggle = document.querySelector('[data-theme-toggle]');
const savedTheme = localStorage.getItem('portfolio-theme');
const preferredDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const initialTheme = savedTheme || (preferredDark ? 'dark' : 'light');

function setTheme(theme) {
  root.dataset.theme = theme;
  localStorage.setItem('portfolio-theme', theme);
  if (themeToggle) {
    themeToggle.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
    themeToggle.querySelector('span').textContent = theme === 'dark' ? '\u263c' : '\u25cf';
  }
}

setTheme(initialTheme);

themeToggle?.addEventListener('click', () => {
  setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark');
});

const logs = [
  {
    title: 'Turned a portfolio into a proof dashboard',
    type: 'Design choice',
    before: 'Project cards were easy to skim past.',
    after: 'Proof metrics, filters, logs, and demo paths tell employers what each build proves.',
  },
  {
    title: 'Added employer pain-point sorting',
    type: 'UX decision',
    before: 'Projects were grouped by topic.',
    after: 'Work is grouped by problems: improve UX, automate work, make data useful, scale systems, polish products.',
  },
  {
    title: 'Connected achievements to sourceable signals',
    type: 'Content system',
    before: 'Certifications were present but scattered.',
    after: 'LinkedIn and portfolio achievements are translated into recruiter-friendly capability evidence.',
  },
  {
    title: 'Made new builds feel inspectable',
    type: 'Delivery',
    before: 'Recent local projects lived as separate folders.',
    after: 'The demo lab names each build, its problem, tools, and likely employer takeaway.',
  },
];

const certificateImages = [
  {
    title: 'Bachelor of Education',
    issuer: 'University of KwaZulu-Natal',
    type: 'Degree',
    image: 'assets/certificates/ukzn-degree.jpg',
  },
  {
    title: 'IBM Full-Stack JavaScript Developer Professional Certificate',
    issuer: 'IBM via Coursera',
    type: 'Full stack',
    image: 'assets/certificates/coursera-ibm-full-stack-javascript.jpg',
  },
  {
    title: 'SAP Technology Consultant Professional Certificate',
    issuer: 'SAP via Coursera',
    type: 'Enterprise systems',
    image: 'assets/certificates/coursera-sap-technology-consultant.jpg',
  },
  {
    title: 'Getting Started with Git and GitHub',
    issuer: 'IBM via Coursera',
    type: 'Web development',
    image: 'assets/certificates/ibm-git-github.jpg',
  },
  {
    title: 'Introduction to Software Engineering',
    issuer: 'IBM via Coursera',
    type: 'Software engineering',
    image: 'assets/certificates/ibm-software-engineering.jpg',
  },
  {
    title: 'Version Control',
    issuer: 'Meta via Coursera',
    type: 'Web development',
    image: 'assets/certificates/meta-version-control.jpg',
  },
  {
    title: 'React Basics',
    issuer: 'Meta via Coursera',
    type: 'Frontend',
    image: 'assets/certificates/meta-react-basics.jpg',
  },
  {
    title: 'Google Project Management Professional Certificate',
    issuer: 'Google via Coursera',
    type: 'Career',
    image: 'assets/certificates/coursera-google-project-management.jpg',
  },
  {
    title: 'Google UX Design Professional Certificate',
    issuer: 'Google via Coursera',
    type: 'UX',
    image: 'assets/certificates/coursera-google-ux-design.jpg',
  },
  {
    title: 'Software Testing and Automation Specialization',
    issuer: 'University of Minnesota via Coursera',
    type: 'Testing',
    image: 'assets/certificates/coursera-software-testing-automation.jpg',
  },
  {
    title: 'Web and Mobile Testing with Selenium',
    issuer: 'University of Minnesota via Coursera',
    type: 'Testing',
    image: 'assets/certificates/coursera-web-mobile-testing-selenium.jpg',
  },
  {
    title: 'Business Foundations Specialization',
    issuer: 'Wharton via Coursera',
    type: 'Business',
    image: 'assets/certificates/coursera-wharton-business-foundations.jpg',
  },
  {
    title: 'Data Analysis and Visualization with Power BI',
    issuer: 'Microsoft via Coursera',
    type: 'Data',
    image: 'assets/certificates/power-bi-visualization.jpg',
  },
  {
    title: 'Data Modeling in Power BI',
    issuer: 'Microsoft via Coursera',
    type: 'Data',
    image: 'assets/certificates/power-bi-data-modeling.jpg',
  },
  {
    title: 'Deploy and Maintain Power BI Assets and Capstone Project',
    issuer: 'Microsoft via Coursera',
    type: 'Data',
    image: 'assets/certificates/power-bi-assets-capstone.jpg',
  },
  {
    title: 'Microsoft PL-300 Exam Preparation and Practice',
    issuer: 'Microsoft via Coursera',
    type: 'Career',
    image: 'assets/certificates/pl-300-exam-prep.jpg',
  },
  {
    title: 'Microsoft Power BI Data Analyst Professional Certificate',
    issuer: 'Microsoft via Coursera',
    type: 'Data',
    image: 'assets/certificates/microsoft-power-bi-data-analyst.jpg',
  },
  {
    title: 'Google Data Analytics Professional Certificate',
    issuer: 'Google via Coursera',
    type: 'Data',
    image: 'assets/certificates/google-data-analytics.jpg',
  },
  {
    title: 'Process Data from Dirty to Clean',
    issuer: 'Google via Coursera',
    type: 'Data',
    image: 'assets/certificates/process-data-dirty-clean.jpg',
  },
  {
    title: 'Microsoft Power BI Data Analyst',
    issuer: 'Microsoft via Coursera',
    type: 'Data',
    image: 'assets/certificates/microsoft-power-bi-data-analyst-2.jpg',
  },
];

const credlyBadges = [
  {
    name: 'Application Development using Microservices and Serverless',
    issuer: 'Coursera',
    issued: '2026-04-18',
    image: 'https://images.credly.com/images/eaaf4a45-b93e-41d1-91d3-d331c6210314/image.png',
    url: 'https://www.credly.com/badges/fb005fab-9e7b-4e75-9ae0-2474275b3ce0',
  },
  {
    name: 'IBM Full-Stack JavaScript Developer Professional Certificate',
    issuer: 'Coursera',
    issued: '2026-04-14',
    image: 'https://images.credly.com/images/ff8f2956-43b1-47d1-abba-1db32724b24b/image.png',
    url: 'https://www.credly.com/badges/1b1bd0de-d49e-47f2-83c2-3923e6749e3a',
  },
  {
    name: 'JavaScript Full Stack Capstone Project',
    issuer: 'Coursera',
    issued: '2026-04-14',
    image: 'https://images.credly.com/images/b5229d48-ca57-43b8-8a97-52c200320fcd/image.png',
    url: 'https://www.credly.com/badges/21162983-2423-43c1-af60-50fa4e0d5826',
  },
  {
    name: 'Software Developer Career Guide and Interview Preparation',
    issuer: 'Coursera',
    issued: '2026-04-12',
    image: 'https://images.credly.com/images/8647d8b6-2e29-4a88-bfb8-d5ba41ab5716/image.png',
    url: 'https://www.credly.com/badges/0c5b71ff-d6ff-4720-9c39-ba1fcd633dc1',
  },
  {
    name: 'Google Project Management Professional Certificate(v.3)',
    issuer: 'Coursera',
    issued: '2026-04-10',
    image: 'https://images.credly.com/images/68508264-ec6e-47cf-a8c1-94d86f2573fb/blob',
    url: 'https://www.credly.com/badges/4deba709-c033-4adf-88ce-0dd275d24391',
  },
  {
    name: 'Containers & Kubernetes Essentials',
    issuer: 'Coursera',
    issued: '2026-03-31',
    image: 'https://images.credly.com/images/fadae326-142d-4855-a42f-f0b07e65eac1/image.png',
    url: 'https://www.credly.com/badges/d8e3b3e2-8bcf-40e5-9e5d-125e74c18e48',
  },
  {
    name: 'Cloud Native, DevOps, Agile & NoSQL Essentials',
    issuer: 'Coursera',
    issued: '2026-03-20',
    image: 'https://images.credly.com/images/0180c9c4-1723-4e5d-b38e-c439cd445130/image.png',
    url: 'https://www.credly.com/badges/59367f8f-0e93-4d39-bcb2-dd67109ea0bf',
  },
  {
    name: 'Node and Express Essentials',
    issuer: 'Coursera',
    issued: '2026-03-11',
    image: 'https://images.credly.com/images/43eabfbc-06d4-4633-9be0-0f56cfbdb607/image.png',
    url: 'https://www.credly.com/badges/812dc540-f3c4-4456-abba-67307bed8c50',
  },
  {
    name: 'JavaScript Programming Essentials',
    issuer: 'Coursera',
    issued: '2026-03-01',
    image: 'https://images.credly.com/images/899a5963-d3c7-45ee-a16c-4827cf24e836/image.png',
    url: 'https://www.credly.com/badges/bd737fe9-d24d-4c46-8593-797b3c8341e7',
  },
  {
    name: 'Software Engineering Essentials',
    issuer: 'Coursera',
    issued: '2026-02-22',
    image: 'https://images.credly.com/images/1b67aaf9-670d-4c92-8d51-7ac1190f0a42/image.png',
    url: 'https://www.credly.com/badges/ab64f825-b2f6-4b1f-b854-6a48284e18ee',
  },
  {
    name: 'Google Data Analytics Professional Certificate (v2)',
    issuer: 'Coursera',
    issued: '2025-12-07',
    image: 'https://images.credly.com/images/88c25fa4-9007-42cc-b9c5-16441a878507/GCC_badge_DA_1000x1000.png',
    url: 'https://www.credly.com/badges/0c5a6d0b-aa77-4db9-b146-79c1c7cc5ed2',
  },
];

const resumeItems = [
  {
    title: 'Frontend development',
    category: ['frontend', 'ux'],
    detail: 'Responsive interfaces, visual hierarchy, theme systems, validation, and interaction states.',
    proof: 'Nova Bite, TaskForge, AuraFit, Carbon Crumbs, Deductomatic, Normal Is Overrated, Travel Recommendations, new client website builds.',
  },
  {
    title: 'Full-stack JavaScript growth',
    category: ['fullstack', 'frontend'],
    detail: 'IBM pathway covering React, Node.js, Express, GitHub, DevOps, NoSQL, containers, and capstone delivery.',
    proof: 'IBM Full-Stack JavaScript Developer certificate highlighted in the portfolio.',
  },
  {
    title: 'Data and reporting',
    category: ['data'],
    detail: 'Analytics mindset with Google Data Analytics and Microsoft Power BI certification signals from LinkedIn.',
    proof: 'Data cleaning, insight communication, dashboard thinking, and evidence-led portfolio copy.',
  },
  {
    title: 'UX and communication',
    category: ['ux', 'client'],
    detail: 'Education background supports clear explanation, accessible language, and user-centred flows.',
    proof: 'Mind Check, Normal Is Overrated, community portal content structures.',
  },
  {
    title: 'Enterprise awareness',
    category: ['client', 'fullstack'],
    detail: 'LinkedIn lists SAP experience; portfolio maps this into systems thinking and delivery awareness.',
    proof: 'SAP fundamentals, solution thinking, stakeholder-aware documentation.',
  },
  {
    title: 'Client-ready delivery',
    category: ['client', 'frontend'],
    detail: 'Recent builds show product concepts, business-facing pages, planning dashboards, and polished static app delivery.',
    proof: 'Nova Bite, TaskForge, AuraFit, Codies Catch Compass, Jens Interior Decor.',
  },
];

const problems = [
  {
    label: 'Improve UX',
    title: 'Make complex experiences feel calm',
    examples: ['AuraFit', 'Normal Is Overrated', 'Travel Recommendations'],
  },
  {
    label: 'Automate manual work',
    title: 'Reduce friction with structured flows',
    examples: ['TaskForge', 'Deductomatic', 'Testing assignments'],
  },
  {
    label: 'Make data useful',
    title: 'Translate numbers into decisions',
    examples: ['Google Data Analytics', 'Power BI', 'Deductomatic', 'Carbon Crumbs'],
  },
  {
    label: 'Scale backend thinking',
    title: 'Understand more than the screen',
    examples: ['IBM full-stack pathway', 'Node and Express', 'Microservices and containers'],
  },
  {
    label: 'Polish product',
    title: 'Give work the finish employers notice',
    examples: ['Nova Bite', 'Codies Catch Compass', 'Jens Interior Decor', 'Portfolio rebuild'],
  },
];

const builds = [
  {
    name: 'Nova Bite',
    status: 'Published build',
    tags: ['Restaurant', 'Reservation UX', 'Product polish'],
    problem: 'Present a fine-dining concept with menu discovery, reservation intent, and a polished first impression.',
    link: 'https://cosmicbubblegumgirl.github.io/Nova-bite/',
    visual: 'interior',
    screenshot: 'assets/project-screenshots/nova-bite.png',
  },
  {
    name: 'TaskForge',
    status: 'Published build',
    tags: ['SaaS', 'Planning', 'Workflow'],
    problem: 'Show how project planning, sprint health, and task movement can feel organised and employer-ready.',
    link: 'https://taskforge-rosy.vercel.app/',
    visual: 'portal',
    screenshot: 'assets/project-screenshots/taskforge.png',
  },
  {
    name: 'VaultPay',
    status: 'Published build',
    tags: ['Fintech', 'Dashboard', 'Trust UX'],
    problem: 'Present a polished fintech interface with analytics, account controls, and a sharper sense of product credibility.',
    link: 'https://vaultpay-eta.vercel.app/',
    visual: 'calc',
    screenshot: 'assets/project-screenshots/vaultpay.png',
  },
  {
    name: 'AuraFit',
    status: 'Published build',
    tags: ['AI fitness', 'Wellbeing', 'Dashboard'],
    problem: 'Frame adaptive fitness planning with a modern product interface and clear user progress signals.',
    link: 'https://aurafit-pink.vercel.app/',
    visual: 'phone',
    screenshot: 'assets/project-screenshots/aurafit.png',
  },
  {
    name: 'Mind Check',
    status: 'Published build',
    tags: ['Wellbeing', 'Reflection UX', 'Vercel'],
    problem: 'Create a focused mental-wellbeing check-in experience with a calm interface and clear emotional flow.',
    link: 'https://mind-check-swart.vercel.app/',
    visual: 'leaf',
    screenshot: 'assets/project-screenshots/mind-check.png',
  },
  {
    name: 'Codies Catch Compass',
    status: 'New build',
    tags: ['Fishing companion', 'Static app', 'Local UX'],
    problem: 'Help Ramsgate Beach anglers quickly orient around tides, conditions, and fishing decisions.',
    link: 'https://codies-catch-compass.vercel.app/#home',
    visual: 'map',
    screenshot: 'assets/project-screenshots/codies-catch-compass.png',
  },
  {
    name: 'Jens Interior Decor & Construction',
    status: 'New build',
    tags: ['Client website', 'Services', 'Portfolio'],
    problem: 'Present a construction and decor business with stronger service hierarchy and visual confidence.',
    link: '/projects/jens-interior-decor-construction/',
    visual: 'interior',
    screenshot: 'assets/project-screenshots/jens-interior.png',
  },
  {
    name: 'Deductomatic',
    status: 'Published build',
    tags: ['Tax calculator', 'Finance UX', 'JavaScript'],
    problem: 'Make South African tax and budgeting calculations less intimidating.',
    link: 'https://cosmicbubblegumgirl.github.io/deductomatic/',
    visual: 'calc',
    screenshot: 'assets/project-screenshots/deductomatic.png',
  },
  {
    name: 'Carbon Crumbs',
    status: 'Published build',
    tags: ['Sustainability', 'Local storage', 'Insights'],
    problem: 'Make carbon awareness gentle, visual, and habit-friendly.',
    link: 'https://cosmicbubblegumgirl.github.io/carbon-crumbs/',
    visual: 'leaf',
    screenshot: 'assets/project-screenshots/carbon-crumbs.png',
  },
  {
    name: 'Normal Is Overrated',
    status: 'Published build',
    tags: ['Inclusive UX', 'Identity', 'Frontend'],
    problem: 'Create a bold, supportive web experience that makes individuality feel intentional and welcome.',
    link: 'https://cosmicbubblegumgirl.github.io/normal_is-_overrated/',
    visual: 'portal',
    screenshot: 'assets/project-screenshots/normal-is-overrated.png',
  },
  {
    name: 'Travel Recommendations',
    status: 'Published build',
    tags: ['Discovery UX', 'Travel', 'JavaScript'],
    problem: 'Help visitors explore destinations with a simple recommendation experience and clear visual hierarchy.',
    link: 'https://cosmicbubblegumgirl.github.io/travel_recommendations/',
    visual: 'route',
    screenshot: 'assets/project-screenshots/travel-recommendations.png',
  },
];

const timelineButtons = document.querySelectorAll('.timeline-item');
const timelineTag = document.querySelector('#timelineTag');
const timelineTitle = document.querySelector('#timelineTitle');
const timelineBody = document.querySelector('#timelineBody');
const timelineSkills = document.querySelector('#timelineSkills');

function renderTimeline(key) {
  const item = timeline[key];
  timelineTag.textContent = item.tag;
  timelineTitle.textContent = item.title;
  timelineBody.textContent = item.body;
  timelineSkills.innerHTML = item.skills.map((skill) => `<li>${skill}</li>`).join('');
}

timelineButtons.forEach((button) => {
  button.addEventListener('click', () => {
    timelineButtons.forEach((item) => {
      item.classList.remove('active');
      item.setAttribute('aria-selected', 'false');
    });
    button.classList.add('active');
    button.setAttribute('aria-selected', 'true');
    renderTimeline(button.dataset.timeline);
  });
});

function renderLogs() {
  document.querySelector('#logBoard').innerHTML = logs.map((log) => `
    <article class="log-card">
      <span>${log.type}</span>
      <h3>${log.title}</h3>
      <dl>
        <dt>Before</dt>
        <dd>${log.before}</dd>
        <dt>After</dt>
        <dd>${log.after}</dd>
      </dl>
    </article>
  `).join('');
}

function renderAchievements() {
  document.querySelector('#achievementGrid').innerHTML = certificateImages.map((certificate) => `
    <a class="achievement-card certificate-card" href="${certificate.image}" target="_blank" rel="noreferrer">
      <div class="certificate-image">
        <img src="${certificate.image}" alt="${certificate.title} certificate" loading="lazy" />
      </div>
      <span>${certificate.type}</span>
      <h3>${certificate.title}</h3>
      <p>${certificate.issuer}</p>
    </a>
  `).join('');
}

function renderCredlyBadges() {
  document.querySelector('#credlyGrid').innerHTML = credlyBadges.map((badge) => `
    <a class="credly-card" href="${badge.url}" target="_blank" rel="noreferrer">
      <img src="${badge.image}" alt="${badge.name} badge" loading="lazy" />
      <span>${badge.issued}</span>
      <h3>${badge.name}</h3>
      <p>${badge.issuer}</p>
    </a>
  `).join('');
}

function renderResume(filter = 'all') {
  const filtered = filter === 'all'
    ? resumeItems
    : resumeItems.filter((item) => item.category.includes(filter));

  document.querySelector('#resumeGrid').innerHTML = filtered.map((item) => `
    <article class="resume-card">
      <h3>${item.title}</h3>
      <p>${item.detail}</p>
      <strong>${item.proof}</strong>
    </article>
  `).join('');
}

document.querySelectorAll('.filter').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.filter').forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
    renderResume(button.dataset.filter);
  });
});

function renderProblems() {
  document.querySelector('#problemGrid').innerHTML = problems.map((problem) => `
    <article class="problem-card">
      <span>${problem.label}</span>
      <h3>${problem.title}</h3>
      <p>${problem.examples.join(' / ')}</p>
    </article>
  `).join('');
}

function renderBuilds() {
  document.querySelector('#labGrid').innerHTML = builds.map((build) => `
    <article class="build-card">
      ${build.screenshot ? `
        <a class="build-screenshot" href="${build.link}" target="_blank" rel="noreferrer" aria-label="Open ${build.name}">
          <img src="${build.screenshot}" alt="${build.name} website screenshot" loading="lazy" />
        </a>
      ` : `
        <div class="demo-visual ${build.visual}" aria-hidden="true">
          <span></span><span></span><span></span>
        </div>
      `}
      <div class="build-body">
        <div class="build-meta">
          <span>${build.status}</span>
          <small>${build.tags.join(' / ')}</small>
        </div>
        <h3>${build.name}</h3>
        <p>${build.problem}</p>
        <a href="${build.link}" target="_blank" rel="noreferrer">Open project</a>
      </div>
    </article>
  `).join('');
}

renderTimeline('education');
renderLogs();
renderAchievements();
renderCredlyBadges();
renderResume();
renderProblems();
renderBuilds();
