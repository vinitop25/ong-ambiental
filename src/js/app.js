// --- Dados de exemplo dos projetos ---
const PROJECTS = [
  { id: 'reflorestamento', title: 'Reflorestamento Local', excerpt: 'Plantio de mudas em áreas degradadas.', img: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=800&auto=format&fit=crop', badge: 'Ativo', body: 'Projeto de recuperação de áreas com espécies nativas.' },
  { id: 'educacao', title: 'Educação Ambiental', excerpt: 'Oficinas e palestras para escolas.', img: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=800&auto=format&fit=crop', badge: 'Em curso', body: 'Ações educativas para comunidade.' },
  { id: 'limpeza', title: 'Limpeza de Rios', excerpt: 'Mutirões para coleta de resíduos.', img: 'https://images.unsplash.com/photo-1508780709619-79562169bc64?q=80&w=800&auto=format&fit=crop', badge: 'Urgente', body: 'Ação comunitária com voluntários locais.' }
];

// --- Router simples (SPA) ---
function parseLocation() {
  return location.hash.slice(1).toLowerCase() || '/';
}

function router() {
  const path = parseLocation();
  const root = document.getElementById('app');
  if (!root) return;

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
    root.innerHTML = '<section><h2>Sobre</h2><p>Somos a ONG VerdeVivo, dedicados à preservação ambiental e ações sustentáveis em comunidades locais.</p></section>';
  } else {
    root.innerHTML = '<section><h2>Página não encontrada</h2></section>';
  }
  attachUIHandlers();
}

window.addEventListener('hashchange', router);
window.addEventListener('load', router);

// --- Renderizador de templates ---
function renderTemplate(id, data = {}) {
  const tpl = document.getElementById(id)?.innerHTML || '';
  if (id === 'tpl-home') {
    const cards = PROJECTS.map(card => `
      <article class="card">
        <img src="${card.img}" alt="${card.title}">
        <div class="card-body">
          <h3>${card.title}</h3>
          <p>${card.excerpt}</p>
          <div class="card-footer">
            <span class="badge">${card.badge}</span>
            <a class="btn" href="#/projetos/${card.id}">Ver mais</a>
          </div>
        </div>
      </article>
    `).join('');
    return tpl.replace('{{cards}}', cards);
  } else {
    return tpl.replace(/\{\{(.*?)\}\}/g, (_, key) => data[key.trim()] || '');
  }
}

// --- UI Handlers ---
function attachUIHandlers() {
  const burger = document.getElementById('btn-burger');
  const nav = document.getElementById('nav-menu');

  if (burger && nav) {
    burger.onclick = () => {
      nav.classList.toggle('open');
      burger.setAttribute('aria-expanded', nav.classList.contains('open'));
    };
  }

  document.querySelectorAll('[data-open-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = document.getElementById(btn.dataset.openModal);
      if (modal) openModal(modal);
    });
  });

  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', () => closeModal(btn.closest('.modal')));
  });
}

// --- Modais ---
function openModal(modal) {
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
}
function closeModal(modal) {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
}

// --- Toast simples ---
function showToast(msg) {
  const area = document.getElementById('toast-area');
  if (!area) return;
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = msg;
  area.appendChild(el);
  setTimeout(() => {
    el.style.opacity = '0';
    setTimeout(() => el.remove(), 400);
  }, 3000);
}

// --- Formulário do voluntário ---
function attachVolunteerForm() {
  const form = document.getElementById('volunteer-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.querySelector('[name="name"]').value.trim();
    const email = form.querySelector('[name="email"]').value.trim();
    if (!name || !email) {
      showToast('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    showToast('Obrigado por se voluntariar!');
    form.reset();
  });
}
