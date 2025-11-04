window.attachUIHandlers = function() {
  const burger = document.getElementById('btn-burger');
  const nav = document.getElementById('nav-menu');
  if (burger && nav) {
    burger.onclick = () => {
      const open = nav.classList.toggle('open');
      burger.setAttribute('aria-expanded', open);
    };
  }

  document.querySelectorAll('[data-open-modal]').forEach(b => {
    b.onclick = () => {
      const modal = document.getElementById(b.dataset.openModal);
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
    };
  });

  document.querySelectorAll('.modal-close, .modal').forEach(el => {
    el.onclick = (e) => {
      if (e.target === el || el.classList.contains('modal-close')) {
        const m = el.closest('.modal') || el;
        m.classList.remove('open');
        m.setAttribute('aria-hidden', 'true');
      }
    };
  });
};

window.attachVolunteerForm = function() {
  const form = document.getElementById('volunteer-form');
  if (!form) return;
  const plate = document.getElementById('plate-group');
  document.getElementById('hasCar').onchange = () => plate.style.display = this.checked ? 'block' : 'none';

  form.onsubmit = (e) => {
    e.preventDefault();
    let valid = true;
    form.querySelectorAll('.field-msg').forEach(m => m.textContent = '');
    const name = form.name.value.trim();
    const email = form.email.value.trim();

    if (!name || name.length < 2) { showError(form.name, 'Nome obrigatório'); valid = false; }
    if (!email || !/\S+@\S+\.\S+/.test(email)) { showError(form.email, 'E-mail inválido'); valid = false; }

    if (valid) {
      showToast('Obrigado, Beto entrará em contato!');
      form.reset();
      plate.style.display = 'none';
    }
  };
};

function showError(input, msg) {
  const el = input.parentElement.querySelector('.field-msg');
  if (el) el.textContent = msg;
}

function showToast(msg) {
  const area = document.getElementById('toast-area');
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  area.appendChild(t);
  setTimeout(() => t.remove(), 3500);
}
