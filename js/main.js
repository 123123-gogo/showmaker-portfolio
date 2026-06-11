/* ============================================================
   🦄 Showmaker 设计师个人主页 - 可爱交互脚本
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    initCustomCursor();
    initNavbar();
    initMobileMenu();
    initSmoothScroll();
    initActiveNavLink();
    initScrollReveal();
    initPortfolioFilter();
    initSkillBars();
    initCounters();
    initBackToTop();
    initContactForm();
    initSparkles();
    initClickRipple();
});

// ==================== 飘落星星 ====================
function initSparkles() {
    const container = document.getElementById('sparklesContainer');
    if (!container) return;

    const emojis = ['✨', '⭐', '🌸', '💖', '🦋', '🌷', '💫', '🎀', '🌟', '💎', '🍀', '🫧', '💕', '🎵', '🦄', '🌙'];

    function createSparkle() {
        const sparkle = document.createElement('span');
        sparkle.className = 'sparkle';
        sparkle.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        sparkle.style.left = Math.random() * 100 + '%';
        sparkle.style.fontSize = (0.8 + Math.random() * 1.8) + 'rem';
        sparkle.style.animationDuration = (6 + Math.random() * 10) + 's';
        sparkle.style.animationDelay = '0s';
        sparkle.style.opacity = (0.3 + Math.random() * 0.5);

        container.appendChild(sparkle);

        // 动画结束后清理
        const duration = parseFloat(sparkle.style.animationDuration) * 1000;
        setTimeout(() => {
            if (sparkle.parentNode) {
                sparkle.remove();
            }
        }, duration + 200);
    }

    // 初始生成一批
    for (let i = 0; i < 8; i++) {
        setTimeout(createSparkle, i * 400);
    }

    // 持续生成
    setInterval(() => {
        // 限制同时存在的星星数量
        if (container.children.length < 15) {
            createSparkle();
        }
    }, 1200);
}

// ==================== 点击涟漪效果 ====================
function initClickRipple() {
    const clickEmojis = ['💖', '✨', '🌸', '⭐', '💕', '🎀', '💫', '🌟', '🫧'];

    document.addEventListener('click', (e) => {
        // 排除表单元素和按钮（它们有自己的交互反馈）
        if (e.target.closest('input, textarea, select, button, .filter-btn')) return;

        // 限制频率
        const ripple = document.createElement('span');
        ripple.className = 'click-ripple';
        ripple.textContent = clickEmojis[Math.floor(Math.random() * clickEmojis.length)];
        ripple.style.left = e.clientX + 'px';
        ripple.style.top = e.clientY + 'px';

        document.body.appendChild(ripple);

        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.remove();
            }
        }, 800);
    });
}

// ==================== 自定义光标 ====================
function initCustomCursor() {
    if (window.innerWidth <= 768) return;

    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    if (!cursor || !follower) return;

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // 可悬停元素
    const hoverTargets = document.querySelectorAll(
        'a, button, input, textarea, select, .portfolio-item, .skill-card, .contact-card, .filter-btn, .fun-card-inner'
    );

    hoverTargets.forEach(el => {
        el.addEventListener('mouseenter', () => follower.classList.add('hover'));
        el.addEventListener('mouseleave', () => follower.classList.remove('hover'));
    });

    function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.5;
        cursorY += (mouseY - cursorY) * 0.5;
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        requestAnimationFrame(animateCursor);
    }

    function animateFollower() {
        followerX += (mouseX - followerX) * 0.1;
        followerY += (mouseY - followerY) * 0.1;
        follower.style.left = followerX + 'px';
        follower.style.top = followerY + 'px';
        requestAnimationFrame(animateFollower);
    }

    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
        follower.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
        cursor.style.opacity = '1';
        follower.style.opacity = '1';
    });

    requestAnimationFrame(animateCursor);
    requestAnimationFrame(animateFollower);
}

// ==================== 导航栏滚动效果 ====================
function initNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// ==================== 手机端菜单 ====================
function initMobileMenu() {
    const toggle = document.getElementById('navToggle');
    const menu = document.getElementById('navMenu');
    const links = menu?.querySelectorAll('.nav-link');

    if (!toggle || !menu) return;

    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        menu.classList.toggle('active');
        document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';
    });

    links?.forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('active');
            menu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    document.addEventListener('click', (e) => {
        if (menu.classList.contains('active') &&
            !menu.contains(e.target) &&
            !toggle.contains(e.target)) {
            toggle.classList.remove('active');
            menu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// ==================== 平滑滚动 ====================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            if (!target) return;

            const navHeight = document.getElementById('navbar')?.offsetHeight || 80;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });
}

// ==================== 活跃导航链接 ====================
function initActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    if (!sections.length || !navLinks.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('data-section') === id);
                });
            }
        });
    }, {
        root: null,
        rootMargin: '-35% 0px -60% 0px',
        threshold: 0
    });

    sections.forEach(section => observer.observe(section));
}

// ==================== 滚动显示动画 ====================
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
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.1
    });

    revealElements.forEach((el, index) => {
        el.style.transitionDelay = `${(index % 4) * 0.08}s`;
        observer.observe(el);
    });
}

// ==================== 作品集筛选 ====================
function initPortfolioFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    if (!filterBtns.length || !portfolioItems.length) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            portfolioItems.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.classList.remove('hidden');
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.9)';
                    requestAnimationFrame(() => {
                        item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    });
                } else {
                    item.classList.add('hidden');
                }
            });
        });
    });
}

// ==================== 技能进度条动画 ====================
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-bar-fill');
    if (!skillBars.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                bar.style.width = bar.getAttribute('data-width');
                observer.unobserve(bar);
            }
        });
    }, { threshold: 0.5 });

    skillBars.forEach(bar => observer.observe(bar));
}

// ==================== 数字滚动动画 ====================
function initCounters() {
    const counters = document.querySelectorAll('.stat-number[data-target]');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                const duration = 2000;
                const startTime = performance.now();

                function updateCounter(currentTime) {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    const easeOut = 1 - Math.pow(1 - progress, 3);
                    const current = Math.round(target * easeOut);
                    counter.textContent = current + '+';

                    if (progress < 1) {
                        requestAnimationFrame(updateCounter);
                    }
                }

                requestAnimationFrame(updateCounter);
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

// ==================== 回到顶部按钮 ====================
function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    });

    btn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ==================== 联系表单 ====================
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });

        const inputs = form.querySelectorAll('input[required], textarea[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.style.borderColor = '#ef4444';
                setTimeout(() => {
                    input.style.borderColor = '';
                }, 2000);
            }
        });

        if (!isValid) {
            showToast('请填写所有必填字段哦～ 💕', 'error');
            return;
        }

        const submitBtn = form.querySelector('.btn-submit');
        const originalHTML = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span>发送中...</span><i class="fas fa-spinner fa-spin"></i>';
        submitBtn.disabled = true;

        setTimeout(() => {
            showToast('消息已发送！感谢你的联系～ 💌 我会尽快回复！', 'success');
            form.reset();
            submitBtn.innerHTML = originalHTML;
            submitBtn.disabled = false;
        }, 1500);
    });
}

// ==================== Toast 提示 ====================
function showToast(message, type = 'success') {
    const existingToast = document.querySelector('.toast');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        if (toast.parentNode) {
            toast.remove();
        }
    }, 3000);
}

// ==================== 键盘导航 ====================
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const menu = document.getElementById('navMenu');
        const toggle = document.getElementById('navToggle');
        if (menu?.classList.contains('active')) {
            toggle?.classList.remove('active');
            menu.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
});

// ==================== 页面加载完成 ====================
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});
