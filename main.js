/**
 * 主逻辑：导航、滚动动画、作品渲染、弹窗、移动端菜单
 */
document.addEventListener('DOMContentLoaded', () => {
  // 初始化 Lucide 图标
  lucide.createIcons();

  // ===== DOM 引用 =====
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const projectsGrid = document.getElementById('projectsGrid');
  const allNavLinks = document.querySelectorAll('.nav-link');

  // ===== 渲染作品卡片 =====
  function renderProjects() {
    projectsGrid.innerHTML = projects.map(project => `
      <article class="project-card reveal" data-project-id="${project.id}">
        ${project.thumbnail ? 
          `<img class="project-card-thumb" src="${project.thumbnail}" alt="${project.title}">` : 
          `<div class="card-thumb-placeholder" style="background: ${project.gradient}">${project.title}</div>`
        }
        <div class="project-card-body">
          <h3 class="project-card-title">${project.title}</h3>
          <p class="project-card-desc">${project.description}</p>
          <div class="project-card-tech">
            ${project.techStack.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
          </div>
        </div>
      </article>
    `).join('');

    // 重新绑定卡片点击事件
    document.querySelectorAll('.project-card').forEach(card => {
      card.addEventListener('click', () => {
        const projectId = card.dataset.projectId;
        const project = projects.find(p => p.id === projectId);
        if (project && project.link) {
          window.open(project.link, '_blank');
        }
      });
    });

    // 重新观察新渲染的 reveal 元素
    observeRevealElements();
  }

  // ===== 移动端菜单 =====
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
  });

  // 点击导航链接关闭菜单
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // ===== 导航栏滚动效果 =====
  function updateNavbar() {
    const scrollY = window.scrollY;
    if (scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  // ===== 导航链接高亮 =====
  function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.scrollY + 100;

    let currentSection = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    allNavLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  }

  // ===== 滚动触发动画 (Intersection Observer) =====
  function observeRevealElements() {
    const revealElements = document.querySelectorAll('.reveal:not(.observed)');
    if (revealElements.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // 可选：交错延迟
          const delay = entry.target.dataset.delay || 0;
          entry.target.style.transitionDelay = `${delay}ms`;
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => {
      el.classList.add('observed');
      observer.observe(el);
    });
  }

  // ===== 全局滚动监听 =====
  let scrollTicking = false;
  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      requestAnimationFrame(() => {
        updateNavbar();
        updateActiveNavLink();
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  });

  // ===== 初始化 =====
  renderProjects();
  observeRevealElements();
  updateNavbar();
  updateActiveNavLink();
});
