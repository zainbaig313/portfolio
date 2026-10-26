/* ===== LOADER ===== */
const loader = document.getElementById('loader');
const loaderBar = document.getElementById('loaderBar');
const loaderText = document.getElementById('loaderText');
const messages = ['Initializing portfolio...', 'Loading projects...', 'Compiling skills...', 'Almost ready...'];
let msgIdx = 0;
let progress = 0;

const loaderInterval = setInterval(() => {
  progress += Math.random() * 25;
  if (progress > 100) progress = 100;
  loaderBar.style.width = progress + '%';
  if (msgIdx < messages.length - 1 && progress > (msgIdx + 1) * 25) {
    msgIdx++;
    loaderText.textContent = messages[msgIdx];
  }
  if (progress >= 100) {
    clearInterval(loaderInterval);
    setTimeout(() => {
      loader.classList.add('hidden');
      initAll();
    }, 400);
  }
}, 120);

/* ===== CUSTOM CURSOR ===== */
const cursor = document.getElementById('cursor');
const cursorTrail = document.getElementById('cursor-trail');
let trailX = 0, trailY = 0;

document.addEventListener('mousemove', (e) => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
});

function animateCursorTrail() {
  trailX += (parseFloat(cursor.style.left || 0) - trailX) * 0.15;
  trailY += (parseFloat(cursor.style.top || 0) - trailY) * 0.15;
  cursorTrail.style.left = trailX + 'px';
  cursorTrail.style.top = trailY + 'px';
  requestAnimationFrame(animateCursorTrail);
}
animateCursorTrail();

document.querySelectorAll('a, button, .sk-chip, .info-card, .project-card, .contact-info-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(2)';
    cursor.style.background = 'var(--accent)';
    cursorTrail.style.borderColor = 'rgba(0,212,255,0.5)';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(1)';
    cursor.style.background = 'var(--primary)';
    cursorTrail.style.borderColor = 'rgba(108,99,255,0.4)';
  });
});

/* ===== THREE.JS PARTICLE BACKGROUND ===== */
function initThreeJS() {
  const canvas = document.getElementById('bg-canvas');
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, canvas.offsetWidth / canvas.offsetHeight, 0.1, 1000);
  camera.position.z = 400;

  // Particles
  const particleCount = 2000;
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount);

  const colorPalette = [
    new THREE.Color('#6c63ff'),
    new THREE.Color('#00d4ff'),
    new THREE.Color('#ff6b9d'),
    new THREE.Color('#64ffda'),
  ];

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 1200;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 800;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 600;
    const col = colorPalette[Math.floor(Math.random() * colorPalette.length)];
    colors[i * 3] = col.r;
    colors[i * 3 + 1] = col.g;
    colors[i * 3 + 2] = col.b;
    sizes[i] = Math.random() * 2 + 0.5;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  const mat = new THREE.PointsMaterial({
    size: 1.5, vertexColors: true,
    transparent: true, opacity: 0.7,
    sizeAttenuation: true,
  });

  const particles = new THREE.Points(geo, mat);
  scene.add(particles);

  // Lines between close particles (network effect)
  const lineGeo = new THREE.BufferGeometry();
  const linePositions = [];
  for (let i = 0; i < 80; i++) {
    const a = Math.floor(Math.random() * particleCount);
    const b = Math.floor(Math.random() * particleCount);
    linePositions.push(
      positions[a * 3], positions[a * 3 + 1], positions[a * 3 + 2],
      positions[b * 3], positions[b * 3 + 1], positions[b * 3 + 2]
    );
  }
  lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
  const lineMat = new THREE.LineBasicMaterial({ color: 0x6c63ff, transparent: true, opacity: 0.08 });
  const lines = new THREE.LineSegments(lineGeo, lineMat);
  scene.add(lines);

  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();
    particles.rotation.y = t * 0.03 + mouseX * 0.1;
    particles.rotation.x = t * 0.01 + mouseY * 0.05;
    lines.rotation.y = particles.rotation.y;
    lines.rotation.x = particles.rotation.x;
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
    camera.aspect = canvas.offsetWidth / canvas.offsetHeight;
    camera.updateProjectionMatrix();
  });
}

/* ===== TYPED.JS ===== */
function initTyped() {
  new Typed('#hero-typed', {
    strings: [
      'scalable backends.',
      'clean APIs.',
      'Angular frontends.',
      '.NET solutions.',
      'Django apps.',
      'enterprise software.'
    ],
    typeSpeed: 60,
    backSpeed: 35,
    backDelay: 1800,
    loop: true,
    cursorChar: '|',
  });
}

/* ===== NAVBAR ===== */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });

  const toggleMenu = (open) => {
    const isOpen = open !== undefined ? open : !navbar.classList.contains('nav-open');
    navbar.classList.toggle('nav-open', isOpen);
    document.body.classList.toggle('no-scroll', isOpen);
    if (hamburger) {
      hamburger.setAttribute('aria-expanded', isOpen);
    }
  };

  if (hamburger) {
    hamburger.addEventListener('click', () => toggleMenu());
  }

  document.querySelectorAll('.nav-link, .nav-cta').forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
  });
}

/* ===== GSAP SCROLL ANIMATIONS ===== */
function initGSAP() {
  gsap.registerPlugin(ScrollTrigger);

  // Hero entrance
  gsap.from('.hero-badge', { opacity: 0, y: 30, duration: 0.8, delay: 0.3, ease: 'power3.out' });
  gsap.from('.hero-name', { opacity: 0, y: 40, duration: 0.9, delay: 0.5, ease: 'power3.out' });
  gsap.from('.hero-typed-wrap', { opacity: 0, y: 30, duration: 0.8, delay: 0.7, ease: 'power3.out' });
  gsap.from('.hero-desc', { opacity: 0, y: 30, duration: 0.8, delay: 0.9, ease: 'power3.out' });
  gsap.from('.hero-actions', { opacity: 0, y: 30, duration: 0.8, delay: 1.1, ease: 'power3.out' });
  gsap.from('.hero-socials', { opacity: 0, y: 30, duration: 0.8, delay: 1.3, ease: 'power3.out' });
  gsap.from('.hero-visual', { opacity: 0, x: 60, duration: 1.2, delay: 0.6, ease: 'power3.out' });

  // Floating cards
  gsap.from('#fc1', { opacity: 0, x: 40, duration: 1, delay: 1.4, ease: 'back.out(1.7)' });
  gsap.from('#fc2', { opacity: 0, x: -40, duration: 1, delay: 1.6, ease: 'back.out(1.7)' });

  // Scroll indicator
  gsap.from('.scroll-indicator', { opacity: 0, y: 20, duration: 1, delay: 2, ease: 'power2.out' });
  gsap.to('.scroll-indicator', {
    opacity: 0, scrollTrigger: { trigger: '#about', start: 'top 80%', scrub: true }
  });

  // Project cards stagger
  gsap.utils.toArray('.project-card').forEach((card, i) => {
    gsap.from(card, {
      opacity: 0, y: 50, duration: 0.7, delay: i * 0.1,
      ease: 'power3.out',
      scrollTrigger: { trigger: card, start: 'top 85%' }
    });
  });

  // Section headers
  gsap.utils.toArray('.section-header').forEach(el => {
    gsap.from(el, {
      opacity: 0, y: 30, duration: 0.7, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 85%' }
    });
  });

  // Timeline
  gsap.from('.tl-card', {
    opacity: 0, x: 50, duration: 0.8, ease: 'power3.out',
    scrollTrigger: { trigger: '.tl-card', start: 'top 85%' }
  });
  gsap.from('.tl-dot', {
    scale: 0, duration: 0.5, ease: 'back.out(2)',
    scrollTrigger: { trigger: '.tl-dot', start: 'top 85%' }
  });
}

/* ===== REVEAL ON SCROLL ===== */
function initReveal() {
  const reveals = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  reveals.forEach(el => obs.observe(el));
}

/* ===== COUNTER ANIMATION ===== */
function initCounters() {
  const counters = document.querySelectorAll('.stat-num');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const isDecimal = e.target.classList.contains('cgpa-stat') || (e.target.dataset.target && e.target.dataset.target.includes('.'));
        const target = parseFloat(e.target.dataset.target || e.target.textContent);
        if (isNaN(target)) return;
        const duration = 1500;
        const start = Date.now();
        const update = () => {
          const elapsed = Date.now() - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const val = eased * target;
          e.target.textContent = isDecimal ? val.toFixed(2) : Math.round(val);
          if (progress < 1) requestAnimationFrame(update);
        };
        update();
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(el => obs.observe(el));
}

/* ===== SKILL BARS ===== */
function initSkillBars() {
  const bars = document.querySelectorAll('.sb-fill');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const w = e.target.dataset.width;
        e.target.style.width = w + '%';
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  bars.forEach(el => obs.observe(el));
}

/* ===== INTERACTIVE TERMINAL ===== */
function initTerminal() {
  const input = document.getElementById('t-input');
  const response = document.getElementById('t-response');
  const body = document.getElementById('terminal-body');

  const commands = {
    help: () => `
<div class="t-res-line">Available commands:</div>
<div class="t-res-line"><span class="t-key">about</span>      — Who is Zain?</div>
<div class="t-res-line"><span class="t-key">skills</span>     — Tech stack overview</div>
<div class="t-res-line"><span class="t-key">projects</span>   — List all projects</div>
<div class="t-res-line"><span class="t-key">experience</span> — Work history</div>
<div class="t-res-line"><span class="t-key">contact</span>    — How to reach me</div>
<div class="t-res-line"><span class="t-key">education</span>  — Academic background</div>
<div class="t-res-line"><span class="t-key">certs</span>      — Certifications</div>
<div class="t-res-line"><span class="t-key">socials</span>    — Social links</div>
<div class="t-res-line"><span class="t-key">clear</span>      — Clear terminal</div>`,

    about: () => `
<div class="t-res-line"><strong>Zain ul Abdin Baig</strong> — Full-Stack Developer</div>
<div class="t-res-line">🎓 BS Computer Science — University of Wah (Graduated July 17, 2026)</div>
<div class="t-res-line">📍 F-10, Islamabad, Pakistan</div>
<div class="t-res-line">💼 ex-Intern @ Askari Bank Limited – IT Group</div>
<div class="t-res-line">🌐 Seeking: Full-Stack .NET / Django Backend roles</div>
<div class="t-res-line">CGPA: <strong>3.61 / 4.00</strong></div>`,

    skills: () => `
<div class="t-res-line"><strong>Core Languages:</strong> C#, TypeScript, Python, SQL, PL/SQL, JavaScript</div>
<div class="t-res-line"><strong>Frameworks:</strong>    ASP.NET Core, Angular, Django, EF Core, Flask, DRF</div>
<div class="t-res-line"><strong>Databases:</strong>     Oracle DB, SQL Server, Firebase</div>
<div class="t-res-line"><strong>Concepts:</strong>      RESTful APIs, JWT, Clean Architecture, OOP, MVC</div>
<div class="t-res-line"><strong>Mobile:</strong>        Android (Kotlin), Firebase, TF Lite, ML Kit</div>
<div class="t-res-line"><strong>Tools:</strong>         Git, Visual Studio, VS Code, Postman, Toad</div>`,

    projects: () => `
<div class="t-res-line">1. <strong>Banking AI Assistant</strong> — Angular + ASP.NET + SQL Server + Nemotron LLM</div>
<div class="t-res-line">2. <strong>Smart Internship Matching</strong> — Django + DRF + Bootstrap 5</div>
<div class="t-res-line">3. <strong>HEADNAV PRO</strong> — AI hands-free computer control (FYP)</div>
<div class="t-res-line">4. <strong>Inventory Management System</strong> — Angular + ASP.NET + Oracle DB</div>
<div class="t-res-line">5. <strong>Hotel Booking System</strong> — C + Windows Forms + SQL Server</div>
<div class="t-res-line">Type <span class="t-key">project:1</span> through <span class="t-key">project:5</span> for details.</div>`,

    'project:1': () => `
<div class="t-res-line"><strong>Banking AI Assistant</strong></div>
<div class="t-res-line">Stack: Angular, ASP.NET Core, SQL Server, EF Core, OpenRouter Nemotron LLM</div>
<div class="t-res-line">Agentic backend with tool-calling integration for autonomous SQL execution.</div>
<div class="t-res-line">Users can check balances, track spending via conversational AI.</div>`,

    'project:2': () => `
<div class="t-res-line"><strong>Smart Internship Matching System</strong></div>
<div class="t-res-line">Stack: Django, Django REST Framework, Bootstrap 5</div>
<div class="t-res-line">Deterministic ranking engine using CGPA + skills + portfolio scoring.</div>
<div class="t-res-line">4 user roles, row-level locking, atomic transactions, faculty analytics.</div>`,

    'project:3': () => `
<div class="t-res-line"><strong>HEADNAV PRO — Final Year Project</strong></div>
<div class="t-res-line">AI-powered accessibility app: hands-free control via head/face gestures.</div>
<div class="t-res-line">Uses standard webcam, no special hardware required. Helps motor-disabled users.</div>`,

    'project:4': () => `
<div class="t-res-line"><strong>Inventory Management System @ Askari Bank</strong></div>
<div class="t-res-line">Stack: Angular, ASP.NET Core Web API, Oracle DB</div>
<div class="t-res-line">Real-time stock tracking, JWT auth, low-inventory alerts, PL/SQL integration.</div>`,

    'project:5': () => `
<div class="t-res-line"><strong>Hotel Room Booking System</strong></div>
<div class="t-res-line">Stack: C, Windows Forms, SQL Server</div>
<div class="t-res-line">Desktop app with role-based access (admin/user), booking management.</div>`,

    experience: () => `
<div class="t-res-line"><strong>Askari Bank Limited – IT Group</strong></div>
<div class="t-res-line">Role:    Product Development Intern</div>
<div class="t-res-line">Period:  July 2025 – August 2025 (6 weeks)</div>
<div class="t-res-line">Built:   Full-stack Inventory Management System independently</div>
<div class="t-res-line">Stack:   Angular + ASP.NET Core + Oracle DB + JWT</div>
<div class="t-res-line">Exposed: Flexcube, IRIS, Raast Switch, RTGS, IBFT, CLINK</div>`,

    education: () => `
<div class="t-res-line"><strong>BS Computer Science</strong> — University of Wah, Wah Cantt</div>
<div class="t-res-line">Duration: Sep 2022 – Jul 17, 2026</div>
<div class="t-res-line">CGPA: <strong>3.61 / 4.00</strong></div>
<br/>
<div class="t-res-line"><strong>Pre-Engineering (FSc)</strong> — Manjan Bazam Cadet College, Ghazi Hassan Abdal</div>
<div class="t-res-line">Duration: 2019 – 2021</div>`,

    certs: () => `
<div class="t-res-line">✅ Foundation C# with Microsoft</div>
<div class="t-res-line">✅ Back-End Development with .NET — Microsoft (Coursera)</div>
<div class="t-res-line">✅ TypeScript Fundamentals — Great Learning Academy</div>
<div class="t-res-line">✅ Oracle DB 11g — Great Learning Academy</div>
<div class="t-res-line">✅ Web Development for Beginners — Great Learning Academy</div>
<div class="t-res-line">✅ Introduction to Cybersecurity Awareness — HP Foundation</div>`,

    contact: () => `
<div class="t-res-line">📧 Email:    <strong>baigzain480@gmail.com</strong></div>
<div class="t-res-line">📞 Phone:    (+92) 312-0523516</div>
<div class="t-res-line">📍 Location: F-10, Islamabad, Pakistan</div>`,

    socials: () => `
<div class="t-res-line">🐙 GitHub:   <a href="https://github.com/zainbaig313" target="_blank" style="color:var(--accent)">github.com/zainbaig313</a></div>
<div class="t-res-line">💼 LinkedIn: <a href="https://linkedin.com/in/Zain-Baig313" target="_blank" style="color:var(--accent)">linkedin.com/in/Zain-Baig313</a></div>`,

    clear: () => 'CLEAR',
    whoami: () => `<div class="t-res-line">Full-Stack Developer | .NET · Django · Angular · Clean Architecture</div>`,
    ls: () => `<div class="t-res-line">about/  skills/  projects/  experience/  education/  contact/</div>`,
    pwd: () => `<div class="t-res-line">/home/zain/portfolio</div>`,
    date: () => `<div class="t-res-line">${new Date().toDateString()}</div>`,
    hello: () => `<div class="t-res-line">Hey there! 👋 Type <span class="t-key">help</span> to get started.</div>`,
    hi: () => `<div class="t-res-line">Hello! 👋 I'm Zain's portfolio. Type <span class="t-key">help</span> to explore.</div>`,
  };

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const cmd = input.value.trim().toLowerCase();
      if (!cmd) return;

      // Echo the command
      const echo = document.createElement('div');
      echo.className = 't-line';
      echo.innerHTML = `<span class="t-prompt">zain@portfolio:~$</span> <span class="t-cmd">${escapeHtml(cmd)}</span>`;
      response.appendChild(echo);

      if (commands[cmd]) {
        const result = commands[cmd]();
        if (result === 'CLEAR') {
          response.innerHTML = '';
          input.value = '';
          body.scrollTop = body.scrollHeight;
          return;
        }
        const res = document.createElement('div');
        res.innerHTML = result;
        response.appendChild(res);
      } else {
        const err = document.createElement('div');
        err.className = 't-error';
        err.textContent = `Command not found: ${cmd}. Type 'help' for available commands.`;
        response.appendChild(err);
      }

      input.value = '';
      body.scrollTop = body.scrollHeight;
    }
  });

  // Auto-focus on click anywhere in terminal
  document.querySelector('.terminal-body').addEventListener('click', () => input.focus());
}

function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/* ===== CONTACT FORM — EmailJS ===== */
// EmailJS configuration
const EMAILJS_CONFIG = {
  serviceId: 'service_m5l6nl8',
  templateId: 'template_88lcfem',
  publicKey: 'UcMHxKRvjm_QW9nUm',
};

function initContactForm() {
  const form = document.getElementById('contact-form');
  const note = document.getElementById('form-note');
  const btn = document.getElementById('form-submit');

  if (!form) return;

  const hasRealKey = EMAILJS_CONFIG.publicKey && EMAILJS_CONFIG.publicKey !== 'YOUR_PUBLIC_KEY';
  if (typeof emailjs !== 'undefined' && hasRealKey) {
    try {
      emailjs.init({
        publicKey: EMAILJS_CONFIG.publicKey,
      });
    } catch (e) {
      console.warn('emailjs.init warning:', e);
    }
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('form-name').value.trim();
    const email = document.getElementById('form-email').value.trim();
    const message = document.getElementById('form-message').value.trim();

    if (!name || !email || !message) {
      note.textContent = '⚠️ Please fill in all fields.';
      note.className = 'form-note error';
      return;
    }

    btn.textContent = 'Sending...';
    btn.disabled = true;
    note.textContent = '';
    note.className = 'form-note';

    if (typeof emailjs !== 'undefined' && hasRealKey) {
      emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templateId,
        {
          name: name,
          email: email,
          title: 'Portfolio Contact Form',
          time: new Date().toLocaleString(),
          message: message,
          to_name: 'Zain ul Abdin Baig',
          reply_to: email,
        },
        EMAILJS_CONFIG.publicKey
      )
        .then((res) => {
          console.log('EmailJS response:', res);
          note.textContent = '✅ Message sent! I will get back to you soon.';
          note.className = 'form-note success';
          form.reset();
        })
        .catch((err) => {
          console.error('EmailJS error details:', err?.status, err?.text, err);
          const detail = err?.text || err?.message || 'Failed to send';
          note.innerHTML = `⚠️ ${detail}. <a href="mailto:baigzain480@gmail.com" style="color:var(--accent);text-decoration:underline;">Click here to email directly</a>`;
          note.className = 'form-note error';
        })
        .finally(() => {
          btn.textContent = 'Send Message 🚀';
          btn.disabled = false;
        });
    } else {
      // Direct email fallback when public key isn't entered yet
      setTimeout(() => {
        note.innerHTML = '✉️ Opening email client to send to <strong>baigzain480@gmail.com</strong>...<br/><small style="color:var(--text-dim)">(To enable instant background sending, add your EmailJS Public Key in app.js)</small>';
        note.className = 'form-note success';
        btn.textContent = 'Send Message 🚀';
        btn.disabled = false;
        window.location.href = `mailto:baigzain480@gmail.com?subject=Portfolio%20Inquiry%20from%20${encodeURIComponent(name)}&body=${encodeURIComponent(message)}%0A%0AFrom:%20${encodeURIComponent(name)}%20(${encodeURIComponent(email)})`;
      }, 400);
    }
  });
}

/* ===== PROJECT CARD MOUSE GLOW ===== */
function initCardGlow() {
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const glow = card.querySelector('.project-glow');
      if (glow) {
        glow.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(108,99,255,0.12) 0%, transparent 60%)`;
      }
    });
  });
}

/* ===== ORBIT ICONS POSITIONING ===== */
function initOrbitIcons() {
  const icons = document.querySelectorAll('.orbit-icon');
  if (!icons.length) return;
  const count = icons.length;

  // Dynamically calculate radius based on viewport width
  const w = window.innerWidth;
  let radius = 210;
  if (w <= 400) {
    radius = 120;
  } else if (w <= 520) {
    radius = 135;
  } else if (w <= 768) {
    radius = 155;
  } else if (w <= 1024) {
    radius = 185;
  } else {
    radius = 210;
  }

  icons.forEach((icon, i) => {
    const angle = (i / count) * 2 * Math.PI - Math.PI / 2; // start from top
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    icon.style.transform = `translate(calc(-50% + ${x.toFixed(1)}px), calc(-50% + ${y.toFixed(1)}px))`;
    icon.style.animationDelay = `${i * 0.25}s`;
  });
}

// Re-position orbit icons smoothly on window resize
let orbitResizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(orbitResizeTimer);
  orbitResizeTimer = setTimeout(initOrbitIcons, 100);
});

/* ===== ACTIVE NAV LINK ===== */
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-link');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.nav-link[href="#${e.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { threshold: 0.4 });
  sections.forEach(s => obs.observe(s));
}

/* ===== INIT ALL ===== */
function initAll() {
  initThreeJS();
  initTyped();
  initNavbar();
  initGSAP();
  initReveal();
  initCounters();
  initSkillBars();
  initTerminal();
  initContactForm();
  initCardGlow();
  initActiveNav();
  initOrbitIcons();
}
