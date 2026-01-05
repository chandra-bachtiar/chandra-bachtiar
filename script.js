document.addEventListener('DOMContentLoaded', () => {

    // Canvas Background Animation
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');

    let width, height;
    let particles = [];

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 2 + 1;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0) this.x = width;
            if (this.x > width) this.x = 0;
            if (this.y < 0) this.y = height;
            if (this.y > height) this.y = 0;
        }

        draw() {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        const particleCount = Math.floor(window.innerWidth / 10);
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    initParticles();

    function animateParticles() {
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();

            for (let j = i; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 - distance / 1000})`;
                    ctx.lineWidth = 1;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(animateParticles);
    }

    animateParticles();

    // Custom Cursor logic
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    if (window.matchMedia("(pointer: fine)").matches) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: "forwards" });
        });

        // Add hover effects for cursor
        document.querySelectorAll('a, button, input, textarea, .project-card').forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.5)';
                cursorOutline.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            });
            el.addEventListener('mouseleave', () => {
                cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
                cursorOutline.style.backgroundColor = 'transparent';
            });
        });
    }

    // Scroll active link highlighting
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-menu a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // Reveal animations on scroll
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Apply animation start state to elements
    const fadeElements = document.querySelectorAll('.project-card, .timeline-item, .stat-card, .section-title, .lead');
    fadeElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });

    // Form Handling (Simulation)
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button');
            const originalText = btn.innerText;

            btn.innerText = 'Sending...';
            btn.style.opacity = '0.7';

            setTimeout(() => {
                btn.innerText = 'Message Sent!';
                btn.style.backgroundColor = '#4ade80'; // Green success
                btn.style.color = '#000';
                contactForm.reset();

                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.style.backgroundColor = '';
                    btn.style.color = '';
                    btn.style.opacity = '1';
                }, 3000);
            }, 1500);
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Menu Toggle Logic
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const navItems = document.querySelectorAll('.nav-menu a');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            if (sidebar.classList.contains('active')) {
                icon.classList.remove('ri-menu-4-line');
                icon.classList.add('ri-close-line');
            } else {
                icon.classList.remove('ri-close-line');
                icon.classList.add('ri-menu-4-line');
            }
        });
    }

    // Close menu when clicking a link
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            if (window.innerWidth <= 1024) {
                sidebar.classList.remove('active');
                if (menuToggle) {
                    const icon = menuToggle.querySelector('i');
                    icon.classList.remove('ri-close-line');
                    icon.classList.add('ri-menu-4-line');
                }
            }
        });
    });

    // Language Handling
    const translations = {
    en: {
        name: "Chandra Bachtiar",
        role: "Senior Fullstack Developer | n8n Business Automation",
        tagline: "Building Solutions, Beyond Applications.",
        nav_home: "Home",
        nav_about: "About",
        nav_experience: "Track Record",
        nav_projects: "Work",
        nav_contact: "Contact",
        hero_title1: "Building Solutions,",
        hero_title2: "Beyond Applications.",
        hero_subtitle: "Delivering custom systems designed to solve real business problems.",
        btn_view_work: "View Case Studies",
        btn_lets_talk: "Let's Discuss",
        section_about: "The Architect",
        about_desc: "With 8+ years navigating the tech landscape, I don't just write code. I engineer automated ecosystems. Bridging complex backend logic with intuitive design to help businesses scale effortlessly.",
        stat_exp: "Years Experience",
        stat_projects: "Systems Built",
        stat_clients: "Business Partners",
        tech_title: "Tech Stack",
        section_experience: "Professional Journey",
        exp1_role: "Senior Lead Developer",
        exp1_desc: "Led a squad of 12 devs, orchestrating the migration of legacy monoliths into scalable microservices. Boosted system uptime to 99.9% reliability.",
        exp2_role: "Fullstack Developer",
        exp2_desc: "Engineered high-performance e-commerce engines. Optimized CI/CD pipelines, slashing deployment times by 40%.",
        exp3_role: "Frontend Developer",
        exp3_desc: "Partnered with design teams to craft pixel-perfect, interactive UIs using React and WebGL.",
        section_projects: "Selected Case Studies",
        proj1_desc: "Real-time financial analytics dashboard with complex data visualization.",
        proj2_desc: "Progressive Web App (PWA) for a fashion brand, optimized for offline performance.",
        proj3_desc: "AI-driven SaaS platform integrating OpenAI for automated content generation.",
        section_contact: "Start the Transformation",
        form_name: "Name",
        form_email: "Business Email",
        form_message: "Tell me about your challenge...",
        form_send: "Send Inquiry",
        contact_heading: "Ready to automate your growth?",
        contact_sub: "Available for strategic consulting and custom development."
    },
    id: {
        name: "Chandra Bachtiar",
        role: "Senior Fullstack Developer | Otomasi Bisnis n8n",
        tagline: "Membangun Solusi, Bukan Sekadar Aplikasi.",
        nav_home: "Beranda",
        nav_about: "Tentang",
        nav_experience: "Jejak Karir",
        nav_projects: "Portofolio",
        nav_contact: "Kontak",
        hero_title1: "Membangun Solusi,",
        hero_title2: "Bukan Sekadar Aplikasi.",
        hero_subtitle: "Menghadirkan sistem kustom untuk memecahkan masalah bisnis yang nyata.",
        btn_view_work: "Lihat Studi Kasus",
        btn_lets_talk: "Diskusi Project",
        section_about: "Tentang Saya",
        about_desc: "8+ tahun berkecimpung di dunia tech, saya tidak hanya menulis kode, tapi membangun ekosistem digital. Menggabungkan logika backend yang rumit dengan desain intuitif agar bisnis Anda bisa berjalan otomatis.",
        stat_exp: "Tahun Pengalaman",
        stat_projects: "Sistem Dibangun",
        stat_clients: "Partner Bisnis",
        tech_title: "Teknologi",
        section_experience: "Pengalaman Profesional",
        exp1_role: "Senior Lead Developer",
        exp1_desc: "Memimpin tim 12 developer, melakukan re-write sistem legacy monolith menjadi microservices. Meningkatkan stabilitas uptime hingga 99,9%.",
        exp2_role: "Fullstack Developer",
        exp2_desc: "Membangun platform e-commerce performa tinggi. Optimasi pipeline CI/CD yang memangkas waktu deployment hingga 40%.",
        exp3_role: "Frontend Developer",
        exp3_desc: "Berkolaborasi dengan desainer untuk menciptakan UI yang pixel-perfect menggunakan React dan WebGL.",
        section_projects: "Karya Pilihan",
        proj1_desc: "Dashboard analitik keuangan real-time dengan visualisasi data kompleks.",
        proj2_desc: "Aplikasi PWA untuk brand fashion, tetap jalan lancar meski offline.",
        proj3_desc: "Platform SaaS berbasis AI, integrasi OpenAI untuk automasi konten.",
        section_contact: "Hubungi Saya",
        form_name: "Nama",
        form_email: "Email Bisnis",
        form_message: "Ceritakan kebutuhan Anda...",
        form_send: "Kirim Pesan",
        contact_heading: "Siap menaikkan level bisnis Anda?",
        contact_sub: "Terbuka untuk konsultasi strategi dan pengembangan sistem custom."
    }
};

    let currentLang = 'en';
    const langToggleBtn = document.getElementById('lang-toggle');
    const langTexts = langToggleBtn.querySelectorAll('.lang-text');

    function updateLanguage(lang) {
        currentLang = lang;
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang][key]) {
                el.innerText = translations[lang][key];
            }
        });

        langTexts.forEach(span => {
            span.classList.remove('active');
            if (span.innerText.toLowerCase() === lang) {
                span.classList.add('active');
            }
        });
    }

    if (langToggleBtn) {
        langToggleBtn.addEventListener('click', () => {
            const newLang = currentLang === 'en' ? 'id' : 'en';
            updateLanguage(newLang);
        });
    }

});
