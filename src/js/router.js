const PROJECTS = [
  { id: 'reflorestamento', title: 'Reflorestamento Local', excerpt: 'Plantio de mudas nativas.', img: './src/assets/images/reflorestamento.jpg', badge: 'Ativo', badgeClass: 'Ativo', body: 'Recuperação de áreas degradadas.' },
  { id: 'educacao', title: 'Educação Ambiental', excerpt: 'Oficinas em escolas.', img: './src/assets/images/educacao.jpg', badge: 'Em curso', badgeClass: 'Em curso', body: 'Capacitação para sustentabilidade.' },
  { id: 'limpeza', title: 'Limpeza de Rios', excerpt: 'Mutirões comunitários.', img: './src/assets/images/limpeza.jpg', badge: 'Urgente', badgeClass: 'Urgente', body: 'Despoluição com voluntários.' }
];

function parseLocation() { return location.hash.slice(1).toLowerCase() || '/'; }

function renderTemplate(id) {
  const tpl = document.getElementById(id);
  return tpl ? tpl.innerHTML.trim() : '';
}

function createCard(p) {
  const card = document.createElement('article');
  card.className = 'card';
  card.innerHTML = `
    <img src="${p.img}" alt="${p.title}" loading="lazy">
    <div class="card-body">
      <h3>${p.title}</h3>
      <p>${p.excerpt}</p>
      <div class="card-footer">
        <span class="badge badge--${p.badgeClass}">${p.badge}</span>
        <a class="btn btn-small" href="#/projetos/${p.id}">Saiba mais</a>
      </div>
    </div>
  `;
  return card;
}

window.router = function() {
  const path = parseLocation();
  const root = document.getElementById('app');
  let html = '';

  if (path === '/' || path === '') {
    const grid = document.createElement('div');
    grid.className = 'grid grid--projects';
    PROJECTS.forEach(p => grid.appendChild(createCard(p)));

    html = renderTemplate('tpl-home');
    root.innerHTML = html;
    const placeholder = root.querySelector('#projects-grid');
    if (placeholder) placeholder.replaceWith(grid);
  }
  else if (path.startsWith('/projetos/')) {
    const id = path.split('/')[2];
    const proj = PROJECTS.find(p => p.id === id) || PROJECTS[0];
    html = renderTemplate('tpl-projeto')
      .replace(/{{title}}/g, proj.title)
      .replace(/{{img}}/g, proj.img)
      .replace(/{{body}}/g, proj.body);
    root.innerHTML = html;
  }
  else if (path === '/projetos') {
    const grid = document.createElement('div');
    grid.className = 'grid grid--projects';
    PROJECTS.forEach(p => grid.appendChild(createCard(p)));
    html = `<section class="section"><h1 class="section-title">Todos os Projetos</h1>${grid.outerHTML}</section>`;
    root.innerHTML = html;
  }
  else if (path === '/voluntario') {
    html = renderTemplate('tpl-voluntario');
    root.innerHTML = html;
    setTimeout(() => window.attachVolunteerForm?.(), 100);
  }
  else if (path === '/contato') {
    html = renderTemplate('tpl-contato');
    root.innerHTML = html;
  }
  else if (path === '/sobre') {
    html = `<section class="section"><h2>Sobre</h2><p>Fundada por Beto, apaixonado pela natureza.</p></section>`;
    root.innerHTML = html;
  }
  else {
    html = `<section class="section"><h2>404</h2><p><a href="#/">Voltar</a></p></section>`;
    root.innerHTML = html;
  }

  window.attachUIHandlers?.();
};

window.addEventListener('hashchange', router);
window.addEventListener('load', router);