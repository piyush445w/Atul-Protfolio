/**
 * ATUL KUMAR YADAV - Premium 3D Environment Artist Portfolio
 * Main Application Controller
 * 
 * @version 1.0.0
 * @author Atul Kumar Yadav
 * @description Production-ready portfolio app with API-driven content, 
 *              animations, and premium UX
 */

// ============================================================================
// CONFIGURATION & CONSTANTS
// ============================================================================

const CONFIG = {
  API_BASE: '',
  ENDPOINTS: {
    SETTINGS: '/api/settings',
    PROJECTS: '/api/projects',
    CATEGORIES: '/api/categories',
    SOFTWARE: '/api/software',
  },
  POLL_INTERVAL: 30000,
  LOADER_TIMEOUT: 5000,
  PARTICLE_COUNT: 80,
  CURSOR_SIZE: 8,
  CURSOR_DOT_SIZE: 4,
  SCROLL_OFFSET: 80,
  DEBOUNCE_DELAY: 150,
  ANIMATION_DURATION: 600,
  STAGGER_DELAY: 100,
};

// ============================================================================
// STATE MANAGEMENT
// ============================================================================

const state = {
  settings: null,
  projects: [],
  categories: [],
  software: [],
  activeCategory: 'all',
  activeProjectId: null,
  isMobileMenuOpen: false,
  isTouchDevice: false,
  isLoading: true,
  scrollY: 0,
  mouseX: 0,
  mouseY: 0,
  rafId: null,
  particleRafId: null,
};

// ============================================================================
// DOM ELEMENT CACHE
// ============================================================================

let dom = {};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

function scrollToElement(selector, offset = CONFIG.SCROLL_OFFSET) {
  const element = document.querySelector(selector);
  if (!element) return;
  const elementPosition = element.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.pageYOffset - offset;
  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth',
  });
}

function isInViewport(element, threshold = 0.15) {
  if (!element) return false;
  const rect = element.getBoundingClientRect();
  return (
    rect.top <= (window.innerHeight || document.documentElement.clientHeight) * (1 - threshold)
  );
}

function generateId() {
  return `${Date.now()}-`;
}

function clamp(num, min, max) {
  return Math.min(Math.max(num, min), max);
}

function lerp(start, end, factor) {
  return start + (end - start) * factor;
}

function mapRange(value, inMin, inMax, outMin, outMax) {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function isTouchDevice() {
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0
  );
}

function getCurrentYear() {
  return new Date().getFullYear().toString();
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// ============================================================================
// FALLBACK DATA
// ============================================================================

function getFallbackSettings() {
  return {
    name: 'Atul Kumar Yadav',
    title: '3D Environment Artist',
    subtitle: 'Unreal Engine 5 • Environment Art • 3D Modeling • Texturing • Lighting',
    bio: 'I am a 3D Environment Artist specializing in modeling, texturing, and lighting for game and animation environments, with a Diploma in 3D Animation from MAAC.',
    heroMedia: null,
    email: '',
    phone: '',
    location: 'Ludhiana, Punjab, India',
    linkedin: 'https://www.linkedin.com/in/atulkumaryadav',
    artstation: 'https://www.artstation.com/atulkumar62',
    skills: [
      'Environment Art', 'Environment Modeling', 'Level Design', 'Scene Assembly',
      'Modular Environment Creation', '3D Modeling', 'Hard Surface Modeling',
      'Asset Creation', 'Sculpting', 'Texturing', 'PBR Texturing',
      'Material Creation', 'Surface Detailing', 'Lighting', 'Real-Time Lighting',
      'Mood & Atmosphere', 'Cinematic Lighting', 'Unreal Engine 5', 'Blueprints',
      'Environment Setup', 'VR Environment Development'
    ],
    awards: [
      {
        event: 'Punjab Animation Award',
        achievement: 'Jury Winner — 3D Environment Art',
        date: 'April 2025',
        description: 'Awarded Jury Winner for 3D Environment Art at Punjab Animation Award, MAAC. Created a detailed 3D environment focusing on modeling, texturing and lighting.',
        software: ['Maya', '3ds Max', 'ZBrush', 'Marvelous Designer', 'Substance Painter']
      },
      {
        event: '24FPS International Award',
        achievement: 'Nominee — 3D Character Modeling & Texturing',
        date: 'December 2025',
        description: 'Nominated for 3D Character Modeling & Texturing at 24FPS International Award, MAAC. Modeled and textured a character asset with attention to detail.',
        software: ['Maya', '3ds Max', 'ZBrush', 'Marvelous Designer', 'Substance Painter']
      }
    ],
    education: [
      {
        institution: 'MAAC',
        degree: 'Diploma in 3D Animation',
        focus: '3D Environment Art',
        specialization: 'Environment Art & Unreal Engine 5',
        period: '2023 – 2026'
      },
      {
        institution: 'Dholewal Sen. Sec. School',
        degree: 'Higher Secondary',
        focus: 'Grade XII',
        specialization: 'Grade XII: 85.4%',
        period: '2021 – 2023'
      }
    ],
    resume: {
      summary: '3D Environment Artist specializing in modeling, texturing, and lighting for game and animation environments. Diploma in 3D Animation from MAAC.',
      experience: [
        {
          role: '3D Environment Artist',
          company: 'M-Verse | VR Walkthrough',
          period: 'May 2026 – Jun 2026',
          description: 'Collaborated with a team to develop a Virtual Reality project over a 45-day timeline, covering a large-scale environment of approximately 2–3 km in area.',
          type: 'project',
          highlights: ['Environment assembly', 'Texture application', 'Lighting', 'Unreal Engine 5', 'Blueprints', 'Level design support'],
          software: ['Unreal Engine 5', 'Maya', '3ds Max', 'Substance Painter']
        }
      ]
    }
  };
}

function getFallbackProjects() {
  return [
    {
      id: 'm-verse-vr',
      slug: 'm-verse-vr',
      title: 'M-Verse | VR Walkthrough',
      categoryId: 'vr-environment',
      year: '2026',
      role: '3D Environment Artist',
      description: 'Collaborated with a team to develop a Virtual Reality project over a 45-day timeline, covering a large-scale environment of approximately 2–3 km in area.',
      featured: true,
      published: true,
      sortOrder: 1,
      software: ['Unreal Engine 5', 'Maya', '3ds Max', 'Substance Painter'],
      coverImage: '/images/project-placeholder.svg',
      heroImage: '/images/project-placeholder.svg',
      gallery: [],
      video: '',
      images: ['/images/project-placeholder.svg', '/assets/projects/reel/hero.svg', '/assets/projects/robot/hero.svg']
    },
    {
      id: 'hospital-corridor',
      slug: 'hospital-corridor',
      categoryId: 'environment-art',
      year: '2024',
      role: '3D Environment Artist',
      description: 'A hospital corridor environment focused on modeling, texturing and final presentation.',
      featured: false,
      published: true,
      sortOrder: 2,
      software: ['3ds Max', 'Substance Painter', 'Photoshop'],
      coverImage: '/images/project-placeholder.svg',
      heroImage: '/images/project-placeholder.svg',
      gallery: [],
      video: '',
      images: ['/images/project-placeholder.svg']
    }
  ];
}

function getFallbackCategories() {
  return [
    { id: 'environment-art', name: 'Environment Art', slug: 'environment-art' },
    { id: 'vr-environment', name: 'VR Environment', slug: 'vr-environment' },
    { id: 'game-environment', name: 'Game Environment', slug: 'game-environment' }
  ];
}

function getFallbackSoftware() {
  return [
    { id: 'unreal-engine-5', name: 'Unreal Engine 5', icon: '', category: 'Game Engine', description: 'Real-time 3D creation platform', isActive: true, sortOrder: 1 },
    { id: 'maya', name: 'Autodesk Maya', icon: '', category: '3D Skills', description: 'Industry-standard 3D modeling software', isActive: true, sortOrder: 2 },
    { id: '3ds-max', name: 'Autodesk 3ds Max', icon: '', category: '3D Skills', description: '3D modeling and rendering software', isActive: true, sortOrder: 3 },
    { id: 'zbrush', name: 'ZBrush', icon: '', category: '3D Skills', description: 'Digital sculpting software', isActive: true, sortOrder: 4 },
    { id: 'substance-painter', name: 'Substance Painter', icon: '', category: 'Texturing', description: '3D texturing software', isActive: true, sortOrder: 5 },
    { id: 'marvelous-designer', name: 'Marvelous Designer', icon: '', category: '3D Skills', description: '3D clothing design software', isActive: true, sortOrder: 6 },
    { id: 'marmoset-toolbag', name: 'Marmoset Toolbag 5', icon: '', category: 'Rendering', description: '3D rendering toolkit', isActive: true, sortOrder: 7 },
    { id: 'photoshop', name: 'Adobe Photoshop', icon: '', category: 'Post Production', description: 'Image editing software', isActive: true, sortOrder: 8 }
  ];
}
function normalizeProjectImages(project) {
  if (Array.isArray(project.images) && project.images.length > 0) {
    return project.images.filter(url => url && url.trim() !== '');
  }
  const images = [];
  if (project.coverImage) images.push(project.coverImage);
  if (project.heroImage && project.heroImage !== project.coverImage && !images.includes(project.heroImage)) {
    images.push(project.heroImage);
  }
  if (Array.isArray(project.gallery)) {
    project.gallery.forEach(img => {
      if (img && img.trim() !== '' && !images.includes(img)) images.push(img);
    });
  }
  return images.filter(url => url && url.trim() !== '');
}


// ============================================================================
// API DATA LOADING
// ============================================================================

async function fetchApi(endpoint, fallbackFn) {
  try {
    const response = await fetch(`${CONFIG.API_BASE}${endpoint}`);
    if (!response.ok) {
      throw new Error(`HTTP ${endpoint}: ${response.status}`);
    }
    const data = await response.json();
    console.log(`[API] Loaded: ${endpoint}`);
    return data;
  } catch (error) {
    console.error(`[API] Failed to load ${endpoint}, using fallback:`, error.message);
    if (endpoint === '/api/projects' || endpoint === '/api/settings') {
      document.body.classList.add('api-fallback-active');
    }
    return fallbackFn();
  }
}

async function loadData() {
  try {
    const [
      settings,
      projects,
      categories,
      software
    ] = await Promise.all([
      fetchApi(CONFIG.ENDPOINTS.SETTINGS, getFallbackSettings),
      fetchApi(CONFIG.ENDPOINTS.PROJECTS, getFallbackProjects),
      fetchApi(CONFIG.ENDPOINTS.CATEGORIES, getFallbackCategories),
      fetchApi(CONFIG.ENDPOINTS.SOFTWARE, getFallbackSoftware),
    ]);

    state.settings = settings;
    state.projects = Array.isArray(projects) ? projects : getFallbackProjects();
    state.categories = Array.isArray(categories) ? categories : getFallbackCategories();
    state.software = Array.isArray(software) ? software : getFallbackSoftware();

    console.log('[Data] All data loaded successfully');
    renderDynamicContent();
  } catch (error) {
    console.error('[Data] Critical error loading data:', error);
    state.settings = getFallbackSettings();
    state.projects = getFallbackProjects();
    state.categories = getFallbackCategories();
    state.software = getFallbackSoftware();
    renderDynamicContent();
  }
}

// ============================================================================
// DOM CACHING
// ============================================================================

function cacheDomElements() {
  dom.nav = document.querySelector('.navbar');
  dom.navLinks = document.querySelectorAll('.nav-link');
  dom.hamburger = document.querySelector('.hamburger');
  dom.mobileMenu = document.querySelector('.mobile-menu');
  dom.hero = document.querySelector('.hero-section');
  dom.heroTitle = document.querySelector('.hero-title');
  dom.heroSubtitle = document.querySelector('.hero-subtitle');
  dom.heroCta = document.querySelector('.hero-cta');
  dom.scrollIndicator = document.querySelector('.scroll-indicator');
  dom.projectsContainer = document.querySelector('#projects-container');
  dom.projectsEmpty = document.querySelector('#projects-empty');
  dom.skillsContainer = document.querySelector('#skills-container');
  dom.processContainer = document.querySelector('#process-container');
  dom.aboutBio = document.querySelector('#about-bio');
  dom.aboutTools = document.querySelector('#about-tools');
  dom.aboutImage = document.querySelector('#about-image');
  dom.aboutName = document.querySelector('#about-name');
  dom.educationContent = document.querySelector('#education-content');
  dom.aboutLocation = document.querySelector('#about-location');
  dom.awardsContainer = document.querySelector('#awards-container');
  dom.awardsList = document.querySelector('#awards-list');
  dom.contactEmail = document.querySelector('#contact-email');
  dom.contactPhone = document.querySelector('#contact-phone');
  dom.contactLocation = document.querySelector('#contact-location');
  dom.contactLinkedin = document.querySelector('#contact-linkedin');
  dom.contactSocials = document.querySelector('#contact-socials');
  dom.contactForm = document.querySelector('#contact-form');
  dom.resumeName = document.querySelector('#resume-name');
  dom.resumeTitle = document.querySelector('#resume-title');
  dom.resumeEmail = document.querySelector('#resume-email');
  dom.resumeLocation = document.querySelector('#resume-location');
  dom.resumeSummary = document.querySelector('#resume-summary');
  dom.resumeExperienceList = document.querySelector('#resume-experience-list');
  dom.resumeSkillsList = document.querySelector('#resume-skills-list');
  dom.resumeSoftwareList = document.querySelector('#resume-software-list');
  dom.scrollProgress = document.querySelector('#scroll-progress');
  dom.skillsCategories = document.querySelector('#skills-categories');
  dom.softwareMarquee = document.querySelector('#software-marquee');
  dom.particles = document.querySelector('#particles');
  dom.cursor = document.querySelector('#cursor');
  dom.cursorDot = document.querySelector('#cursor-blur');
  dom.loader = document.querySelector('#loader');
  dom.projectModal = document.querySelector('#project-detail-modal');
  dom.projectModalContent = document.querySelector('.project-detail-content');
  dom.projectModalClose = document.querySelector('.project-detail-close');
  dom.filterContainer = document.querySelector('#category-filters');
}

// ============================================================================
// RENDER FUNCTIONS
// ============================================================================

function renderDynamicContent() {
  renderHero();
  renderAbout();
  renderProjects();
  renderSkills();
  renderProcess();
  renderEducation();
  renderAwards();
  renderContact();
  renderResume();
  renderSoftwareMarquee();
  renderCategoryFilters();
  updateMetaTags();
}

function renderHero() {
  if (!state.settings) return;
  const { name, title, subtitle } = state.settings;
  if (dom.heroSubtitle) dom.heroSubtitle.textContent = subtitle;
  document.title = `${name} - ${title}`;
}

function renderAbout() {
  if (!state.settings) return;
  const { bio, location, skills } = state.settings;
  if (dom.aboutBio && bio) dom.aboutBio.textContent = bio;
  if (dom.aboutLocation && location) dom.aboutLocation.textContent = location;
  if (dom.aboutName) dom.aboutName.textContent = state.settings.name;
  if (dom.aboutTools && skills && Array.isArray(skills)) {
    dom.aboutTools.innerHTML = skills.slice(0, 8).map(skill => 
      `<span class="about-tool-tag">${escapeHtml(skill)}</span>`
    ).join('');
  }
}

function renderProjects() {
  if (!dom.projectsContainer) return;
  const categoryMap = {};
  state.categories.forEach(cat => { categoryMap[cat.id] = cat.name; });
  let filteredProjects = state.projects;
  if (state.activeCategory !== 'all') {
    filteredProjects = state.projects.filter(
      project => project.categoryId === state.activeCategory
    );
  }
  filteredProjects = filteredProjects.filter(project => project.published !== false);
  if (filteredProjects.length === 0) {
    if (dom.projectsEmpty) dom.projectsEmpty.style.display = 'block';
    dom.projectsContainer.innerHTML = '';
    return;
  }
  if (dom.projectsEmpty) dom.projectsEmpty.style.display = 'none';
  dom.projectsContainer.innerHTML = filteredProjects
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
    .map((project, index) => createProjectCard(project, index, categoryMap))
    .join('');
  attachProjectEventListeners();
}

function createProjectCard(project, index, categoryMap) {
  const categoryName = categoryMap[project.categoryId] || 'Project';
  return `
    <article class="project-card" data-project-id="${project.id}" style="--delay: ${index * CONFIG.STAGGER_DELAY}ms">
      <div class="project-card-inner">
        <div class="project-image-wrapper">
          <img src="${escapeHtml(project.coverImage || '/images/project-placeholder.svg')}" alt="${escapeHtml(project.title)}" class="project-image" loading="lazy" onerror="this.src='/images/project-placeholder.svg'" />
          <div class="project-overlay"><span class="project-view-btn">View Project</span></div>
        </div>
        <div class="project-info">
          <div class="project-meta">
            <span class="project-category">${escapeHtml(categoryName)}</span>
            <span class="project-year">${escapeHtml(project.year || '')}</span>
          </div>
          <h3 class="project-title">${escapeHtml(project.title)}</h3>
          <p class="project-description">${escapeHtml(project.description)}</p>
          <div class="project-software">
            ${(project.software || []).slice(0, 4).map(sw => `<span class="software-tag">${escapeHtml(sw)}</span>`).join('')}
          </div>
        </div>
      </div>
    </article>
  `;
}

function renderSkills() {
  if (!state.settings || !state.settings.skills) return;
  const skillsByCategory = categorizeSkills(state.settings.skills);
  if (dom.skillsCategories) {
    dom.skillsCategories.innerHTML = Object.entries(skillsByCategory)
      .map(([category, skills], index) => `
        <div class="skill-category" style="--delay: ${index * CONFIG.STAGGER_DELAY}ms">
          <h4 class="skill-category-title">${escapeHtml(category)}</h4>
          <div class="skill-tags">
            ${skills.map(skill => `<span class="skill-tag">${escapeHtml(skill)}</span>`).join('')}
          </div>
        </div>
      `).join('');
  }
}

function categorizeSkills(skills) {
  const categories = {
    'Environment': [], 'Modeling': [], 'Texturing & Materials': [],
    'Lighting': [], 'Engine & Tools': [], 'Other': []
  };
  skills.forEach(skill => {
    const lowerSkill = skill.toLowerCase();
    if (lowerSkill.includes('environment') || lowerSkill.includes('level') || lowerSkill.includes('modular') || lowerSkill.includes('scene') || lowerSkill.includes('vr')) {
      categories['Environment'].push(skill);
    } else if (lowerSkill.includes('model') || lowerSkill.includes('sculpt') || lowerSkill.includes('hard surface') || lowerSkill.includes('asset') || lowerSkill.includes('character')) {
      categories['Modeling'].push(skill);
    } else if (lowerSkill.includes('texture') || lowerSkill.includes('material') || lowerSkill.includes('pbr') || lowerSkill.includes('surface') || lowerSkill.includes('detailing')) {
      categories['Texturing & Materials'].push(skill);
    } else if (lowerSkill.includes('light') || lowerSkill.includes('mood') || lowerSkill.includes('atmosphere') || lowerSkill.includes('cinematic')) {
      categories['Lighting'].push(skill);
    } else if (lowerSkill.includes('unreal') || lowerSkill.includes('engine') || lowerSkill.includes('blueprint')) {
      categories['Engine & Tools'].push(skill);
    } else {
      categories['Other'].push(skill);
    }
  });
  return Object.fromEntries(
    Object.entries(categories).filter(([_, skills]) => skills.length > 0)
  );
}

function renderProcess() {
  if (!dom.processContainer) return;
  const processSteps = [
    { step: '01', title: 'Concept & Reference', description: 'Gathering references and defining the visual direction for the environment.', icon: '📋' },
    { step: '02', title: 'Blockout & Layout', description: 'Creating modular assets and establishing the scene composition.', icon: '🧊' },
    { step: '03', title: 'Modeling & Sculpting', description: 'High-poly modeling and detailing for production-ready assets.', icon: '🎨' },
    { step: '04', title: 'Texturing & Materials', description: 'PBR texturing workflow for realistic materials and surfaces.', icon: '🎭' },
    { step: '05', title: 'Lighting & Atmosphere', description: 'Setting up mood, atmosphere, and cinematic lighting.', icon: '💡' },
    { step: '06', title: 'Optimization & Polish', description: 'Performance optimization and final presentation quality.', icon: '✨' }
  ];
  dom.processContainer.innerHTML = processSteps.map((step, index) => `
    <div class="process-step" style="--delay: ${index * CONFIG.STAGGER_DELAY}ms">
      <div class="process-step-number">${step.step}</div>
      <div class="process-step-icon">${step.icon}</div>
      <h3 class="process-step-title">${escapeHtml(step.title)}</h3>
      <p class="process-step-description">${escapeHtml(step.description)}</p>
    </div>
  `).join('');
}

function renderEducation() {
  if (!dom.educationContent || !state.settings || !state.settings.education) return;
  dom.educationContent.innerHTML = state.settings.education.map((edu, index) => `
    <div class="education-item" style="--delay: ${index * CONFIG.STAGGER_DELAY}ms">
      <div class="education-header">
        <h3 class="education-institution">${escapeHtml(edu.institution)}</h3>
        <span class="education-period">${escapeHtml(edu.period)}</span>
      </div>
      <div class="education-details">
        <p class="education-degree">${escapeHtml(edu.degree)}</p>
        <p class="education-specialization">${escapeHtml(edu.specialization || '')}</p>
      </div>
    </div>
  `).join('');
}

function renderAwards() {
  if (!dom.awardsList || !state.settings || !state.settings.awards) return;
  dom.awardsList.innerHTML = state.settings.awards.map((award, index) => `
    <div class="award-item" style="--delay: ${index * CONFIG.STAGGER_DELAY}ms">
      <div class="award-header">
        <h3 class="award-event">${escapeHtml(award.event)}</h3>
        <span class="award-date">${escapeHtml(award.date)}</span>
      </div>
      <p class="award-achievement">${escapeHtml(award.achievement)}</p>
      <p class="award-description">${escapeHtml(award.description)}</p>
      ${award.software && award.software.length > 0 ? `
        <div class="award-software">
          ${award.software.map(sw => `<span class="software-tag">${escapeHtml(sw)}</span>`).join('')}
        </div>
      ` : ''}
    </div>
  `).join('');
}

function renderContact() {
  if (!state.settings) return;
  const { email, phone, location, linkedin, artstation } = state.settings;
  if (dom.contactEmail && email) {
    dom.contactEmail.textContent = email;
    dom.contactEmail.href = `mailto:${email}`;
  }
  if (dom.contactPhone && phone) {
    dom.contactPhone.textContent = phone;
    dom.contactPhone.href = `tel:${phone.replace(/\D/g, '')}`;
  }
  if (dom.contactLocation && location) dom.contactLocation.textContent = location;
  if (dom.contactLinkedin && linkedin) {
    dom.contactLinkedin.href = linkedin;
    dom.contactLinkedin.textContent = 'LinkedIn';
  }
}

function renderResume() {
  if (!state.settings || !state.settings.resume) return;
  const { summary, experience, skills, software } = state.settings.resume;
  if (dom.resumeSummary && summary) dom.resumeSummary.textContent = summary;
  if (dom.resumeExperienceList && experience && Array.isArray(experience)) {
    dom.resumeExperienceList.innerHTML = experience.map((exp, index) => `
      <div class="resume-experience-item" style="--delay: ${index * CONFIG.STAGGER_DELAY}ms">
        <div class="resume-experience-header">
          <h3 class="resume-role">${escapeHtml(exp.role)}</h3>
          <span class="resume-company">${escapeHtml(exp.company)}</span>
        </div>
        <span class="resume-period">${escapeHtml(exp.period)}</span>
        <p class="resume-description">${escapeHtml(exp.description)}</p>
        ${exp.highlights && exp.highlights.length > 0 ? `
          <ul class="resume-highlights">
            ${exp.highlights.map(highlight => `<li>${escapeHtml(highlight)}</li>`).join('')}
          </ul>
        ` : ''}
      </div>
    `).join('');
  }
  if (dom.resumeSkillsList && skills) {
    dom.resumeSkillsList.innerHTML = skills.slice(0, 10).map(skill => `<span class="resume-skill-tag">${escapeHtml(skill)}</span>`).join('');
  }
  if (dom.resumeSoftwareList && software) {
    dom.resumeSoftwareList.innerHTML = software.slice(0, 8).map(sw => `<span class="resume-software-tag">${escapeHtml(sw)}</span>`).join('');
  }
  // Make resume sections visible immediately (fix for IntersectionObserver not triggering)
  const resumeSections = document.querySelectorAll(".resume-experience, .resume-skills, .resume-software");
  resumeSections.forEach(section => section.classList.add("resume-visible"));
}

function renderSoftwareMarquee() {
  if (!dom.softwareMarquee || !state.software.length) return;
  const activeSoftware = state.software.filter(sw => sw.isActive !== false);
  dom.softwareMarquee.innerHTML = `
    <div class="marquee-track">
      ${activeSoftware.map(sw => `
        <div class="marquee-item">
          <span class="marquee-software-name">${escapeHtml(sw.name)}</span>
        </div>
      `).join('')}
    </div>
    <div class="marquee-track" aria-hidden="true">
      ${activeSoftware.map(sw => `
        <div class="marquee-item">
          <span class="marquee-software-name">${escapeHtml(sw.name)}</span>
        </div>
      `).join('')}
    </div>
  `;
}

function renderCategoryFilters() {
  if (!dom.filterContainer || !state.categories.length) return;
  const allCategories = [{ id: 'all', name: 'All Work' }, ...state.categories];
  dom.filterContainer.innerHTML = allCategories.map(cat => `
    <button class="filter-btn ${state.activeCategory === cat.id ? 'active' : ''}" data-category="${cat.id}">
      ${escapeHtml(cat.name)}
    </button>
  `).join('');
  dom.filterContainer.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', handleFilterClick);
  });
}

function updateMetaTags() {
  if (!state.settings) return;
  const { name, title, bio } = state.settings;
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription && bio) metaDescription.setAttribute('content', bio.substring(0, 160));
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute('content', `${name} - ${title}`);
  const ogDescription = document.querySelector('meta[property="og:description"]');
  if (ogDescription && bio) ogDescription.setAttribute('content', bio.substring(0, 160));
}

// ============================================================================
// EVENT HANDLERS
// ============================================================================

function handleFilterClick(event) {
  const categoryId = event.target.dataset.category;
  if (!categoryId) return;
  state.activeCategory = categoryId;
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.category === categoryId);
  });
  renderProjects();
}

function handleProjectClick(projectId) {
  const project = state.projects.find(p => p.id === projectId);
  if (!project) return;
  showProjectDetail(project);
}

function showProjectDetail(project) {
  if (!dom.projectModal) return;
  state.activeProjectId = project.id;
  const category = state.categories.find(cat => cat.id === project.categoryId);
  const categoryName = category ? category.name : "Project";
  const images = normalizeProjectImages(project);
  const heroImage = images.length > 0 ? images[0] : (project.heroImage || project.coverImage || '/images/project-placeholder.svg');

  const mediaImg = dom.projectModal.querySelector('.project-detail-media img#modal-hero-image');
  if (mediaImg) {
    mediaImg.src = heroImage;
    mediaImg.alt = project.title;
    mediaImg.onerror = function() { this.src = '/images/project-placeholder.svg'; };
  }

  const headerEl = dom.projectModal.querySelector('.project-detail-info .modal-header');
  if (headerEl) {
    headerEl.innerHTML = `
      <div class="modal-meta">
        <span class="modal-category">${escapeHtml(categoryName)}</span>
        <span class="modal-year">${escapeHtml(project.year || "")}</span>
      </div>
      <h2 class="modal-title">${escapeHtml(project.title)}</h2>
      <p class="modal-role">${escapeHtml(project.role)}</p>
    `;
  }

  const descEl = dom.projectModal.querySelector('.project-detail-info .modal-description');
  if (descEl) {
    descEl.innerHTML = `<p>${escapeHtml(project.description)}</p>`;
  }

  const softwareEl = dom.projectModal.querySelector('.project-detail-info .modal-software');
  if (softwareEl) {
    if (project.software && project.software.length > 0) {
      softwareEl.innerHTML = `
        <h4>Software Used</h4>
        <div class="modal-software-list">
          ${project.software.map(sw => `<span class="software-tag">${escapeHtml(sw)}</span>`).join('')}
        </div>
      `;
    } else {
      softwareEl.innerHTML = '';
    }
  }

  const thumbStrip = dom.projectModal.querySelector('.project-detail-thumbnail-strip');
  if (thumbStrip && images.length > 1) {
    thumbStrip.innerHTML = images.map((img, idx) => {
      const activeClass = idx === 0 ? ' active' : '';
      const ariaSelected = idx === 0 ? ' aria-selected="true"' : '';
      return `<button class="project-detail-thumbnail${activeClass}" data-src="${escapeHtml(img)}"${ariaSelected}><img src="${escapeHtml(img)}" alt="" loading="lazy" onerror="this.style.display='none'" /></button>`;
    }).join('');
  } else if (thumbStrip) {
    thumbStrip.innerHTML = '';
  }

  const galleryEl = dom.projectModal.querySelector('.project-detail-gallery');
  if (galleryEl && images.length > 1) {
    galleryEl.innerHTML = images.slice(1).map(img =>
      `<img src="${escapeHtml(img)}" alt="" loading="lazy" onerror="this.style.display='none'" style="width:100%;border-radius:8px;margin-top:12px;" />`
    ).join('');
  } else if (galleryEl) {
    galleryEl.innerHTML = '';
  }

  const videoEl = dom.projectModal.querySelector('.project-detail-video');
  if (videoEl) {
    if (project.video) {
      videoEl.innerHTML = `<video controls src="${escapeHtml(project.video)}" style="width:100%;border-radius:8px;margin-top:12px;"></video>`;
    } else {
      videoEl.innerHTML = '';
    }
  }

  dom.projectModal.classList.add('active');
  document.body.style.overflow = 'hidden';

  document.querySelectorAll('.project-detail-thumbnail').forEach(thumb => {
    thumb.addEventListener('click', () => {
      const heroImg = document.getElementById('modal-hero-image');
      if (heroImg) heroImg.src = thumb.dataset.src;
      document.querySelectorAll('.project-detail-thumbnail').forEach(t => {
        t.classList.remove('active');
        t.removeAttribute('aria-selected');
      });
      thumb.classList.add('active');
      thumb.setAttribute('aria-selected', 'true');
    });
  });
}

function closeProjectModal() {
  if (!dom.projectModal) return;
  dom.projectModal.classList.remove('active');
  document.body.style.overflow = '';
  state.activeProjectId = null;
}

function attachProjectEventListeners() {
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', () => {
      const projectId = card.dataset.projectId;
      handleProjectClick(projectId);
    });
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const projectId = card.dataset.projectId;
        handleProjectClick(projectId);
      }
    });
  });
}

function toggleMobileMenu() {
  state.isMobileMenuOpen = !state.isMobileMenuOpen;
  if (dom.mobileMenu) dom.mobileMenu.classList.toggle('active', state.isMobileMenuOpen);
  if (dom.hamburger) dom.hamburger.classList.toggle('active', state.isMobileMenuOpen);
  document.body.style.overflow = state.isMobileMenuOpen ? 'hidden' : '';
}

function closeMobileMenu() {
  state.isMobileMenuOpen = false;
  if (dom.mobileMenu) dom.mobileMenu.classList.remove('active');
  if (dom.hamburger) dom.hamburger.classList.remove('active');
  document.body.style.overflow = '';
}

function handleContactSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);
  const data = {
    name: formData.get('name') || '',
    email: formData.get('email') || '',
    subject: formData.get('subject') || '',
    message: formData.get('message') || '',
  };
  console.log('[Contact Form] Submission:', data);
  if (form.querySelector('.contact-form-success')) form.querySelector('.contact-form-success').remove();
  const successMessage = document.createElement('div');
  successMessage.className = 'contact-form-success';
  successMessage.innerHTML = `
    <div class="success-message">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
      <span>Thank you for your message! I will get back to you soon.</span>
    </div>
  `;
  form.appendChild(successMessage);
  form.reset();
  setTimeout(() => successMessage.remove(), 5000);
}

// ============================================================================
// ANIMATIONS & VISUAL EFFECTS
// ============================================================================

function initCursor() {
  if (state.isTouchDevice) {
    if (dom.cursor) dom.cursor.style.display = 'none';
    if (dom.cursorDot) dom.cursorDot.style.display = 'none';
    return;
  }
  if (!dom.cursor || !dom.cursorDot) return;
  dom.cursor.style.opacity = '1';
  dom.cursorDot.style.opacity = '1';
  let cursorX = 0;
  let cursorY = 0;
  let dotX = 0;
  let dotY = 0;
  document.addEventListener('mousemove', (e) => {
    cursorX = e.clientX;
    cursorY = e.clientY;
    state.mouseX = cursorX;
    state.mouseY = cursorY;
  });
  function animateCursor() {
    dotX = lerp(dotX, cursorX, 0.15);
    dotY = lerp(dotY, cursorY, 0.15);
    dom.cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
    dom.cursorDot.style.transform = `translate(${dotX}px, ${dotY}px)`;
    state.rafId = requestAnimationFrame(animateCursor);
  }
  animateCursor();
  document.querySelectorAll('a, button, .project-card').forEach(el => {
    el.addEventListener('mouseenter', () => dom.cursor.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => dom.cursor.classList.remove('cursor-hover'));
  });
}

function initParticles() {
  if (!dom.particles) return;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  dom.particles.appendChild(canvas);
  let particles = [];
  let width = 0;
  let height = 0;
  function resize() {
    width = dom.particles.offsetWidth;
    height = dom.particles.offsetHeight;
    canvas.width = width;
    canvas.height = height;
  }
  function createParticles() {
    particles = [];
    for (let i = 0; i < CONFIG.PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 1,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.5 + 0.2,
      });
    }
  }
  function animate() {
    if (!dom.particles) return;
    ctx.clearRect(0, 0, width, height);
    particles.forEach(particle => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      if (particle.x < 0) particle.x = width;
      if (particle.x > width) particle.x = 0;
      if (particle.y < 0) particle.y = height;
      if (particle.y > height) particle.y = 0;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
      ctx.fill();
    });
    state.particleRafId = requestAnimationFrame(animate);
  }
  resize();
  createParticles();
  animate();
  window.addEventListener('resize', debounce(() => {
    resize();
    createParticles();
  }, 250));
}

function initScrollProgress() {
  if (!dom.scrollProgress) return;
  function updateScrollProgress() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    dom.scrollProgress.style.width = `${clamp(scrollPercent, 0, 100)}%`;
  }
  window.addEventListener('scroll', throttle(updateScrollProgress, 16));
  updateScrollProgress();
}

function initIntersectionObservers() {
  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  document.querySelectorAll(
    '.project-card, .skill-category, .process-step, .education-item, .award-item, .resume-experience-item, .section-title'
  ).forEach(el => observer.observe(el));
}

function initStickyNav() {
  if (!dom.nav) return;
  let ticking = false;
  function updateNav() {
    const scrollY = window.pageYOffset;
    if (scrollY > 100) dom.nav.classList.add('scrolled');
    else dom.nav.classList.remove('scrolled');
    ticking = false;
  }
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateNav);
      ticking = true;
    }
  });
  dom.navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const targetId = href.substring(1);
        scrollToElement(`#${targetId}`);
        closeMobileMenu();
      }
    });
  });
}

function initMobileMenu() {
  if (!dom.hamburger || !dom.mobileMenu) return;
  dom.hamburger.addEventListener('click', toggleMobileMenu);
  const mobileLinks = dom.mobileMenu.querySelectorAll('.mobile-nav-link');
  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && state.isMobileMenuOpen) closeMobileMenu();
  });
}

function initHeroAnimation() {
  if (!dom.hero) return;
  dom.hero.classList.add('hero-animate');
  setTimeout(() => dom.hero.classList.add('hero-loaded'), 100);
}

function initSkillsAnimations() {
  if (!dom.skillsContainer) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('skills-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  observer.observe(dom.skillsContainer);
}

function initResumeAnimations() {
  const resumeSection = document.querySelector('.resume-section');
  if (!resumeSection) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('resume-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  observer.observe(resumeSection);
}

function initContactForm() {
  if (!dom.contactForm) return;
  dom.contactForm.addEventListener('submit', handleContactSubmit);
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) scrollToElement(href);
    });
  });
}

function initModalClose() {
  if (dom.projectModalClose) dom.projectModalClose.addEventListener('click', closeProjectModal);
  if (dom.projectModal) dom.projectModal.addEventListener('click', (e) => {
    if (e.target === dom.projectModal) closeProjectModal();
  });
}

function initParallax() {
  if (state.isTouchDevice) return;
  const parallaxElements = document.querySelectorAll('[data-parallax]');
  window.addEventListener('scroll', throttle(() => {
    const scrollY = window.pageYOffset;
    parallaxElements.forEach(el => {
      const speed = parseFloat(el.dataset.parallax) || 0.5;
      const yPos = -(scrollY * speed);
      el.style.transform = `translateY(${yPos}px)`;
    });
  }, 16));
}

// ============================================================================
// ROUTER
// ============================================================================

function initRouter() {
  function handleRoute() {
    const hash = window.location.hash.substring(1);
    const [page, param] = hash.split('/');
    if (page === 'project' && param) {
      const project = state.projects.find(p => p.slug === param || p.id === param);
      if (project) setTimeout(() => showProjectDetail(project), 300);
    }
  }
  window.addEventListener('hashchange', handleRoute);
  handleRoute();
}

// ============================================================================
// LOADER MANAGEMENT
// ============================================================================

function hideLoader() {
  if (!dom.loader) return;
  dom.loader.classList.add('loader-hidden');
  setTimeout(() => {
    dom.loader.style.display = 'none';
    state.isLoading = false;
  }, 500);
}

function forceHideLoader() {
  setTimeout(() => {
    if (state.isLoading) {
      console.warn('[Loader] Force hiding loader after timeout');
      hideLoader();
    }
  }, CONFIG.LOADER_TIMEOUT);
}

// ============================================================================
// ERROR HANDLING
// ============================================================================

window.addEventListener('error', (event) => {
  console.error('[Global Error]', event.error);
  if (state.isLoading) hideLoader();
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('[Unhandled Rejection]', event.reason);
  if (state.isLoading) hideLoader();
});

// ============================================================================
// INITIALIZATION
// ============================================================================

async function init() {
  console.log('[App] Initializing...');
  try {
    cacheDomElements();
    state.isTouchDevice = isTouchDevice();
    setupEventListeners();
    initCursor();
    initParticles();
    initScrollProgress();
    initHeroAnimation();
    initStickyNav();
    initMobileMenu();
    initSkillsAnimations();
    initResumeAnimations();
    initContactForm();
    initSmoothScroll();
    initModalClose();
    initRouter();
    initParallax();
    await loadData();
    state.lastApiTimestamp = null;
    try {
      const res = await fetch('/api/version');
      if (res.ok) state.lastApiTimestamp = (await res.json()).timestamp;
    } catch (e) {}
    setInterval(async () => {
      try {
        const res = await fetch('/api/version');
        if (res.ok) {
          const { timestamp } = await res.json();
          if (timestamp !== state.lastApiTimestamp) {
            await loadData();
            state.lastApiTimestamp = timestamp;
          }
        }
      } catch (e) {
        // Silently ignore poll errors
      }
    }, CONFIG.POLL_INTERVAL);
    initIntersectionObservers();
    hideLoader();
    forceHideLoader();
    console.log('[App] Initialization complete');
  } catch (error) {
    console.error('[App] Initialization failed:', error);
    hideLoader();
  }
}

function setupEventListeners() {
  window.addEventListener('scroll', throttle(() => {
    state.scrollY = window.pageYOffset;
  }, 16));
  window.addEventListener('resize', debounce(() => {
    if (dom.particles && dom.particles.querySelector('canvas')) {
      // Particles will handle resize internally
    }
  }, 250));
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (state.activeProjectId) closeProjectModal();
      if (state.isMobileMenuOpen) closeMobileMenu();
    }
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (state.rafId) cancelAnimationFrame(state.rafId);
      if (state.particleRafId) cancelAnimationFrame(state.particleRafId);
    } else {
      initCursor();
      initParticles();
    }
  });
}

// ============================================================================
// START APPLICATION
// ============================================================================

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// ============================================================================
// EXPORTS (for module systems)
// ============================================================================

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    state,
    dom,
    init,
    loadData,
    renderDynamicContent,
    renderProjects,
    renderHero,
    renderAbout,
    renderSkills,
    renderProcess,
    renderEducation,
    renderAwards,
    renderContact,
    renderResume,
    getFallbackSettings,
    getFallbackProjects,
    getFallbackCategories,
    getFallbackSoftware,
  };
}

