/* ============================================================
   Showmaker Portfolio — Interactive Scripts
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initSidebar();
    initScrollReveal();
    initProjectFilter();
    initScrollHint();
    initContactForm();
    initSmoothScroll();
});

// ==================== 粒子背景 ====================
function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener('resize', resize);

    // 创建粒子
    const PARTICLE_COUNT = 60;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            r: Math.random() * 2 + 0.5,
            opacity: Math.random() * 0.4 + 0.1,
        });
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(p => {
            // 更新位置
            p.x += p.vx;
            p.y += p.vy;

            // 边界回弹
            if (p.x < 0) p.x = canvas.width;
            if (p.x > canvas.width) p.x = 0;
            if (p.y < 0) p.y = canvas.height;
            if (p.y > canvas.height) p.y = 0;

            // 绘制
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(124, 111, 240, ${p.opacity})`;
            ctx.fill();
        });

        // 连接临近粒子
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 120) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    const lineOpacity = (1 - dist / 120) * 0.08;
                    ctx.strokeStyle = `rgba(124, 111, 240, ${lineOpacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }

        animationId = requestAnimationFrame(draw);
    }

    // 鼠标交互
    let mouseX = -1000, mouseY = -1000;
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // 在draw循环中加入鼠标吸引
    const originalDraw = draw;
    // 覆盖draw来加入鼠标交互
    // 简单起见，在粒子更新中加入鼠标引力
    function drawWithMouse() {
        particles.forEach(p => {
            const dx = mouseX - p.x;
            const dy = mouseY - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 200 && dist > 0) {
                p.vx += dx / dist * 0.02;
                p.vy += dy / dist * 0.02;
            }
            // 阻尼
            p.vx *= 0.99;
            p.vy *= 0.99;
        });
        drawOriginal();
    }

    // 存储原始draw
    const drawOriginal = function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0) p.x = canvas.width;
            if (p.x > canvas.width) p.x = 0;
            if (p.y < 0) p.y = canvas.height;
            if (p.y > canvas.height) p.y = 0;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(124, 111, 240, ${p.opacity})`;
            ctx.fill();
        });

        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(124, 111, 240, ${(1 - dist / 120) * 0.08})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }

        animationId = requestAnimationFrame(drawWithMouse);
    };

    drawWithMouse();
}

// ==================== 侧边栏导航 ====================
function initSidebar() {
    const sections = document.querySelectorAll('section[id]');
    const links = document.querySelectorAll('.sidebar-link');
    if (!sections.length || !links.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                links.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('data-section') === id);
                });
            }
        });
    }, {
        root: null,
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0
    });

    sections.forEach(s => observer.observe(s));
}

// ==================== 滚动显示 ====================
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');
    if (!revealElements.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        rootMargin: '0px 0px -40px 0px',
        threshold: 0.1
    });

    revealElements.forEach((el, i) => {
        el.style.transitionDelay = `${(i % 5) * 0.05}s`;
        observer.observe(el);
    });
}

// ==================== 项目筛选 ====================
function initProjectFilter() {
    const buttons = document.querySelectorAll('.pf-btn');
    const cards = document.querySelectorAll('.project-card');

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;
            cards.forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.classList.remove('hidden');
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    requestAnimationFrame(() => {
                        card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    });
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });
}

// ==================== 滚动提示隐藏 ====================
function initScrollHint() {
    const hint = document.querySelector('.scroll-hint');
    if (!hint) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            hint.style.opacity = '0';
            hint.style.transition = 'opacity 0.5s ease';
        } else {
            hint.style.opacity = '1';
        }
    });
}

// ==================== 联系表单 ====================
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const inputs = form.querySelectorAll('input[required], textarea[required]');
        let valid = true;
        inputs.forEach(inp => {
            if (!inp.value.trim()) {
                valid = false;
                inp.style.borderColor = '#f87171';
                setTimeout(() => { inp.style.borderColor = ''; }, 2000);
            }
        });

        if (!valid) {
            showToast('请填写所有必填字段', 'error');
            return;
        }

        const btn = form.querySelector('.btn-send');
        const orig = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 发送中...';
        btn.disabled = true;

        setTimeout(() => {
            showToast('消息已发送！我会尽快回复你 🚀', 'success');
            form.reset();
            btn.innerHTML = orig;
            btn.disabled = false;
        }, 1500);
    });
}

// ==================== 平滑滚动 ====================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (!target) return;
            const sidebarH = document.querySelector('.sidebar')?.offsetHeight || 0;
            const offset = window.innerWidth <= 768 ? sidebarH : 0;
            const pos = target.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({ top: pos, behavior: 'smooth' });
        });
    });
}

// ==================== Toast ====================
function showToast(msg, type) {
    document.querySelectorAll('.toast').forEach(t => t.remove());
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => { if (toast.parentNode) toast.remove(); }, 3000);
}

// ==================== 移动端侧边栏脉冲 ====================
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});
