// Configuración
const STORAGE_KEY = 'certificates_v1';
// Si configuras Formspree, coloca aquí tu endpoint, por ejemplo:
// const FORM_ENDPOINT = 'https://formspree.io/f/xxxxxxxx';
const FORM_ENDPOINT = '';

// Utilidades de almacenamiento
function loadCertificates() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Error leyendo certificados:', e);
    return [];
  }
}
function saveCertificates(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}
function makeId() { return Math.random().toString(36).slice(2, 10); }

// Render de galería
function renderGallery() {
  const list = loadCertificates();
  const gallery = document.getElementById('gallery');
  gallery.innerHTML = '';
  if (!list.length) {
    const empty = document.createElement('div');
    empty.className = 'card';
    empty.textContent = 'Aún no has subido certificaciones. Usa el área superior para cargar tus archivos.';
    gallery.appendChild(empty);
    return;
  }

  list.forEach(item => {
    const card = document.createElement('div');
    card.className = 'item';

    let thumbEl;
    if (item.type.startsWith('image/')) {
      thumbEl = document.createElement('img');
      thumbEl.className = 'thumb';
      thumbEl.src = item.dataUrl;
      thumbEl.alt = item.name;
    } else {
      thumbEl = document.createElement('div');
      thumbEl.className = 'thumb';
      thumbEl.style.display = 'grid';
      thumbEl.style.placeItems = 'center';
      thumbEl.style.fontWeight = '700';
      thumbEl.style.color = 'var(--muted)';
      thumbEl.textContent = 'PDF';
    }

    thumbEl.addEventListener('click', () => openPreview(item));

    const meta = document.createElement('div');
    meta.className = 'meta';

    const name = document.createElement('div');
    name.className = 'name';
    name.title = item.name;
    name.textContent = item.name;

    const actions = document.createElement('div');
    actions.className = 'actions';

    const btnPreview = document.createElement('button');
    btnPreview.className = 'icon-btn';
    btnPreview.title = 'Ver';
    btnPreview.textContent = '👁';
    btnPreview.addEventListener('click', () => openPreview(item));

    const btnRename = document.createElement('button');
    btnRename.className = 'icon-btn';
    btnRename.title = 'Renombrar';
    btnRename.textContent = '✏️';
    btnRename.addEventListener('click', () => renameItem(item.id));

    const btnDelete = document.createElement('button');
    btnDelete.className = 'icon-btn';
    btnDelete.title = 'Eliminar';
    btnDelete.textContent = '🗑';
    btnDelete.addEventListener('click', () => deleteItem(item.id));

    actions.append(btnPreview, btnRename, btnDelete);
    meta.append(name, actions);

    card.append(thumbEl, meta);
    gallery.appendChild(card);
  });
}

function openPreview(item) {
  const modal = document.getElementById('modal');
  const body = document.getElementById('modalBody');
  body.innerHTML = '';

  if (item.type.startsWith('image/')) {
    const img = document.createElement('img');
    img.src = item.dataUrl;
    img.alt = item.name;
    body.appendChild(img);
  } else {
    const iframe = document.createElement('iframe');
    iframe.src = item.dataUrl;
    iframe.title = item.name;
    body.appendChild(iframe);
  }

  showModal(true);
}

function renameItem(id) {
  const list = loadCertificates();
  const idx = list.findIndex(x => x.id === id);
  if (idx === -1) return;
  const current = list[idx].name;
  const next = prompt('Nuevo nombre del certificado:', current);
  if (!next || !next.trim()) return;
  list[idx].name = next.trim();
  saveCertificates(list);
  renderGallery();
}

function deleteItem(id) {
  if (!confirm('¿Eliminar este certificado? Esta acción no se puede deshacer.')) return;
  const list = loadCertificates().filter(x => x.id !== id);
  saveCertificates(list);
  renderGallery();
}

// Import / Export
function exportData() {
  const data = {
    version: 1,
    exportedAt: new Date().toISOString(),
    items: loadCertificates(),
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'certificados.json';
  a.click();
  URL.revokeObjectURL(url);
}

function importData(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const json = JSON.parse(reader.result);
      if (!json || !Array.isArray(json.items)) throw new Error('Formato inválido');
      saveCertificates(json.items);
      renderGallery();
      alert('Datos importados correctamente.');
    } catch (e) {
      alert('No se pudo importar el archivo. Verifica el formato.');
    }
  };
  reader.readAsText(file);
}

// Carga de archivos
function handleFiles(files) {
  const list = loadCertificates();

  Array.from(files).forEach(file => {
    const reader = new FileReader();
    reader.onload = () => {
      const item = {
        id: makeId(),
        name: file.name,
        type: file.type || 'application/octet-stream',
        dataUrl: reader.result,
        createdAt: Date.now(),
      };
      list.unshift(item);
      saveCertificates(list);
      renderGallery();
    };
    reader.readAsDataURL(file);
  });
}

// Modal helpers
function showModal(open) {
  const modal = document.getElementById('modal');
  modal.classList.toggle('show', !!open);
  modal.setAttribute('aria-hidden', open ? 'false' : 'true');
}

function setupModal() {
  const modal = document.getElementById('modal');
  modal.addEventListener('click', (e) => {
    if (e.target.hasAttribute('data-close')) showModal(false);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') showModal(false);
  });
}

// Tema claro/oscuro
function setupThemeToggle() {
  const btn = document.getElementById('themeToggle');
  const saved = localStorage.getItem('theme') || 'dark';
  if (saved === 'light') document.documentElement.classList.add('light');
  btn.addEventListener('click', () => {
    document.documentElement.classList.toggle('light');
    const isLight = document.documentElement.classList.contains('light');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
  });
}

// Contacto
async function submitForm(e) {
  e.preventDefault();
  const status = document.getElementById('formStatus');
  status.textContent = 'Enviando...';

  const data = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    subject: document.getElementById('subject').value,
    message: document.getElementById('message').value,
  };

  if (FORM_ENDPOINT) {
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Error en el servidor');
      status.textContent = '¡Mensaje enviado! Te responderé pronto.';
      (e.target).reset();
    } catch (err) {
      status.textContent = 'No se pudo enviar. Intenta más tarde o usa mailto.';
    }
  } else {
    status.textContent = 'No hay endpoint configurado. Usa el botón "Enviar con tu cliente de correo".';
  }
}

function setupMailto() {
  const link = document.getElementById('mailtoLink');
  function update() {
    const name = encodeURIComponent(document.getElementById('name').value || '');
    const email = encodeURIComponent(document.getElementById('email').value || '');
    const subject = encodeURIComponent(document.getElementById('subject').value || 'Contacto');
    const message = encodeURIComponent(document.getElementById('message').value || '');
    const body = `Nombre: ${name}%0AEmail: ${email}%0A%0A${message}`;
    link.href = `mailto:tu_correo@ejemplo.com?subject=${subject}&body=${body}`;
  }
  ['name','email','subject','message'].forEach(id => {
    const el = document.getElementById(id);
    el.addEventListener('input', update);
  });
  update();
}

// CV Viewer: cargar PDF local temporalmente
function setupCvPreview() {
  const input = document.getElementById('cvFile');
  const viewer = document.querySelector('#cvViewer iframe');
  input.addEventListener('change', () => {
    const file = input.files && input.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    viewer.src = url;
  });
}

// Dropzone
function setupDropzone() {
  const dz = document.getElementById('dropzone');
  const input = document.getElementById('certInput');

  ;['dragenter','dragover'].forEach(evt => dz.addEventListener(evt, e => {
    e.preventDefault(); e.stopPropagation();
    dz.classList.add('dragover');
  }));
  ;['dragleave','drop'].forEach(evt => dz.addEventListener(evt, e => {
    e.preventDefault(); e.stopPropagation();
    dz.classList.remove('dragover');
  }));
  dz.addEventListener('drop', e => {
    const files = e.dataTransfer?.files;
    if (files && files.length) handleFiles(files);
  });
  input.addEventListener('change', () => {
    if (input.files && input.files.length) handleFiles(input.files);
    input.value = '';
  });
}

function setupToolbar() {
  document.getElementById('exportBtn').addEventListener('click', exportData);
  document.getElementById('clearBtn').addEventListener('click', () => {
    if (confirm('Esto eliminará las certificaciones guardadas en este navegador.')) {
      saveCertificates([]);
      renderGallery();
    }
  });
  const importInput = document.getElementById('importInput');
  importInput.addEventListener('change', () => {
    const file = importInput.files && importInput.files[0];
    if (file) importData(file);
    importInput.value = '';
  });
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  // año en footer
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  setupThemeToggle();
  setupModal();
  setupCvPreview();
  setupDropzone();
  setupToolbar();
  setupMailto();

  const contactForm = document.getElementById('contactForm');
  if (contactForm) contactForm.addEventListener('submit', submitForm);

  renderGallery();
});
