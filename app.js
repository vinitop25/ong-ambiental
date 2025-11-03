// Simple SPA + UI behaviors (hash router, templates, validation, localStorage)
// Data sample
const PROJECTS = [
  { id: 'reflorestamento', title: 'Reflorestamento Local', excerpt: 'Plantio de mudas em áreas degradadas.', img: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=1', badge: 'Ativo', body: 'Projeto de recuperação de áreas com espécies nativas.' },
  { id: 'educacao', title: 'Educação Ambiental', excerpt: 'Oficinas e palestras para escolas.', img: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=2', badge: 'Em curso', body: 'Ações educativas para comunidade.' },
  { id: 'limpeza', title: 'Limpeza de Rios', excerpt: 'Mutirões para coleta de resíduos.', img: 'https://images.unsplash.com/photo-1508780709619-79562169bc64?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=3', badge: 'Urgente', body: 'Ação comunitária com voluntários locais.' }
];

// --- Simple templating ---
function renderTemplate(id, data = {}) {
  const tpl = document.getElementById(id).innerHTML;
  // Handle array of cards for home
  if (id === 'tpl-home') {
    let out = tpl;
    // Replace {{#cards}}...{{/cards}}
    out = out.replace(/\{\{#cards\}\}([\s\S]*?)\{\{\/cards\}\}/, (_, inner) => {
      return data.cards.map(card => inner
        .replace(/\{\{img\}\}/g, card.img)
        .replace(/\{\{title\}\}/g, card.title)
        .replace(/\{\{excerpt\}\}/g, card.excerpt)
        .replace(/\{\{badge\}\}/g, card.badge)
        .replace(/\{\{id\}\}/g, card.id)
      ).join('');
    });
    return out;
  } else {
    // simple replacements
    return tpl.replace(/\{\{(.*?)\}\}/g, (_, key) => data[key.trim()] || '');
  }
}

// --- Router ---
function parseLocation() {
  return location.hash.slice(1).toLowerCase() || '/';
}

function router() {
  const path = parseLocation();
  const root = document.getElementById('app');
  if (path === '/' || path === '') {
    root.innerHTML = renderTemplate('tpl-home', { cards: PROJECTS });
  } else if (path.startsWith('/projetos/')) {
    const id = path.split('/')[2];
    const proj = PROJECTS.find(p => p.id === id) || PROJECTS[0];
    root.innerHTML = renderTemplate('tpl-projeto', proj);
  } else if (path === '/voluntario') {
    root.innerHTML = renderTemplate('tpl-voluntario');
    attachVolunteerForm();
  } else if (path === '/sobre') {
    root.innerHTML = '<section><h2>Sobre</h2><p>Somos a ONG VerdeVivo...</p></section>';
  } else {
    root.innerHTML = '<section><h2>Página não encontrada</h2></section>';
  }
  // After render, attach generic UI
  attachUIHandlers();
  // move focus to main app for accessibility
  document.getElementById('app').focus();
}

window.addEventListener('hashchange', router);
window.addEventListener('load', router);

// --- UI: burger, submenu, modal, toasts ---
function attachUIHandlers() {
  // Burger menu
  const btn = document.getElementById('btn-burger');
  const menu = document.getElementById('nav-menu');
  if (btn) {
    btn.onclick = () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      menu.classList.toggle('open');
    };
  }

  // Submenu buttons
  document.querySelectorAll('.has-submenu > button').forEach(btn => {
    btn.onclick = () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      const submenu = btn.nextElementSibling;
      submenu.classList.toggle('open');
    };
  });

  // Modal triggers
  document.querySelectorAll('[data-open-modal]').forEach(btn => {
    btn.onclick = () => {
      const id = btn.getAttribute('data-open-modal');
      openModal(document.getElementById(id), btn);
    };
  });

  // Modal close handlers
  document.querySelectorAll('.modal-close').forEach(b => {
    b.onclick = () => closeModal(b.closest('.modal'));
  });

  // close modal on overlay click
  document.querySelectorAll('.modal').forEach(m => {
    m.onclick = (e) => {
      if (e.target === m) closeModal(m);
    };
  });

  // donate modal confirm
  document.querySelectorAll('.modal-confirm').forEach(b => {
    b.onclick = () => {
      showToast('Obrigado! Sua intenção de doação foi registrada.');
      closeModal(b.closest('.modal'));
    };
  });

  // attach toast triggers demo (if any)
}

// --- Modal helpers ---
let lastTrigger = null;
function openModal(modalEl, trigger = null) {
  if (!modalEl) return;
  lastTrigger = trigger;
  modalEl.classList.add('open');
  modalEl.setAttribute('aria-hidden', 'false');
  const focusable = modalEl.querySelector('button, [href], input, select, textarea') || modalEl;
  focusable.focus();
  trapFocus(modalEl);
}
function closeModal(modalEl) {
  if (!modalEl) return;
  modalEl.classList.remove('open');
  modalEl.setAttribute('aria-hidden', 'true');
  releaseFocusTrap();
  if (lastTrigger) lastTrigger.focus();
}

// focus trap (simple)
let trap = null;
function trapFocus(modalEl) {
  const focusable = modalEl.querySelectorAll('a[href], button, textarea, input, select');
  const first = focusable[0];
  const last = focusable[focusable.length -1];
  trap = function(e){
    if (e.key === 'Tab') {
      if (document.activeElement === last && !e.shiftKey) {
        e.preventDefault();
        first.focus();
      } else if (document.activeElement === first && e.shiftKey) {
        e.preventDefault();
        last.focus();
      }
    } else if (e.key === 'Escape') {
      closeModal(modalEl);
    }
  };
  document.addEventListener('keydown', trap);
}
function releaseFocusTrap(){
  if (trap) document.removeEventListener('keydown', trap);
  trap = null;
}

// --- Toasts ---
function showToast(message, options = {}) {
  const area = document.getElementById('toast-area');
  const wrap = document.createElement('div');
  wrap.setAttribute('role', 'status');
  wrap.className = 'toast';
  wrap.style.padding = '.6rem .9rem';
  wrap.style.borderRadius = '8px';
  wrap.style.background = '#fff';
  wrap.style.boxShadow = '0 6px 18px rgba(7,34,15,0.06)';
  wrap.textContent = message;
  area.appendChild(wrap);
  setTimeout(() => {
    wrap.style.opacity = '0';
    setTimeout(()=> area.removeChild(wrap), 350);
  }, 3500);
}

// --- Form validation + consistency ---
function validateForm(form){
  let valid = true;
  form.querySelectorAll('input,textarea,select').forEach(el=>{
    const msgEl = el.nextElementSibling;
    if (el.hasAttribute('required') && !el.value.trim()) {
      el.classList.add('is-invalid');
      if (msgEl) msgEl.textContent = 'Campo obrigatório.';
      valid = false;
    } else if (el.type === 'email' && el.value){
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if(!re.test(el.value)){
        el.classList.add('is-invalid');
        if (msgEl) msgEl.textContent = 'E-mail inválido.';
        valid = false;
      } else {
        el.classList.remove('is-invalid');
        if (msgEl) msgEl.textContent = '';
      }
    } else {
      el.classList.remove('is-invalid');
      if (msgEl) msgEl.textContent = '';
    }
  });
  // consistency check example: if hasCar checked, plate required with length >=6
  const hasCar = form.querySelector('[name="hasCar"]');
  const plate = form.querySelector('[name="plate"]');
  if (hasCar && plate) {
    if (hasCar.checked && plate.value.trim().length < 6) {
      plate.classList.add('is-invalid');
      plate.nextElementSibling.textContent = 'Informe a placa válida (min 6 caracteres).';
      valid = false;
    }
  }
  return valid;
}

function attachVolunteerForm(){
  const form = document.getElementById('volunteer-form');
  if (!form) return;
  form.addEventListener('submit', function(e){
    e.preventDefault();
    if (validateForm(this) && checkConsistency(this)) {
      const data = Object.fromEntries(new FormData(this));
      // save to localStorage
      const existing = JSON.parse(localStorage.getItem('volunteers') || '[]');
      existing.push({ ...data, createdAt: new Date().toISOString() });
      localStorage.setItem('volunteers', JSON.stringify(existing));
      showToast('Obrigado! Seu cadastro foi salvo.');
      form.reset();
    } else {
      showToast('Corrija os campos em destaque.');
    }
  });
}

// additional consistency function
function checkConsistency(form){
  // Already handled inside validateForm for this demo; return true to continue
  return true;
}

// keyboard accessibility: close menus with Esc
document.addEventListener('keydown', function(e){
  if (e.key === 'Escape') {
    document.querySelectorAll('.submenu.open').forEach(s => s.classList.remove('open'));
    document.querySelectorAll('.nav-menu.open').forEach(m => m.classList.remove('open'));
  }
});
