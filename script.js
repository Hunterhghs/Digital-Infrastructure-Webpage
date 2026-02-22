/* ===========================
   Scroll Reveal (Intersection Observer)
   =========================== */
document.addEventListener('DOMContentLoaded', () => {
    // Reveal elements on scroll
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    // Animate gap bars when visible
    const barObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const fills = entry.target.querySelectorAll('.gap-bar-fill');
                fills.forEach(fill => {
                    const w = fill.getAttribute('data-width');
                    fill.style.setProperty('--target-width', w + '%');
                    setTimeout(() => fill.classList.add('animated'), 100);
                });
                barObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    const gapChart = document.querySelector('.gap-chart');
    if (gapChart) barObserver.observe(gapChart);

    // Animated counters
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    document.querySelectorAll('.hero-stats, .dashboard-grid').forEach(el => counterObserver.observe(el));

    // Navbar scroll handling
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        // Navbar background
        if (window.scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active nav link
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        // Map section IDs to nav link targets
        const navMap = {
            'overview': 'overview',
            'pillars': 'overview',
            'impact': 'impact',
            'case-studies': 'case-studies',
            'policy': 'policy',
            'dashboard': 'policy',
            'conclusion': 'policy'
        };

        const activeTarget = navMap[current] || '';

        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href').replace('#', '');
            if (href === activeTarget) {
                link.classList.add('active');
            }
        });
    });

    // Mobile menu toggle
    const mobileToggle = document.getElementById('mobileToggle');
    const navLinksContainer = document.querySelector('.nav-links');

    mobileToggle.addEventListener('click', () => {
        navLinksContainer.classList.toggle('open');
    });

    // Close mobile menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navLinksContainer.classList.remove('open');
        });
    });

    // Initialize charts
    initCharts();
});

/* ===========================
   Counter Animation
   =========================== */
function animateCounters(container) {
    const counters = container.querySelectorAll('[data-target], .counter[data-target]');
    counters.forEach(counter => {
        const target = parseFloat(counter.getAttribute('data-target'));
        const duration = 2000;
        const startTime = performance.now();
        const isDecimal = target % 1 !== 0;

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = target * eased;

            if (isDecimal) {
                counter.textContent = current.toFixed(1);
            } else {
                counter.textContent = Math.round(current);
            }

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                if (isDecimal) {
                    counter.textContent = target.toFixed(1);
                } else {
                    counter.textContent = target;
                }
            }
        }

        requestAnimationFrame(update);
    });
}

/* ===========================
   Chart.js Initialization
   =========================== */
function initCharts() {
    // Chart.js defaults for economist style
    Chart.defaults.font.family = "'Inter', -apple-system, sans-serif";
    Chart.defaults.color = '#8a8a9e';

    // GDP Impact Chart
    const impactCtx = document.getElementById('impactChart');
    if (impactCtx) {
        new Chart(impactCtx, {
            type: 'bar',
            data: {
                labels: ['Fixed Broadband', 'Mobile Broadband', 'Mobile Money', 'Digital ID', 'Cloud Services'],
                datasets: [
                    {
                        label: 'Developing Economies',
                        data: [1.21, 0.81, 0.56, 0.42, 0.38],
                        backgroundColor: 'rgba(201, 168, 76, 0.85)',
                        borderColor: '#c9a84c',
                        borderWidth: 1,
                        borderRadius: 4,
                        barPercentage: 0.7,
                        categoryPercentage: 0.65
                    },
                    {
                        label: 'Developed Economies',
                        data: [1.38, 0.60, 0.22, 0.18, 0.51],
                        backgroundColor: 'rgba(46, 196, 182, 0.7)',
                        borderColor: '#2ec4b6',
                        borderWidth: 1,
                        borderRadius: 4,
                        barPercentage: 0.7,
                        categoryPercentage: 0.65
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                aspectRatio: 2.2,
                plugins: {
                    legend: {
                        position: 'top',
                        align: 'end',
                        labels: {
                            boxWidth: 12,
                            boxHeight: 12,
                            borderRadius: 3,
                            useBorderRadius: true,
                            padding: 20,
                            font: { size: 12, weight: 500 }
                        }
                    },
                    tooltip: {
                        backgroundColor: '#1a1a2e',
                        titleFont: { size: 13, weight: 600 },
                        bodyFont: { size: 12 },
                        padding: 12,
                        cornerRadius: 8,
                        callbacks: {
                            label: ctx => `${ctx.dataset.label}: +${ctx.raw}% GDP`
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0,0,0,0.06)',
                            drawBorder: false
                        },
                        ticks: {
                            callback: v => `+${v}%`,
                            font: { size: 11 }
                        },
                        title: {
                            display: true,
                            text: 'GDP Growth Contribution (%)',
                            font: { size: 11, weight: 500 },
                            padding: { bottom: 8 }
                        }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { font: { size: 11 } }
                    }
                }
            }
        });
    }

    // Investment Chart
    const investCtx = document.getElementById('investmentChart');
    if (investCtx) {
        new Chart(investCtx, {
            type: 'line',
            data: {
                labels: ['2019', '2020', '2021', '2022', '2023', '2024'],
                datasets: [
                    {
                        label: 'Private Sector',
                        data: [68, 54, 72, 89, 102, 118],
                        borderColor: '#c9a84c',
                        backgroundColor: 'rgba(201, 168, 76, 0.08)',
                        borderWidth: 2.5,
                        pointRadius: 4,
                        pointHoverRadius: 7,
                        pointBackgroundColor: '#c9a84c',
                        fill: true,
                        tension: 0.35
                    },
                    {
                        label: 'Multilateral / DFI',
                        data: [22, 28, 35, 42, 48, 56],
                        borderColor: '#2ec4b6',
                        backgroundColor: 'rgba(46, 196, 182, 0.06)',
                        borderWidth: 2.5,
                        pointRadius: 4,
                        pointHoverRadius: 7,
                        pointBackgroundColor: '#2ec4b6',
                        fill: true,
                        tension: 0.35
                    },
                    {
                        label: 'Government / Public',
                        data: [34, 38, 42, 45, 52, 58],
                        borderColor: '#4a90d9',
                        backgroundColor: 'rgba(74, 144, 217, 0.06)',
                        borderWidth: 2.5,
                        pointRadius: 4,
                        pointHoverRadius: 7,
                        pointBackgroundColor: '#4a90d9',
                        fill: true,
                        tension: 0.35
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                aspectRatio: 2.2,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                plugins: {
                    legend: {
                        position: 'top',
                        align: 'end',
                        labels: {
                            boxWidth: 12,
                            boxHeight: 12,
                            borderRadius: 3,
                            useBorderRadius: true,
                            padding: 20,
                            font: { size: 12, weight: 500 }
                        }
                    },
                    tooltip: {
                        backgroundColor: '#1a1a2e',
                        titleFont: { size: 13, weight: 600 },
                        bodyFont: { size: 12 },
                        padding: 12,
                        cornerRadius: 8,
                        callbacks: {
                            label: ctx => `${ctx.dataset.label}: $${ctx.raw}B`
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0,0,0,0.06)',
                            drawBorder: false
                        },
                        ticks: {
                            callback: v => `$${v}B`,
                            font: { size: 11 }
                        }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { font: { size: 11 } }
                    }
                }
            }
        });
    }
}
