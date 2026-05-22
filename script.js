const bugs = [
  {
    id: 'ladybug',
    img: 'images/ladybug.png',
    myPhoto: 'images/my_ladybug.jpg',
    name: 'Ladybug',
    filename: 'ladybug.exe',
    latin: 'Coccinella septempunctata',
    facts: [
      { label: 'Order', value: 'Coleoptera (Beetles)' },
      { label: 'Size', value: '5–8 mm' },
      { label: 'Lifespan', value: '1–2 years' },
      { label: 'Diet', value: 'Aphids, scale insects' },
    ],
    description: 'Ladybugs are beloved beetles known for their bright red and black spotted shells. Their vivid coloring warns predators that they taste bad. A single ladybug can eat up to 5,000 aphids in its lifetime!',
    footer: 'Status: Beneficial insect 🌿  |  Threat level: ☆☆☆☆☆',
  },
  {
    id: 'hestina',
    img: 'images/hestina_butterfly.png',
    myPhoto: 'images/my_butterfly.jpg',
    name: 'Hestina Butterfly',
    filename: 'hestina_butterfly.exe',
    latin: 'Hestina persimilis japonica',
    facts: [
      { label: 'Order', value: 'Lepidoptera' },
      { label: 'Family', value: 'Nymphalidae' },
      { label: 'Wingspan', value: '70–90 mm' },
      { label: 'Range', value: 'East Asia' },
    ],
    description: 'The Hestina butterfly is a striking black-and-white nymphalid found across East Asia. Its bold spotted pattern makes it unmistakable in flight. It is known to mimic certain unpalatable species to deter predators — a classic case of Batesian mimicry.',
    footer: 'Status: Locally common 🌿  |  Superpower: predator mimicry',
  },
  {
    id: 'mantis',
    img: 'images/mantis.png',
    myPhoto: 'images/my_mantis.jpg',
    name: 'European Mantis',
    filename: 'mantis.exe',
    latin: 'Mantis religiosa',
    facts: [
      { label: 'Order', value: 'Mantodea' },
      { label: 'Size', value: '50–75 mm' },
      { label: 'Lifespan', value: '10–12 months' },
      { label: 'Vision', value: '3D binocular' },
    ],
    description: 'The praying mantis gets its name from its folded forelegs that look like hands in prayer. They are the only insect that can rotate their head 180°. Masters of camouflage and ambush predation, they can catch prey as large as small birds.',
    footer: 'Status: Apex insect predator ⚔️  |  Threat level: ★★★★☆',
  },
  {
    id: 'longhorn',
    img: 'images/longhorn_beetle.png',
    myPhoto: 'images/my_longhorn.jpg',
    name: 'Longhorn Beetle',
    filename: 'longhorn_beetle.exe',
    latin: 'Xystrocera globosa',
    facts: [
      { label: 'Order', value: 'Coleoptera' },
      { label: 'Family', value: 'Cerambycidae' },
      { label: 'Size', value: '20–40 mm' },
      { label: 'Antennae', value: 'Up to 2× body length' },
    ],
    description: 'Xystrocera globosa is a stunning iridescent longhorn beetle found across tropical Asia and Africa. Its absurdly long antennae — often exceeding its body length — are used to sense chemicals and find mates. Larvae bore into living wood.',
    footer: 'Status: Common in tropics 🌴  |  Superpower: antennal ESP',
  },
];

/* per-bug worm ratings stored in memory */
const ratings = {};

/* ======== RENDER BUG ICONS ======== */
function renderBugs() {
  const grid = document.getElementById('bug-grid');
  grid.innerHTML = '';
  const iconW = 106, iconH = 118;
  const placed = [];

  function overlaps(x, y) {
    for (const p of placed) {
      if (Math.abs(p.x - x) < iconW + 18 && Math.abs(p.y - y) < iconH + 18) return true;
    }
    return false;
  }

  bugs.forEach(bug => {
    const icon = document.createElement('div');
    icon.className = 'bug-icon';
    icon.setAttribute('data-id', bug.id);

    icon.innerHTML = `
      <div class="icon-img-wrap">
        <img src="${bug.img}" alt="${bug.name}" class="bug-photo">
        <span class="exe-badge">.exe</span>
      </div>
      <div class="icon-label">${bug.filename}</div>
    `;

    const vw = window.innerWidth, vh = window.innerHeight;
    let x, y, tries = 0;
    do {
      x = Math.random() * (vw - 390 - iconW - 20) + 10;
      y = Math.random() * (vh - iconH - 80) + 10;
      tries++;
    } while (overlaps(x, y) && tries < 200);

    placed.push({ x, y });
    icon.style.left = x + 'px';
    icon.style.top = y + 'px';

    /* single click = select */
    icon.addEventListener('click', (e) => {
      if (icon._wasDragged) return;
      document.querySelectorAll('.bug-icon').forEach(i => i.classList.remove('selected'));
      icon.classList.add('selected');
    });

    /* double click = open popup */
    icon.addEventListener('dblclick', () => {
      if (icon._wasDragged) return;
      openPopup(bug.id);
    });

    /* ---- DRAG ---- */
    makeDraggable(icon);

    grid.appendChild(icon);
  });
}

/* ======== DRAGGABLE ICONS ======== */
function makeDraggable(icon) {
  let startX, startY, startLeft, startTop, moved;

  icon.addEventListener('mousedown', (e) => {
    if (e.button !== 0) return;
    e.preventDefault();
    moved = false;
    icon._wasDragged = false;
    startX = e.clientX;
    startY = e.clientY;
    startLeft = parseInt(icon.style.left, 10);
    startTop = parseInt(icon.style.top, 10);

    document.querySelectorAll('.bug-icon').forEach(i => i.classList.remove('selected'));
    icon.classList.add('selected');

    const onMove = (e) => {
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
        moved = true;
        icon.classList.add('dragging');
      }
      if (!moved) return;
      const newLeft = Math.max(0, startLeft + dx);
      const newTop = Math.max(0, startTop + dy);
      icon.style.left = newLeft + 'px';
      icon.style.top = newTop + 'px';
    };

    const onUp = () => {
      icon.classList.remove('dragging');
      if (moved) icon._wasDragged = true;
      setTimeout(() => { icon._wasDragged = false; }, 100);
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  });
}

/* ======== POPUP ======== */
function openPopup(id) {
  const bug = bugs.find(b => b.id === id);
  if (!bug) return;

  document.getElementById('popup-title-text').textContent = bug.filename;
  document.getElementById('popup-name').textContent = bug.name;
  document.getElementById('popup-latin').textContent = bug.latin;
  document.getElementById('popup-footer').textContent = bug.footer;

  const imgWrap = document.getElementById('popup-img-wrap');
  imgWrap.innerHTML = `<img src="${bug.myPhoto}" alt="my ${bug.name}">`;

  const factsEl = document.getElementById('popup-facts');
  factsEl.innerHTML =
    bug.facts.map(f => `<div class="popup-fact"><strong>${f.label}:</strong> ${f.value}</div>`).join('') +
    `<div class="popup-divider"></div><div class="popup-fact">${bug.description}</div>`;

  /* ---- worm rating ---- */
  const currentRating = ratings[id] || 0;
  renderWorms(id, currentRating);

  document.getElementById('popup-overlay').classList.add('active');
  randomisePopupPosition();
}

function renderWorms(bugId, selected) {
  const worms = document.querySelectorAll('#worm-stars .worm');
  const scoreEl = document.getElementById('worm-score');

  worms.forEach(w => {
    const val = parseInt(w.dataset.val, 10);
    w.classList.toggle('active', val <= selected);

    w.onmouseenter = () => {
      worms.forEach(ww => ww.classList.toggle('active', parseInt(ww.dataset.val,10) <= val));
    };
    w.onmouseleave = () => {
      const cur = ratings[bugId] || 0;
      worms.forEach(ww => ww.classList.toggle('active', parseInt(ww.dataset.val,10) <= cur));
    };
    w.onclick = () => {
      ratings[bugId] = val;
      renderWorms(bugId, val);
    };
  });

  scoreEl.textContent = selected === 0 ? '— / 5 worms' : `${selected} / 5 worm${selected === 1 ? '' : 's'}`;
}

function randomisePopupPosition() {
  const win = document.getElementById('popup-window');
  const vw = window.innerWidth, vh = window.innerHeight;
  const w = 460, h = 420;
  const minX = 390;
  const x = minX + Math.random() * Math.max(0, vw - minX - w - 30);
  const y = 30 + Math.random() * Math.max(0, vh - h - 80);
  win.style.transform = 'none';
  win.style.left = x + 'px';
  win.style.top = y + 'px';
}

function closePopup(e) {
  if (!e || e.target === document.getElementById('popup-overlay')) {
    document.getElementById('popup-overlay').classList.remove('active');
  }
}

/* ======== DRAGGABLE POPUP ======== */
(function () {
  let dragging = false, ox = 0, oy = 0;
  const tb = document.getElementById('popup-titlebar');
  const win = document.getElementById('popup-window');
  tb.addEventListener('mousedown', e => {
    dragging = true;
    ox = e.clientX - win.getBoundingClientRect().left;
    oy = e.clientY - win.getBoundingClientRect().top;
    e.preventDefault();
  });
  document.addEventListener('mousemove', e => {
    if (!dragging) return;
    win.style.transform = 'none';
    win.style.left = (e.clientX - ox) + 'px';
    win.style.top = (e.clientY - oy) + 'px';
  });
  document.addEventListener('mouseup', () => { dragging = false; });
})();

/* ======== PAGE SWITCHING ======== */
function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + name).classList.add('active');
}

renderBugs();