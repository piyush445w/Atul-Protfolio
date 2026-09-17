(function() {
    'use strict';

    function escapeHtml(text) {
        const div = document.createElement("div");
        div.textContent = text;
        return div.innerHTML;
    }

    let settings = null;
    let projects = [];
    let categories = [];
    let particles = [];
    let parallaxElements = [];
    let observers = [];
    let isMenuOpen = false;
    let currentMediaType = 'all';
    let elements = null;
    let mouseX = -1000;
    let mouseY = -1000;

    function log(message) {
        console.log('[App] ' + message);
    }

    function errorLog(message, err) {
        console.error('[App] ' + message + ':', err);
    }

    function hideLoader() {
        try {
            const loader = document.getElementById('loader');
            if (!loader) return;
            loader.classList.add('hidden');
            setTimeout(function() {
                if (loader.style.opacity === '0' || loader.classList.contains('hidden')) {
                    loader.style.display = 'none';
                }
            }, 1200);
        } catch (err) {
            console.warn('[App] Could not hide loader:', err);
            const loader = document.getElementById('loader');
            if (loader) {
                loader.style.display = 'none';
            }
        }
    }

    function getElements() {
        return {
            nav: document.querySelector('.navbar'),
            navLinks: document.querySelectorAll('.nav-link'),
            hamburger: document.querySelector('.hamburger'),
            mobileMenu: document.querySelector('.mobile-menu'),
            hero: document.querySelector('.hero-section'),
            heroTitle: document.querySelector('.hero-title'),
            heroSubtitle: document.querySelector('.hero-subtitle'),
            scrollIndicator: document.querySelector('.scroll-indicator'),
            projectsContainer: document.getElementById('projects-container'),
            projectsEmpty: document.getElementById('projects-empty'),
            skillsContainer: document.getElementById('skills-container'),
            processContainer: document.getElementById('process-container'),
            aboutSection: document.querySelector('.about-section'),
            aboutBio: document.getElementById('about-bio'),
            aboutTools: document.getElementById('about-tools'),
            aboutImage: document.getElementById('about-image'),
            aboutName: document.getElementById('about-name'),
            awardsContainer: document.getElementById('awards-container'),
            awardsList: document.getElementById('awards-list'),
            contactEmail: document.getElementById('contact-email'),
            contactPhone: document.getElementById('contact-phone'),
            contactLocation: document.getElementById('contact-location'),
            contactLinkedin: document.getElementById('contact-linkedin'),
            contactSocials: document.getElementById('contact-socials'),
            footerSocials: document.getElementById('footer-socials'),
            contactForm: document.getElementById('contact-form'),
            resumeName: document.getElementById('resume-name'),
            resumeTitle: document.getElementById('resume-title'),
            resumeEmail: document.getElementById('resume-email'),
            resumeLocation: document.getElementById('resume-location'),
            resumeSummary: document.getElementById('resume-summary'),
            resumeExperienceList: document.getElementById('resume-experience-list'),
            servicesContainer: document.getElementById('services-container'),
            educationContent: document.getElementById('education-content'),
            cursor: document.querySelector('.cursor-follower'),
            cursorDot: document.querySelector('.cursor-dot'),
            scrollProgress: document.querySelector('.scroll-progress'),
            skillsCategories: document.getElementById('skills-categories'),
            softwareMarquee: document.getElementById('software-marquee'),
            particles: document.querySelector('.particles-container'),
            mediaFiltersContainer: document.getElementById('media-filters')
        };
    }

    async function loadData() {
        log('Loading data from APIs...');
        try {
            const [settingsRes, projectsRes, categoriesRes, softwareRes] = await Promise.all([
                fetch('/api/settings'),
                fetch('/api/projects'),
                fetch('/api/categories'),
                fetch('/api/software')
            ]);

            if (categoriesRes.ok) {
                categories = await categoriesRes.json();
                log('Categories loaded successfully');
            } else {
                log('Categories API returned status: ' + categoriesRes.status);
            }

            if (settingsRes.ok) {
                settings = await settingsRes.json();
                log('Settings loaded successfully');
            } else {
                log('Settings API returned status: ' + settingsRes.status);
            }

            if (projectsRes.ok) {
                projects = await projectsRes.json();
                log('Projects loaded successfully');
            } else {
                log('Projects API returned status: ' + projectsRes.status);
            }

            if (softwareRes.ok) {
                window.softwareData = await softwareRes.json();
                log('Software loaded successfully');
            } else {
                window.softwareData = [];
                log('Software API returned status: ' + softwareRes.status);
            }

            renderDynamicContent();
        } catch (err) {
            errorLog('API fetch failed, using fallback data', err);
            settings = getFallbackSettings();
            projects = getFallbackProjects();
            categories = getFallbackCategories();
            window.softwareData = [];
            renderDynamicContent();
        }
    }

    function getFallbackSettings() {
        return {
            name: 'Atul Kumar Yadav',
            title: '3D Environment Artist',
            subtitle: 'Unreal Engine 5 � Environment Art � 3D Modeling � Texturing � Lighting',
            bio: 'I am a 3D Environment Artist specializing in modeling, texturing, and lighting for game and animation environments, with a Diploma in 3D Animation from MAAC.',
            tools: ['Unreal Engine 5', 'Maya', '3ds Max', 'ZBrush', 'Substance Painter', 'Marvelous Designer', 'Marmoset Toolbag', 'Photoshop'],
            skills: ['Environment Art', 'Environment Modeling', 'Level Design', 'Scene Assembly', 'Modular Environment Creation', '3D Modeling', 'Hard Surface Modeling', 'Asset Creation', 'Sculpting', 'Texturing', 'PBR Texturing', 'Material Creation', 'Surface Detailing', 'Lighting', 'Real-Time Lighting', 'Mood & Atmosphere', 'Cinematic Lighting', 'Unreal Engine 5', 'Blueprints', 'Environment Setup', 'VR Environment Development'],
            awards: [
                { event: 'Punjab Animation Award', achievement: 'Jury Winner � 3D Environment Art', date: 'April 2025' },
                { event: '24FPS International Award', achievement: 'Nominee � 3D Character Modeling & Texturing', date: 'December 2025' }
            ],
            email: '',
            location: 'Ludhiana, Punjab, India',
            phone: '',
            linkedin: 'https://www.linkedin.com/in/atulkumaryadav',
            artstation: 'https://www.artstation.com/atulkumar62',
            socials: {
                linkedin: 'https://www.linkedin.com/in/atulkumaryadav',
                artstation: 'https://www.artstation.com/atulkumar62'
            },
            education: [
                { institution: 'MAAC', degree: 'Diploma in 3D Animation', focus: '3D Environment Art', specialization: 'Environment Art & Unreal Engine 5', period: '2023 � 2026' }
            ],
            resume: {
                name: 'Atul Kumar Yadav',
                title: '3D Environment Artist',
                email: '',
                location: 'Ludhiana, Punjab, India',
                summary: '3D Environment Artist specializing in modeling, texturing, and lighting for game and animation environments.',
                experience: [
                    { role: '3D Environment Artist', company: 'M-Verse | VR Walkthrough', period: 'May 2026 � Jun 2026', description: 'Collaborated with a team to develop a Virtual Reality project over a 45-day timeline, covering a large-scale environment of approximately 2�3 km in area. Worked across multiple areas of the environment art and level design pipeline in Unreal Engine 5, including environment assembly, texture application, lighting, and Blueprint support.' }
                ],
                skills: ['Environment Art', 'Environment Modeling', 'Level Design', 'Scene Assembly', 'Modular Environment Creation', '3D Modeling', 'Hard Surface Modeling', 'Asset Creation', 'Sculpting', 'Texturing', 'PBR Texturing', 'Material Creation', 'Surface Detailing', 'Lighting', 'Real-Time Lighting', 'Mood & Atmosphere', 'Cinematic Lighting', 'Unreal Engine 5', 'Blueprints', 'Environment Setup', 'VR Environment Development'],
                software: ['Unreal Engine 5', 'Autodesk Maya', 'Autodesk 3ds Max', 'ZBrush', 'Substance Painter', 'Marvelous Designer', 'Marmoset Toolbag 5', 'Adobe Photoshop']
            },
            services: [
                { id: 'environment-art', title: 'Environment Art', description: 'Complete environment art creation for games, animation, and VFX � from concept to final scene assembly.' },
                { id: '3d-modeling', title: '3D Modeling', description: 'High-quality 3D modeling for environments, props, and hard surface assets optimized for real-time engines.' },
                { id: 'texturing-materials', title: 'Texturing & Materials', description: 'PBR texturing and material creation using Substance Painter and Designer for photorealistic surfaces.' },
                { id: 'lighting', title: 'Lighting & Atmosphere', description: 'Cinematic lighting and mood setup in Unreal Engine 5 for immersive real-time environments.' },
                { id: 'ue5-setup', title: 'Unreal Engine 5 Setup', description: 'Complete environment setup in UE5 including Blueprints, optimization, and VR-ready pipeline.' },
                { id: 'vr-environment', title: 'VR Environment Development', description: 'Virtual reality environment development with performance optimization and immersive interaction design.' }
            ]
        };
    }

    function getFallbackCategories() {
        return [
            { id: 'environment-art', name: 'Environment Art' },
            { id: 'vr-environment', name: 'VR Environment' },
            { id: 'game-environment', name: 'Game Environment' }
        ];
    }

    function getFallbackProjects() {
        return [
            {
                id: 'm-verse-vr',
                title: 'M-Verse | VR Walkthrough',
                slug: 'm-verse-vr',
                categoryId: 'vr-environment',
                year: '2026',
                role: '3D Environment Artist',
                description: 'Collaborated with a team to develop a Virtual Reality project over a 45-day timeline, covering a large-scale environment of approximately 2�3 km in area.',
                featured: true,
                published: true,
                sortOrder: 1,
                software: ['Unreal Engine 5', 'Maya', '3ds Max', 'Substance Painter'],
                coverImage: '/images/project-placeholder.svg',
                heroImage: '/images/project-placeholder.svg',
                gallery: [],
                video: '',
                responsibilities: ['Environment assembly', 'Texture application', 'Lighting', 'Unreal Engine 5', 'Blueprints', 'Level design support'],
                images: []
            }
        ];
    }

    function renderDynamicContent() {
        log('Rendering dynamic content...');
        renderHero();
        renderProjects();
        renderMediaFilters();
        renderCategoryFilters();
        renderProcess();
        renderSkills();
        renderSkillsCategories();
        renderSoftwareMarquee();
        renderAbout();
        renderResume();
        renderServices();
        renderContact();
        renderFooter();
    }

    function renderHero() {
        if (elements.heroSubtitle && settings) {
            elements.heroSubtitle.textContent = settings.subtitle || settings.tagline || '';
        }

        const heroVideo = document.getElementById('hero-video');
        const heroSection = document.querySelector('.hero-section');
        const fallback = document.querySelector('.hero-gradient-fallback');
        
        if (!heroVideo) return;

        if (settings && settings.heroMedia) {
            const source = heroVideo.querySelector('source');
            if (source && source.src !== settings.heroMedia) {
                source.src = settings.heroMedia;
                heroVideo.load();
            }
            heroVideo.addEventListener('canplay', function onCanPlay() {
                if (heroSection) heroSection.classList.add('has-video-loaded');
                if (fallback) fallback.style.opacity = '0';
                heroVideo.removeEventListener('canplay', onCanPlay);
            });
            heroVideo.addEventListener('error', function onError() {
                if (heroSection) heroSection.classList.remove('has-video-loaded');
                if (fallback) fallback.style.opacity = '1';
                heroVideo.removeEventListener('error', onError);
            });
        } else {
            if (heroSection) heroSection.classList.remove('has-video-loaded');
            if (fallback) fallback.style.opacity = '1';
        }
    }

    function hasVideo(project) {
        return !!(project.video || project.vrVideo);
    }

    function hasImages(project) {
        if (project.coverImage || project.heroImage) return true;
        if (project.gallery && project.gallery.length > 0) return true;
        return false;
    }

    function renderProjects() {
        if (!elements.projectsContainer) return;

        if (!projects || projects.length === 0) {
            elements.projectsContainer.innerHTML = '';
            if (elements.projectsEmpty) {
                elements.projectsEmpty.classList.remove('hidden');
            }
            return;
        }

        if (elements.projectsEmpty) {
            elements.projectsEmpty.classList.add('hidden');
        }

        const activeCategory = elements.projectsContainer.dataset.activeCategory || '';
        let filtered = activeCategory ? projects.filter(p => p.categoryId === activeCategory) : projects;

        if (currentMediaType === 'images') {
            filtered = filtered.filter(p => hasImages(p));
        } else if (currentMediaType === 'videos') {
            filtered = filtered.filter(p => hasVideo(p));
        }

        const categoryMap = {};
        categories.forEach(cat => { categoryMap[cat.id] = cat.name; });

        elements.projectsContainer.innerHTML = filtered.map(project => {
            const tags = (project.software || []).slice(0, 3);
            const imageUrl = project.coverImage || project.heroImage || '/images/project-placeholder.svg';
            const categoryName = categoryMap[project.categoryId] || '';
            const videoClass = hasVideo(project) ? 'has-video' : '';
            const softwareHtml = (project.software || []).length > 0 
                ? '<div class="project-software">' + (project.software || []).slice(0, 2).join(' / ') + '</div>' 
                : '';
            const playIconHtml = hasVideo(project) ? '<div class="play-icon"></div>' : '';
            const responsibilitiesHtml = (project.responsibilities && project.responsibilities.length > 0)
                ? '<div class="project-tags">' + project.responsibilities.slice(0, 4).map(r => '<span class="tag">' + r + '</span>').join('') + '</div>'
                : '';

            return '<article class="project-card ' + videoClass + '" data-category="' + (project.categoryId || '') + '" data-id="' + (project.id || project.slug) + '">' +
                '<div class="project-image">' +
                '<img src="' + imageUrl + '" alt="' + project.title + '" loading="lazy">' +
                '<span class="project-category-badge">' + categoryName + '</span>' +
                playIconHtml +
                '<div class="project-overlay"><span class="view-project">View Project</span></div>' +
                '</div>' +
                '<div class="project-content">' +
                softwareHtml +
                '<h3 class="project-title">' + project.title + '</h3>' +
                '<p class="project-description">' + (project.description || '') + '</p>' +
                responsibilitiesHtml +
                '<div class="project-tags">' + tags.map(tag => '<span class="tag">' + tag + '</span>').join('') + '</div>' +
                '</div>' +
                '</article>';
        }).join('');

        setupProjectCardListeners();
    }

    function renderCategoryFilters() {
        const container = document.getElementById('category-filters');
        if (!container || !categories.length) return;

        let html = '<button class="category-filter active" data-category="">All</button>';
        categories.forEach(cat => {
            html += '<button class="category-filter" data-category="' + cat.id + '">' + cat.name + '</button>';
        });
        container.innerHTML = html;

        container.querySelectorAll('.category-filter').forEach(btn => {
            btn.addEventListener('click', () => {
                container.querySelectorAll('.category-filter').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const catId = btn.dataset.category;
                if (elements.projectsContainer) {
                    elements.projectsContainer.dataset.activeCategory = catId;
                }
                renderProjects();
            });
        });
    }

    function renderMediaFilters() {
        const container = document.getElementById('media-filters');
        if (!container) return;

        let html = '<button class="media-filter active" data-media="all">All</button>';
        html += '<button class="media-filter" data-media="images">Images</button>';
        html += '<button class="media-filter" data-media="videos">Videos</button>';
        container.innerHTML = html;

        container.querySelectorAll('.media-filter').forEach(btn => {
            btn.addEventListener('click', () => {
                container.querySelectorAll('.media-filter').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentMediaType = btn.dataset.media;
                renderProjects();
            });
        });
    }

    function setupProjectCardListeners() {
        document.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                const img = card.querySelector('img');
                const overlay = card.querySelector('.project-overlay');
                if (img) img.style.transform = 'scale(1.05)';
                if (overlay) overlay.style.opacity = '1';
            });

            card.addEventListener('mouseleave', () => {
                const img = card.querySelector('img');
                const overlay = card.querySelector('.project-overlay');
                if (img) img.style.transform = 'scale(1)';
                if (overlay) overlay.style.opacity = '0';
            });

            card.addEventListener('click', () => {
                const projectId = card.dataset.id;
                window.location.hash = 'project/' + projectId;
            });
        });
    }    function renderProcess() {
        if (!elements.processContainer) return;

        const processSteps = [
            { step: 1, title: 'Blockout', description: 'Greybox composition, scale, and flow' },
            { step: 2, title: 'Modeling', description: 'High-poly sculpt and low-poly optimization' },
            { step: 3, title: 'Materials', description: 'PBR texture channels and material layering' },
            { step: 4, title: 'Lighting', description: 'Cinematic lighting and atmospheric effects' }
        ];

        elements.processContainer.innerHTML = processSteps.map(step => {
            return '<div class="process-step" data-step="' + step.step + '">' +
                '<div class="process-number">' + step.step + '</div>' +
                '<h3 class="process-title">' + step.title + '</h3>' +
                '<p class="process-description">' + step.description + '</p>' +
                '</div>';
        }).join('');

        initProcessAnimations();
    }

    function renderSkills() {
        if (!elements.skillsContainer || !settings) return;

        try {
            const skills = settings.skills || [];
            if (!Array.isArray(skills)) {
                console.warn('[Render] settings.skills is not an array:', typeof skills);
                return;
            }
            elements.skillsContainer.innerHTML = skills.map(skill => {
                return '<span class="skill-tag">' + skill + '</span>';
            }).join('');

            initSkillsAnimations();
            renderAwards();
        } catch (err) {
            console.error('[Render] skills error:', err);
            errorLog('skills render error:', err);
            if (elements.skillsContainer) elements.skillsContainer.innerHTML = '';
            renderAwards();
        }
    }

    function renderAwards() {
        if (!elements.awardsList || !settings) return;

        try {
            const awards = settings.awards || [];
            if (!Array.isArray(awards)) {
                console.warn('[Render] settings.awards is not an array:', typeof awards);
                if (elements.awardsContainer) elements.awardsContainer.style.display = 'none';
                return;
            }
            if (awards.length === 0) {
                if (elements.awardsContainer) {
                    elements.awardsContainer.style.display = 'none';
                }
                return;
            }

            elements.awardsList.innerHTML = awards.map(award => {
                return '<div class="award-item"><span class="award-event">' + award.event + '</span><span class="award-achievement">' + award.achievement + '</span></div>';
            }).join('');
        } catch (err) {
            console.error('[Render] awards error:', err);
            errorLog('awards render error:', err);
            if (elements.awardsList) elements.awardsList.innerHTML = '';
        }
    }

    function renderAbout() {
        if (!settings) return;

        if (elements.aboutBio) {
            elements.aboutBio.textContent = settings.bio || '';
        }

        if (elements.aboutName) {
            elements.aboutName.textContent = settings.name || '';
        }

        if (elements.aboutImage && (settings.profileImage || settings.image || settings.heroImage)) {
            elements.aboutImage.src = settings.profileImage || settings.image || settings.heroImage;
            elements.aboutImage.style.display = 'block';
            const placeholder = document.querySelector('.about-placeholder');
            if (placeholder) placeholder.style.display = 'none';
        }

        if (elements.aboutTools) {
            try {
                let tools = settings.tools || [];
                if (typeof tools === 'string') {
                    tools = tools.split(',').map(t => t.trim()).filter(Boolean);
                }
                if (!Array.isArray(tools)) tools = [];
                elements.aboutTools.innerHTML = tools.map(tool => {
                    return '<span class="tool-tag">' + tool + '</span>';
                }).join('');
            } catch (err) {
                console.error('[Render] aboutTools error:', err);
                errorLog('aboutTools render error:', err);
                if (elements.aboutTools) elements.aboutTools.innerHTML = '';
            }
        }

        if (elements.educationContent && settings.education) {
            try {
                let education = settings.education;
                if (typeof education === 'string') {
                    education = JSON.parse(education);
                }
                if (Array.isArray(education)) {
                    elements.educationContent.innerHTML = education.map(edu => {
                        return '<div class="education-item">' +
                            '<div class="education-institution">' + edu.institution + '</div>' +
                            '<div class="education-degree">' + edu.degree + '</div>' +
                            '<div class="education-focus">' + edu.focus + '</div>' +
                            '<div class="education-specialization">' + edu.specialization + '</div>' +
                            '</div>';
                    }).join('');
                }
            } catch (err) {
                console.error('[Render] education error:', err);
                errorLog('education render error:', err);
                if (elements.educationContent) elements.educationContent.innerHTML = '';
            }
        }
    }

    function renderContact() {
        if (!settings) return;

        try {
            if (elements.contactEmail) {
                elements.contactEmail.textContent = settings.email || '';
                elements.contactEmail.href = 'mailto:' + (settings.email || '');
            }

            if (elements.contactPhone) {
                const phone = settings.phone || '';
                elements.contactPhone.textContent = phone;
                elements.contactPhone.href = 'tel:' + phone;
            }

            if (elements.contactLocation) {
                elements.contactLocation.textContent = settings.location || '';
            }

            if (elements.contactLinkedin) {
                elements.contactLinkedin.href = settings.linkedin || '#';
            }

            if (elements.contactSocials) {
                const socials = settings.socials || {};
                let socialsHtml = '';

                if (socials.linkedin) {
                    socialsHtml += '<a href="' + socials.linkedin + '" target="_blank" rel="noopener noreferrer" class="social-link social-linkedin">LinkedIn</a>';
                }
                if (socials.artstation) {
                    socialsHtml += '<a href="' + socials.artstation + '" target="_blank" rel="noopener noreferrer" class="social-link social-artstation">ArtStation</a>';
                }
                if (socials.twitter) {
                    socialsHtml += '<a href="' + socials.twitter + '" target="_blank" rel="noopener noreferrer" class="social-link social-twitter">Twitter</a>';
                }

                elements.contactSocials.innerHTML = socialsHtml;
            }
        } catch (err) {
            console.error('[Render] contact error:', err);
            errorLog('contact render error:', err);
        }
    }

    function renderFooter() {
        if (!elements.footerSocials || !settings) return;
        try {
            const socials = settings.socials || {};
            let html = '';
            if (socials.linkedin) {
                html += '<a href="' + socials.linkedin + '" target="_blank" rel="noopener noreferrer" class="social-link social-linkedin">LinkedIn</a>';
            }
            if (socials.artstation) {
                html += '<a href="' + socials.artstation + '" target="_blank" rel="noopener noreferrer" class="social-link social-artstation">ArtStation</a>';
            }
            elements.footerSocials.innerHTML = html;
        } catch (err) {
            console.error('[Render] footer error:', err);
            errorLog('footer render error:', err);
        }
    }

    function renderResume() {
        if (!settings) return;

        const resume = settings.resume || {};

        if (elements.resumeName) elements.resumeName.textContent = resume.name || settings.name || '';
        if (elements.resumeTitle) elements.resumeTitle.textContent = resume.title || settings.title || '';
        if (elements.resumeEmail) elements.resumeEmail.textContent = resume.email || settings.email || '';
        if (elements.resumeLocation) elements.resumeLocation.textContent = resume.location || '';

        if (elements.resumeSummary) {
            elements.resumeSummary.textContent = resume.summary || settings.bio || '';
        }

        if (elements.resumeExperienceList) {
            try {
                let experience = resume.experience || [];
                if (!Array.isArray(experience)) {
                    console.warn('[Render] resume.experience is not an array:', typeof experience);
                    experience = [];
                }
                elements.resumeExperienceList.innerHTML = experience.map(exp => {
                    return '<div class="resume-card">' +
                        '<div class="resume-item-header">' +
                        '<span class="resume-item-role">' + exp.role + '</span>' +
                        '<span class="resume-item-separator">@</span>' +
                        '<span class="resume-item-company">' + exp.company + '</span>' +
                        '</div>' +
                        '<span class="resume-item-period">' + exp.period + '</span>' +
                        '<p class="resume-item-description">' + (exp.description || '') + '</p>' +
                        '</div>';
                }).join('');
            } catch (err) {
                console.error('[Render] resumeExperience error:', err);
                errorLog('resumeExperience render error:', err);
                if (elements.resumeExperienceList) elements.resumeExperienceList.innerHTML = '';
            }
        }
    }

    function renderServices() {
        if (!settings || !elements.servicesContainer) return;

        try {
            const services = settings.services || [];
            if (!Array.isArray(services)) {
                console.warn('[Render] settings.services is not an array:', typeof services);
                return;
            }
            elements.servicesContainer.innerHTML = services.map(service => {
                return '<div class="service-card">' +
                    '<h3 class="service-title">' + service.title + '</h3>' +
                    '<p class="service-description">' + service.description + '</p>' +
                    '</div>';
            }).join('');
        } catch (err) {
            console.error('[Render] services error:', err);
            errorLog('services render error:', err);
            if (elements.servicesContainer) elements.servicesContainer.innerHTML = '';
        }
    }
    function initContactForm() {
        if (!elements.contactForm) return;

        elements.contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData);
            log('Contact form submitted:', data);
            alert('Thank you for your message! This is a demo - in production, this would send an email.');
            e.target.reset();
        });
    }

    function setupEventListeners() {
        window.addEventListener('scroll', throttle(() => onScroll(), 16), { passive: true });
        window.addEventListener('resize', debounce(() => onResize(), 150));
        document.addEventListener('click', (e) => handleClick(e));
        document.addEventListener('mousemove', throttle((e) => onMouseMove(e), 16));
        document.addEventListener('mouseleave', () => onMouseLeave());
        window.addEventListener('hashchange', () => handleRouteChange());
    }

    function setupIntersectionObserver() {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const animateOnScroll = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.animate-on-scroll').forEach(el => animateOnScroll.observe(el));
        observers.push(animateOnScroll);
    }

    function onScroll() {
        updateActiveNavLink();
        updateNavStyle();
        updateScrollProgress();
        updateParallax();
    }

    function onResize() {
        if (isMenuOpen && window.innerWidth > 768) {
            toggleMobileMenu();
        }
    }

    function onMouseMove(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (elements.cursor) {
            elements.cursor.style.transform = 'translate3d(' + e.clientX + 'px, ' + e.clientY + 'px, 0)';
        }
        if (elements.cursorDot) {
            elements.cursorDot.style.transform = 'translate3d(' + e.clientX + 'px, ' + e.clientY + 'px, 0)';
        }
    }

    function onMouseLeave() {
        mouseX = -1000;
        mouseY = -1000;
        if (elements.cursor) elements.cursor.style.opacity = '0';
        if (elements.cursorDot) elements.cursorDot.style.opacity = '0';
    }

    function handleClick(e) {
        const navLink = e.target.closest('.nav-link');
        if (navLink) {
            e.preventDefault();
            const targetId = navLink.getAttribute('href');
            smoothScrollTo(targetId);
            if (isMenuOpen) toggleMobileMenu();
        }

        const mobileLink = e.target.closest('.mobile-link');
        if (mobileLink) {
            e.preventDefault();
            const targetId = mobileLink.getAttribute('href');
            smoothScrollTo(targetId);
            if (isMenuOpen) toggleMobileMenu();
        }
    }

    function smoothScrollTo(targetId) {
        const target = document.querySelector(targetId);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + window.innerHeight / 3;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                if (elements.navLinks) {
                    elements.navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === '#' + sectionId) {
                            link.classList.add('active');
                        }
                    });
                }
            }
        });
    }

    function updateNavStyle() {
        if (elements.nav) {
            if (window.scrollY > 50) {
                elements.nav.classList.add('scrolled');
            } else {
                elements.nav.classList.remove('scrolled');
            }
        }
    }

    function updateScrollProgress() {
        if (elements.scrollProgress) {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (scrollTop / docHeight) * 100;
            elements.scrollProgress.style.width = progress + '%';
        }
    }
    function initCursor() {
        if (!elements.cursor || !elements.cursorDot) return;

        document.querySelectorAll('a, button, .project-card, .skill-tag, .process-step').forEach(el => {
            el.addEventListener('mouseenter', () => {
                elements.cursor.classList.add('hover');
                elements.cursorDot.classList.add('hover');
            });
            el.addEventListener('mouseleave', () => {
                elements.cursor.classList.remove('hover');
                elements.cursorDot.classList.remove('hover');
            });
        });

        elements.cursor.style.opacity = '1';
        elements.cursorDot.style.opacity = '1';
    }

    function initParticles() {
        if (!elements.particles) return function(){};
        const canvas = document.createElement('canvas');
        elements.particles.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        const particleCount = 80;
        let animationId;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        class Particle {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.4;
                this.speedY = (Math.random() - 0.5) * 0.4;
                this.opacity = Math.random() * 0.5 + 0.2;
                this.baseOpacity = this.opacity;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.x > canvas.width) this.x = 0;
                if (this.x < 0) this.x = canvas.width;
                if (this.y > canvas.height) this.y = 0;
                if (this.y < 0) this.y = canvas.height;

                const dx = this.x - mouseX;
                const dy = this.y - mouseY;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 200 && dist > 0) {
                    const force = (200 - dist) / 200;
                    this.x += (dx / dist) * force * 2;
                    this.y += (dy / dist) * force * 2;
                    this.opacity = Math.min(1, this.baseOpacity + force * 0.5);
                } else {
                    this.opacity = this.baseOpacity;
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(0, 240, 255, ' + this.opacity + ')';
                ctx.fill();
                ctx.shadowBlur = 10;
                ctx.shadowColor = 'rgba(0, 240, 255, ' + (this.opacity * 0.5) + ')';
            }
        }

        const particleArray = [];
        for (let i = 0; i < particleCount; i++) {
            particleArray.push(new Particle());
        }

        const connectParticles = () => {
            for (let i = 0; i < particleArray.length; i++) {
                for (let j = i + 1; j < particleArray.length; j++) {
                    const dx = particleArray[i].x - particleArray[j].x;
                    const dy = particleArray[i].y - particleArray[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    const maxDist = 150;
                    
                    if (dist < maxDist) {
                        const opacity = (1 - dist / maxDist) * 0.25;
                        ctx.beginPath();
                        ctx.strokeStyle = 'rgba(0, 240, 255, ' + opacity + ')';
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particleArray[i].x, particleArray[i].y);
                        ctx.lineTo(particleArray[j].x, particleArray[j].y);
                        ctx.stroke();
                    }
                }
            }
        };

        const animateParticles = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particleArray.forEach(particle => {
                particle.update();
                particle.draw();
            });
            connectParticles();
            animationId = requestAnimationFrame(animateParticles);
        };

        animateParticles();

        return function cleanup() {
            cancelAnimationFrame(animationId);
            window.removeEventListener('resize', resizeCanvas);
        };
    }

    function initScrollProgress() {
        if (elements.scrollProgress) {
            elements.scrollProgress.style.background = 'linear-gradient(90deg, #2563eb, #3b82f6, #93c5fd)';
            elements.scrollProgress.style.transition = 'width 0.1s ease-out';
        }
    }

    function initHeroAnimation() {
        if (!elements.heroTitle) return;

        const content = document.getElementById('hero-content');
        if (content) {
            content.style.opacity = '1';
            content.style.transform = 'translate3d(0, 0, 0)';
            content.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        }

        const scrollIndicator = document.getElementById('scroll-indicator');
        if (scrollIndicator) {
            scrollIndicator.style.opacity = '1';
            scrollIndicator.style.transition = 'opacity 0.5s ease';
        }
    }

    function initStickyNav() {
        if (elements.nav) {
            elements.nav.style.transition = 'all 0.3s ease';
        }
    }

    function initMobileMenu() {
        if (elements.hamburger && elements.mobileMenu) {
            elements.hamburger.addEventListener('click', () => toggleMobileMenu());
        }
    }

    function toggleMobileMenu() {
        isMenuOpen = !isMenuOpen;

        if (elements.hamburger) {
            const menuIcon = document.getElementById('menu-icon');
            const closeIcon = document.getElementById('close-icon');
            if (isMenuOpen) {
                elements.hamburger.classList.add('active');
                if (menuIcon) menuIcon.classList.add('hidden');
                if (closeIcon) closeIcon.classList.remove('hidden');
            } else {
                elements.hamburger.classList.remove('active');
                if (menuIcon) menuIcon.classList.remove('hidden');
                if (closeIcon) closeIcon.classList.add('hidden');
            }
        }

        if (elements.mobileMenu) {
            if (isMenuOpen) {
                elements.mobileMenu.classList.add('active');
                elements.mobileMenu.style.transform = 'translate3d(0, 0, 0)';
                elements.mobileMenu.style.opacity = '1';
            } else {
                elements.mobileMenu.classList.remove('active');
                elements.mobileMenu.style.transform = 'translate3d(100%, 0, 0)';
                elements.mobileMenu.style.opacity = '0';
            }
        }
    }

    function renderSkillsCategories() {
        if (!elements.skillsCategories || !settings) return;

        const categories = {
            'Environment Modeling': ['Blockout', 'High-poly sculpt', 'Low-poly optimization', 'Retopology', 'UV mapping'],
            'Hard Surface Modeling': ['Prop modeling', 'Mechanical assets', 'Kit-bashing', 'Boolean operations'],
            'Asset Creation': ['Game-ready assets', 'PBR textures', 'Material layering', 'Decals'],
            'Texturing': ['Substance Painter', 'Substance Designer', 'Hand-painting', 'Texture baking'],
            'Lighting': ['UE5 Lighting', 'Cinematic lighting', 'Atmospheric effects', 'HDRI setup'],
            'Rendering': ['Arnold', 'V-Ray', 'Marmoset', 'Real-time rendering']
        };

        let html = '';
        for (const [title, items] of Object.entries(categories)) {
            html += '<div class="skill-category">' +
                '<h3 class="skill-category-title">' + title + '</h3>' +
                '<div class="skill-category-list">' +
                items.map(item => '<span class="skill-category-item">' + item + '</span>').join('') +
                '</div></div>';
        }
        elements.skillsCategories.innerHTML = html;
    }

    function renderSoftwareMarquee() {
        if (!elements.softwareMarquee) return;

        var software = [];
        if (window.softwareData && Array.isArray(window.softwareData)) {
            software = window.softwareData.filter(function(s) { return s.isActive; });
        }
        if (software.length === 0 && settings && settings.resume && Array.isArray(settings.resume.software)) {
            software = settings.resume.software.map(function(name) {
                return { name: name, category: name, icon: '', isActive: true, sortOrder: 0 };
            });
        }
        software.sort(function(a, b) { return (a.sortOrder || 0) - (b.sortOrder || 0); });

        if (software.length === 0) {
            elements.softwareMarquee.innerHTML = '<p style="text-align:center;color:#6b7280;font-size:14px;padding:40px;">No software configured yet.</p>';
            return;
        }

        var renderItem = function(s) {
            var iconHtml = s.icon
                ? '<img src="' + s.icon + '" alt="' + escapeHtml(s.name) + '" class="marquee-item-icon" loading="lazy">'
                : '<div class="marquee-item-icon" style="display:flex;align-items:center;justify-content:center;font-size:11px;color:#6b7280;background:rgba(255,255,255,0.05);border-radius:8px;">' + (s.name.charAt(0) || '?') + '</div>';
            return '<div class="marquee-item">' +
                iconHtml +
                '<span class="marquee-item-name">' + escapeHtml(s.name) + '</span>' +
                '<span class="marquee-item-category">' + escapeHtml(s.category || '') + '</span>' +
                '</div>';
        };

        var itemsHtml = software.map(renderItem).join('');
        elements.softwareMarquee.innerHTML = itemsHtml + itemsHtml;
    }

    function initResumeAnimations() {
        const resumeSection = document.getElementById('resume');
        if (!resumeSection) return;

        const animatedEls = resumeSection.querySelectorAll('.resume-section-animate, .resume-card');
        if (!animatedEls.length) return;

        animatedEls.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translate3d(0, 20px, 0)';
            el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        });

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const parent = entry.target;
                    const stagger = parseInt(parent.dataset.animateStagger || '100', 10);
                    const children = parent.querySelectorAll(':scope > .resume-card, :scope > .resume-section-animate');

                    if (children.length > 0) {
                        children.forEach((child, index) => {
                            setTimeout(() => {
                                child.style.opacity = '1';
                                child.style.transform = 'translate3d(0, 0, 0)';
                            }, index * stagger);
                        });
                    } else {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translate3d(0, 0, 0)';
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        animatedEls.forEach(el => observer.observe(el));
        observers.push(observer);
    }

    function initSkillsAnimations() {
        const container = document.getElementById('skills-container');
        if (!container) return;

        const skills = container.querySelectorAll('.skill-tag');
        skills.forEach(skill => {
            skill.style.opacity = '0';
            skill.style.transform = 'translate3d(0, 20px, 0)';
            skill.style.transition = 'all 0.3s ease';
        });

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    skills.forEach((skill, index) => {
                        setTimeout(() => {
                            skill.style.opacity = '1';
                            skill.style.transform = 'translate3d(0, 0, 0)';
                        }, index * 50);
                    });
                    observer.disconnect();
                }
            });
        }, { threshold: 0.5 });

        observer.observe(container);
        observers.push(observer);
    }

    function initAwardsAnimations() {
        const awardsSection = document.getElementById('awards');
        if (!awardsSection) return;

        const awardItems = awardsSection.querySelectorAll('.award-item');
        if (!awardItems.length) return;

        awardItems.forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translate3d(0, 20px, 0)';
            item.style.transition = 'all 0.5s ease-out';
        });

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    awardItems.forEach((item, index) => {
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'translate3d(0, 0, 0)';
                        }, index * 100);
                    });
                    observer.disconnect();
                }
            });
        }, { threshold: 0.2 });

        observer.observe(awardsSection);
        observers.push(observer);
    }

    function initProcessAnimations() {
        const steps = document.querySelectorAll('.process-step');
        if (!steps.length) return;

        steps.forEach(step => {
            step.style.opacity = '0';
            step.style.transform = 'translate3d(0, 30px, 0)';
            step.style.transition = 'all 0.5s ease';
        });

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    steps.forEach((step, index) => {
                        setTimeout(() => {
                            step.style.opacity = '1';
                            step.style.transform = 'translate3d(0, 0, 0)';
                        }, index * 150);
                    });
                }
            });
        }, { threshold: 0.3 });

        steps.forEach(step => observer.observe(step));
        observers.push(observer);
    }
    function updateParallax() {
        if (!parallaxElements || !parallaxElements.length) return;

        parallaxElements.forEach(el => {
            const speed = parseFloat(el.dataset.parallax) || 0.5;
            const rect = el.getBoundingClientRect();
            const centerY = rect.top + rect.height / 2;
            const offset = (window.innerHeight / 2 - centerY) * speed;

            el.style.transform = 'translate3d(0, ' + offset + 'px, 0)';
        });
    }

    function initRouter() {
        handleRouteChange();
    }

    function handleRouteChange() {
        const hash = window.location.hash.slice(1);
        if (hash.startsWith('project/')) {
            const projectId = decodeURIComponent(hash.split('/')[1] || '');
            showProjectDetail(projectId);
        }
    }

    function buildProjectImages(project) {
        var images = [];
        var seen = {};
        var cover = project.coverImage || project.heroImage || '';
        if (cover) {
            images.push(cover);
            seen[cover] = true;
        }
        if (project.heroImage && !seen[project.heroImage]) {
            images.push(project.heroImage);
            seen[project.heroImage] = true;
        }
        if (project.gallery && Array.isArray(project.gallery)) {
            project.gallery.forEach(function(url) {
                if (url && !seen[url]) {
                    images.push(url);
                    seen[url] = true;
                }
            });
        }
        return images;
    }

    function showProjectDetail(projectId) {
        var project = projects.find(function(p) { return (p.id === projectId || p.slug === projectId); });
        if (!project) return;

        var modal = document.getElementById('project-detail-modal');
        if (!modal) return;

        var images = buildProjectImages(project);
        var coverImage = images.length > 0 ? images[0] : '';

        var html = '';

        html += '<div class="project-detail-tab-content active" data-tab-content="images">';
        if (coverImage) {
            html += '<div class="project-detail-hero-wrapper">';
            html += '<img class="project-detail-hero-image" src="' + coverImage + '" alt="' + project.title + '">';
            html += '</div>';
        }
        if (images.length > 1) {
            html += '<div class="project-detail-thumbnails-strip">';
            images.forEach(function(url, idx) {
                var activeClass = idx === 0 ? ' project-detail-thumb-active' : '';
                html += '<img class="project-detail-thumb' + activeClass + '" src="' + url + '" alt="Thumbnail ' + (idx + 1) + '" data-index="' + idx + '" data-url="' + url + '">';
            });
            html += '</div>';
        }
        html += '</div>';

        html += '<div class="project-detail-tab-content" data-tab-content="videos">';
        if (project.video) {
            html += '<video controls class="project-detail-video-player"><source src="' + project.video + '" type="video/mp4"></video>';
        }
        if (project.vrVideo) {
            html += '<video controls class="project-detail-video-player"><source src="' + project.vrVideo + '" type="video/mp4"></video>';
        }
        if (!project.video && !project.vrVideo) {
            html += '<p style="color:var(--text-muted);padding:20px;">No videos available.</p>';
        }
        html += '</div>';

        html += '<div class="project-detail-tabs">';
        html += '<button class="project-detail-tab active" data-tab="images">Images</button>';
        html += '<button class="project-detail-tab" data-tab="videos">Videos</button>';
        html += '</div>';

        html += '<div class="project-detail-info">';
        html += '<h2 class="project-detail-title">' + project.title + '</h2>';
        html += '<p class="project-detail-description">' + (project.description || '') + '</p>';
        if (project.responsibilities && project.responsibilities.length > 0) {
            html += '<div class="project-detail-tags">' + project.responsibilities.map(function(tag) { return '<span class="tag">' + tag + '</span>'; }).join('') + '</div>';
        }
        html += '<div class="project-detail-tags">' + (project.software || []).map(function(tag) { return '<span class="tag">' + tag + '</span>'; }).join('') + '</div>';
        html += '</div>';

        var content = modal.querySelector('.project-detail-content');
        content.innerHTML = html;

        content.querySelectorAll('.project-detail-tab').forEach(function(tab) {
            tab.addEventListener('click', function() {
                content.querySelectorAll('.project-detail-tab').forEach(function(t) { t.classList.remove('active'); });
                tab.classList.add('active');
                var tabName = tab.dataset.tab;
                content.querySelectorAll('.project-detail-tab-content').forEach(function(c) { c.classList.remove('active'); });
                var target = content.querySelector('[data-tab-content="' + tabName + '"]');
                if (target) target.classList.add('active');
            });
        });

        var heroImg = content.querySelector('.project-detail-hero-image');
        content.querySelectorAll('.project-detail-thumb').forEach(function(thumb) {
            thumb.addEventListener('click', function(e) {
                e.stopPropagation();
                var newUrl = thumb.dataset.url;
                if (heroImg && newUrl) {
                    heroImg.src = newUrl;
                }
                content.querySelectorAll('.project-detail-thumb').forEach(function(t) { t.classList.remove('project-detail-thumb-active'); });
                thumb.classList.add('project-detail-thumb-active');
            });
        });

        var closeBtn = modal.querySelector('.project-detail-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                modal.style.opacity = '0';
                modal.style.transform = 'scale(0.95)';
                setTimeout(function() {
                    modal.style.display = 'none';
                    modal.style.opacity = '1';
                    modal.style.transform = 'scale(1)';
                    var heroWrapper = modal.querySelector('.project-detail-hero-wrapper');
                    if (heroWrapper) heroWrapper.innerHTML = '';
                }, 300);
            });
        }

        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.opacity = '0';
                modal.style.transform = 'scale(0.95)';
                setTimeout(function() {
                    modal.style.display = 'none';
                    modal.style.opacity = '1';
                    modal.style.transform = 'scale(1)';
                    var heroWrapper = modal.querySelector('.project-detail-hero-wrapper');
                    if (heroWrapper) heroWrapper.innerHTML = '';
                }, 300);
            }
        });

        function onEscKey(e) {
            if (e.key === 'Escape') {
                modal.style.opacity = '0';
                modal.style.transform = 'scale(0.95)';
                setTimeout(function() {
                    modal.style.display = 'none';
                    modal.style.opacity = '1';
                    modal.style.transform = 'scale(1)';
                    var heroWrapper = modal.querySelector('.project-detail-hero-wrapper');
                    if (heroWrapper) heroWrapper.innerHTML = '';
                }, 300);
                document.removeEventListener('keydown', onEscKey);
            }
        }
        document.addEventListener('keydown', onEscKey);

        modal.style.display = 'flex';
        modal.style.opacity = '0';
        modal.style.transform = 'scale(0.95)';
        requestAnimationFrame(function() {
            modal.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            modal.style.opacity = '1';
            modal.style.transform = 'scale(1)';
        });
    }
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
        return function executedFunction(...args) {
            if (!inThrottle) {
                func(...args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    async function init() {
        console.log('[App] init() started');
        log('Starting app init...');

        try {
            elements = getElements();
            console.log('[App] Elements cached');
            log('Elements cached');

            setupEventListeners();
            console.log('[App] Event listeners setup');
            log('Event listeners setup');

            setupIntersectionObserver();
            console.log('[App] Intersection observer setup');
            log('Intersection observer setup');

            await loadData();
            console.log('[App] Data loaded');
            log('Data loaded');

            initRouter();
            console.log('[App] Router initialized');
            log('Router initialized');

            initCursor();
            console.log('[App] Cursor initialized');
            log('Cursor initialized');

            const particleCleanup = initParticles();
            console.log('[App] Particles initialized');
            log('Particles initialized');

            initScrollProgress();
            console.log('[App] Scroll progress initialized');
            log('Scroll progress initialized');

            initHeroAnimation();
            console.log('[App] Hero animation initialized');
            log('Hero animation initialized');

            initStickyNav();
            console.log('[App] Sticky nav initialized');
            log('Sticky nav initialized');

            initMobileMenu();
            console.log('[App] Mobile menu initialized');
            log('Mobile menu initialized');

            initSkillsAnimations();
            console.log('[App] Skills animations initialized');
            log('Skills animations initialized');

            initAwardsAnimations();
            console.log('[App] Awards animations initialized');
            log('Awards animations initialized');

            initResumeAnimations();
            console.log('[App] Resume animations initialized');
            log('Resume animations initialized');

            initContactForm();
            console.log('[App] Contact form initialized');
            log('Contact form initialized');

            parallaxElements = document.querySelectorAll('[data-parallax]');
            console.log('[App] Parallax elements captured');
            log('Parallax elements captured');

            console.log('[App] Init complete');
            log('Init complete');
        } catch (error) {
            console.error('[App] Init error:', error);
            errorLog('Init error:', error);
        } finally {
            console.log('[App] finally block executing');
            hideLoader();
            console.log('[App] Loader hidden');
            log('Loader hidden');
        }
    }
    window.addEventListener('error', function(e) {
        console.error('[App] Global error:', e.message, 'at', e.filename + ':' + e.lineno);
        const loader = document.getElementById('loader');
        if (loader && !loader.classList.contains('hidden')) {
            loader.classList.add('hidden');
        }
    });

    window.addEventListener('unhandledrejection', function(e) {
        console.error('[App] Unhandled promise rejection:', e.reason);
        const loader = document.getElementById('loader');
        if (loader && !loader.classList.contains('hidden')) {
            loader.classList.add('hidden');
        }
    });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            init().catch(function(err) {
                console.error('[App] init() promise rejected:', err);
            });
        });
    } else {
        init().catch(function(err) {
            console.error('[App] init() promise rejected:', err);
        });
    }

    setTimeout(function() {
        const loader = document.getElementById('loader');
        if (loader && !loader.classList.contains('hidden')) {
            console.warn('[App] Safety net: forcing loader hide after timeout');
            loader.classList.add('hidden');
            setTimeout(function() { if (loader) loader.style.display = 'none'; }, 700);
        }
    }, 5000);
})();

