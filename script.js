document.addEventListener("DOMContentLoaded", () => {
    const sidebar = document.querySelector(".sidebar");
    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks = [...document.querySelectorAll(".nav-menu a")];
    const sections = [...document.querySelectorAll("section[id]")];

    const setMenuState = (open) => {
        if (!sidebar || !menuToggle) return;
        sidebar.classList.toggle("active", open);
        const icon = menuToggle.querySelector("i");
        if (!icon) return;
        icon.classList.toggle("ri-menu-4-line", !open);
        icon.classList.toggle("ri-close-line", open);
    };

    if (menuToggle) {
        menuToggle.addEventListener("click", () => {
            setMenuState(!sidebar.classList.contains("active"));
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", (event) => {
            const target = document.querySelector(anchor.getAttribute("href"));
            if (!target) return;
            event.preventDefault();
            target.scrollIntoView({ behavior: "smooth" });
            if (window.innerWidth <= 1024) setMenuState(false);
        });
    });

    const updateActiveLink = () => {
        const marker = window.scrollY + window.innerHeight * 0.35;
        let current = sections[0]?.id || "home";
        sections.forEach((section) => {
            if (marker >= section.offsetTop) current = section.id;
        });
        navLinks.forEach((link) => {
            link.classList.toggle("active", link.getAttribute("href") === `#${current}`);
        });
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) entry.target.classList.add("visible");
        });
    }, { threshold: 0.12 });
    document.querySelectorAll(".reveal").forEach((element, index) => {
        element.style.transitionDelay = `${(index % 4) * 70}ms`;
        observer.observe(element);
    });

    const canvas = document.getElementById("bg-canvas");
    const ctx = canvas.getContext("2d");
    let width = 0;
    let height = 0;
    let particles = [];

    const resizeCanvas = () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        const count = Math.min(90, Math.max(36, Math.floor(window.innerWidth / 18)));
        particles = Array.from({ length: count }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.35,
            vy: (Math.random() - 0.5) * 0.35,
            r: Math.random() * 2 + 0.8
        }));
    };

    const drawCanvas = () => {
        ctx.clearRect(0, 0, width, height);
        particles.forEach((particle, index) => {
            particle.x = (particle.x + particle.vx + width) % width;
            particle.y = (particle.y + particle.vy + height) % height;
            ctx.fillStyle = "rgba(255, 216, 155, 0.2)";
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
            ctx.fill();

            for (let i = index + 1; i < particles.length; i += 1) {
                const other = particles[i];
                const dx = particle.x - other.x;
                const dy = particle.y - other.y;
                const distance = Math.hypot(dx, dy);
                if (distance < 110) {
                    ctx.strokeStyle = `rgba(123, 224, 191, ${0.16 - distance / 900})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particle.x, particle.y);
                    ctx.lineTo(other.x, other.y);
                    ctx.stroke();
                }
            }
        });
        requestAnimationFrame(drawCanvas);
    };

    resizeCanvas();
    drawCanvas();

    const cursorDot = document.querySelector(".cursor-dot");
    const cursorOutline = document.querySelector(".cursor-outline");
    const heroVisual = document.querySelector(".hero-visual");
    const portraitShell = document.querySelector(".portrait-shell");
    const impactCard = document.querySelector(".impact-card");
    const floatingNote = document.querySelector(".floating-note");
    if (window.matchMedia("(pointer: fine)").matches) {
        window.addEventListener("mousemove", (event) => {
            cursorDot.style.left = `${event.clientX}px`;
            cursorDot.style.top = `${event.clientY}px`;
            cursorOutline.animate({ left: `${event.clientX}px`, top: `${event.clientY}px` }, { duration: 280, fill: "forwards" });
        });

        document.addEventListener("mouseover", (event) => {
            if (event.target.closest("a, button, .project-card, .trust-card, .contact-card, .timeline-item")) {
                cursorOutline.style.transform = "translate(-50%, -50%) scale(1.45)";
                cursorOutline.style.backgroundColor = "rgba(255, 181, 71, 0.08)";
            }
        });

        document.addEventListener("mouseout", () => {
            cursorOutline.style.transform = "translate(-50%, -50%) scale(1)";
            cursorOutline.style.backgroundColor = "transparent";
        });

        if (heroVisual && portraitShell && impactCard && floatingNote) {
            heroVisual.addEventListener("mousemove", (event) => {
                const rect = heroVisual.getBoundingClientRect();
                const x = (event.clientX - rect.left) / rect.width - 0.5;
                const y = (event.clientY - rect.top) / rect.height - 0.5;

                portraitShell.style.transform = `translate3d(${x * 10}px, ${y * 10}px, 0) rotateX(${y * -4}deg) rotateY(${x * 5}deg)`;
                impactCard.style.transform = `translate3d(${x * -12}px, ${y * -10}px, 0)`;
                floatingNote.style.transform = `translate3d(${x * 12}px, ${y * 10}px, 0)`;
            });

            heroVisual.addEventListener("mouseleave", () => {
                portraitShell.style.transform = "";
                impactCard.style.transform = "";
                floatingNote.style.transform = "";
            });
        }
    }

    window.addEventListener("scroll", updateActiveLink, { passive: true });
    window.addEventListener("resize", () => {
        resizeCanvas();
        updateActiveLink();
        if (window.innerWidth > 1024) setMenuState(false);
    });

    updateActiveLink();
});
