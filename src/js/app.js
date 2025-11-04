// --- Dados dos projetos ---
const PROJECTS = [
  { id: 'reflorestamento', title: 'Reflorestamento Local', excerpt: 'Plantio de mudas nativas em áreas degradadas.', img: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=800&auto=format&fit=crop', badge: 'Ativo', badgeClass: 'Ativo', body: 'Recuperamos áreas degradadas com espécies nativas, promovendo biodiversidade e sequestro de carbono.' },
  { id: 'educacao', title: 'Educação Ambiental', excerpt: 'Oficinas e palestras em escolas e comunidades.', img: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=800&auto=format&fit=crop', badge: 'Em curso', badgeClass: 'Em curso', body: 'Capacitação de crianças e adultos para um futuro sustentável através da educação.' },
  { id: 'limpeza', title: 'Limpeza de Rios', excerpt: 'Mutirões comunitários para coleta de resíduos.', img: 'https://images.unsplash.com/photo-1508780709619-79562169bc64?q=80&w=800&auto=format&fit=crop', badge: 'Urgente', badgeClass: 'Urgente', body: 'Ação direta com voluntários para despoluir rios e conscientizar a população.' }
];

// --- Router ---
function parseLocation() {
  return location.hash.slice(1).toLowerCase() || '/';
}

function router() {
  const path = parseLocation();
  const root = document.getElementById('app');
  if (!root) return;

  let html = '';
  if (path === '/' || path === '') {
    html = renderTemplate('tpl-home', { cards: PROJECTS });
  } else if (path.startsWith('/projetos/')) {
    const id = path.split('/')[2];
    const proj = PROJECTS.find(p => p.id === id) || PROJECTS[0];
    html = renderTemplate('tpl-projeto', proj);
  } else if (path === '/projetos') {
    const cards = PROJECTS.map(p => `
      <article class="card card--project">
        <img src="${p.img}" alt="${p.title}" loading="lazy">
        <div class="card-body">
          <h3>${p.title}</h3>
          <p>${p.excerpt}</p>
          <div class="card-footer">
            <span class="badge badge--${p.badgeClass}">${p.badge}</span>
            <a class="btn btn-small" href="#/projetos/${p.id}">Ver detalhes</a>
          </div>
        </div>
      </article>
    `).join('');

    html = `
      <section class="section">
        <h1 class="section-title">Todos os Projetos</h1>
        <div class="grid grid--projects">${cards}</div>
      </section>
    `;
  } else if (path === '/voluntario') {
    html = renderTemplate('tpl-voluntario');
    setTimeout(attachVolunteerForm, 100);
  } else if (path === '/sobre') {
    html = `<section class="section"><h2>Sobre o Beto Verde</h2><p>Somos uma ONG fundada por <strong>Roberto "Beto"</strong>, apaixonado pela natureza desde criança. Nosso objetivo é unir pessoas e ações para um planeta mais verde.</p></section>`;
  } else if (path === '/contato') {
    html = `<section class="section"><h2>Contato</h2><p>Email: beto@betoverde.org<br>WhatsApp: (11) 98765-4321</p></section>`;
  } else {
    html = `<section class="section"><h2>Página não encontrada</h2><p><a href="#/">Voltar ao início</a></p></section>`;
  }

  root.innerHTML = html;
  attachUIHandlers();
}

window.addEventListener('hashchange', router);
window.addEventListener('load', router);

// --- Template Engine ---
function renderTemplate(id, data = {}) {
  const tpl = document.getElementById(id)?.innerHTML.trim();
  if (!tpl) return '';

  if (id === 'tpl-home') {
    const cards = data.cards.map(card => `
      <article class="card card--project">
        <img src="${card.img}" alt="${card.title}" loading="lazy">
        <div class="card-body">
          <h3>${card.title}</h3>
          <p>${card.excerpt}</p>
          <div class="card-footer">
            <span class="badge badge--${card.badgeClass}">${card.badge}</span>
            <a class="btn btn-small" href="#/projetos/${card.id}">Saiba mais</a>
          </div>
        </div>
      </article>
    `).join('');
    return tpl.replace('{{#cards}}', '').replace('{{/cards}}', cards);
  }

  return tpl.replace(/\{\{(.*?)\}\}/g, (_, key) => data[key.trim()] || '');
}

// --- UI Handlers ---
function attachUIHandlers() {
  const burger = document.getElementById('btn-burger');
  const nav = document.getElementById('nav-menu');
  if (burger && nav) {
    burger.onclick = () => {
      const isOpen = nav.classList.toggle('open');
      burger.setAttribute('aria-expanded', isOpen);
    };
  }

  document.querySelectorAll('[data-open-modal]').forEach(btn => {
    btn.onclick = () => openModal(document.getElementById(btn.dataset.openModal));
  });
  document.querySelectorAll('.modal-close, .modal').forEach(el => {
    el.onclick = (e) => {
      if (e.target === el || el.classList.contains('modal-close')) {
        closeModal(el.closest('.modal') || el);
      }
    };
  });
}

function openModal(modal) {
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

// --- Toast ---
function showToast(msg) {
  const area = document.getElementById('toast-area');
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = msg;
  area.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}

// --- Formulário Voluntário ---
function attachVolunteerForm() {
  const form = document.getElementById('volunteer-form');
  if (!form) return;

  const plateGroup = document.getElementById('plate-group');
  const hasCar = document.getElementById('hasCar');

  hasCar.onchange = () => {
    plateGroup.style.display = hasCar.checked ? 'block' : 'none';
  };

  form.onsubmit = (e) => {
    e.preventDefault();
    let valid = true;
    const name = form.name.value.trim();
    const email = form.email.value.trim();

    form.querySelectorAll('.field-msg').forEach(m => m.textContent = '');

    if (!name || name.length < 2) {
      showFieldError(form.name, 'Nome é obrigatório');
      valid = false;
    }
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      showFieldError(form.email, 'E-mail inválido');
      valid = false;
    }

    if (valid) {
      showToast('Obrigado, Beto entrará em contato em breve!');
      form.reset();
      plateGroup.style.display = 'none';
    }
  };
}

function showFieldError(input, msg) {
  const msgEl = input.parentElement.querySelector('.field-msg');
  if (msgEl) msgEl.textContent = msg;
}
