// Nat Home Made Curry Puff - Interactive Application Logic

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Setup Event Handlers & Features
  initBatchCountdown();
  initCrunchAudio();
  initOrderCalculator();
  initFAQAccordion();
  initInteractiveAnatomy();
  initMobileMenu();
});

/* ==========================================================
   1. LIVE FRESH BATCH COUNTDOWN TIMER
   Simulates live frying cycles at 170°C in Balik Pulau
   ========================================================== */
function initBatchCountdown() {
  const timerEl = document.getElementById('countdown-timer');
  if (!timerEl) return;

  let totalSeconds = 14 * 60 + 20; // 14 mins 20 seconds initial

  setInterval(() => {
    totalSeconds--;
    if (totalSeconds <= 0) {
      totalSeconds = 15 * 60; // reset to 15 mins for new batch
      showToast('🍳 Fresh Batch Just Left the 170°C Oil in Balik Pulau!');
    }

    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    timerEl.textContent = `${minutes}m ${seconds < 10 ? '0' : ''}${seconds}s`;
  }, 1000);
}

/* ==========================================================
   2. SYNTHESIZED SHATTERING CRUNCH SOUND (Web Audio API)
   Generates a hyper-realistic, acoustic pastry crackle/crunch
   without relying on external sound assets!
   ========================================================== */
let audioCtx = null;

function spawnCrumbParticles(x, y) {
  const colors = ['#f59e0b', '#d97706', '#fbbf24', '#fef3c7', '#b45309'];
  const particleCount = 24;

  const posX = x || (window.innerWidth / 2);
  const posY = y || (window.innerHeight / 2);

  for (let i = 0; i < particleCount; i++) {
    const el = document.createElement('div');
    el.className = 'crumb-particle';
    
    const size = Math.floor(Math.random() * 8) + 4;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const angle = Math.random() * Math.PI * 2;
    const distance = 60 + Math.random() * 120;
    const tx = Math.cos(angle) * distance;
    const ty = Math.sin(angle) * distance;
    const rot = (Math.random() * 360) + 'deg';

    el.style.width = `${size}px`;
    el.style.height = `${size}px`;
    el.style.backgroundColor = color;
    el.style.left = `${posX}px`;
    el.style.top = `${posY}px`;
    el.style.setProperty('--tx', `${tx}px`);
    el.style.setProperty('--ty', `${ty}px`);
    el.style.setProperty('--rot', rot);

    document.body.appendChild(el);

    setTimeout(() => {
      el.remove();
    }, 950);
  }
}

function playCrunchSound(event) {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!audioCtx) {
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const now = audioCtx.currentTime;

    // Create 4 layered noise bursts to simulate micro-layers fracturing sequentially
    for (let i = 0; i < 4; i++) {
      const delay = i * 0.045; // stagger the micro-layer cracks
      createPastryCrack(now + delay, 0.08 + Math.random() * 0.05);
    }

    const clickX = event ? (event.clientX || event.pageX) : (window.innerWidth / 2);
    const clickY = event ? (event.clientY || event.pageY) : (window.innerHeight / 2);
    spawnCrumbParticles(clickX, clickY);

    showToast('🔊 *CRUUUNCH!* That is the sound of 8-hour spiral micro-layers!');
  } catch (e) {
    console.warn('Audio playback error:', e);
    showToast('🔊 *CRUUUNCH!* Shatteringly flaky Karipap Pusing!');
  }
}

function createPastryCrack(startTime, duration) {
  if (!audioCtx) return;

  const bufferSize = audioCtx.sampleRate * duration;
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);

  // Generate crisp white/pink noise with erratic spikes
  for (let i = 0; i < bufferSize; i++) {
    const decay = 1 - (i / bufferSize);
    data[i] = (Math.random() * 2 - 1) * Math.pow(decay, 1.8);
  }

  const noise = audioCtx.createBufferSource();
  noise.buffer = buffer;

  // Bandpass filter centered at crisp high-mid pastry snap frequencies (1800Hz - 3500Hz)
  const filter = audioCtx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(2200 + Math.random() * 800, startTime);
  filter.Q.setValueAtTime(3.5, startTime);

  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(0.8, startTime);
  gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(audioCtx.destination);

  noise.start(startTime);
  noise.stop(startTime + duration);
}

function initCrunchAudio() {
  const btn1 = document.getElementById('crunch-audio-btn');
  const btn2 = document.getElementById('mobile-crunch-btn');
  const btn3 = document.getElementById('card-crunch-btn');

  if (btn1) btn1.addEventListener('click', playCrunchSound);
  if (btn2) btn2.addEventListener('click', playCrunchSound);
  if (btn3) btn3.addEventListener('click', playCrunchSound);
}

/* ==========================================================
   3. INTERACTIVE ORDER CALCULATOR & WHATSAPP GENERATOR
   Pricing Matrix:
   - 1 puff = RM 3.00
   - 5 puffs (Taster Box) = RM 15.00
   - 10 puffs (Family Box) = RM 28.00 (Save RM 2.00)
   - 20 puffs (Party Box) = RM 52.00 (Save RM 8.00)
   ========================================================== */
let currentPuffCount = 10;

function calculatePrice(count) {
  // Optimal bundle pricing calculation
  let remainder = count;
  let total = 0;
  let standardPrice = count * 3.00;

  // Bundle 20s
  const twenties = Math.floor(remainder / 20);
  total += twenties * 52.00;
  remainder %= 20;

  // Bundle 10s
  const tens = Math.floor(remainder / 10);
  total += tens * 28.00;
  remainder %= 10;

  // Bundle 5s
  const fives = Math.floor(remainder / 5);
  total += fives * 15.00;
  remainder %= 5;

  // Individual singles
  total += remainder * 3.00;

  const savings = Math.max(0, standardPrice - total);
  return { total, savings };
}

function updateCalculatorDOM() {
  const countDisplay = document.getElementById('puff-count-display');
  const totalDisplay = document.getElementById('calculated-total');
  const savingsDisplay = document.getElementById('calculated-savings');

  if (countDisplay) countDisplay.textContent = currentPuffCount;

  const { total, savings } = calculatePrice(currentPuffCount);

  if (totalDisplay) totalDisplay.textContent = total.toFixed(2);
  if (savingsDisplay) {
    if (savings > 0) {
      savingsDisplay.style.display = 'inline-block';
      savingsDisplay.textContent = `Saved RM ${savings.toFixed(2)}!`;
    } else {
      savingsDisplay.style.display = 'none';
    }
  }
}

function adjustPuffs(delta) {
  currentPuffCount = Math.max(1, currentPuffCount + delta);
  updateCalculatorDOM();
}

function setPuffs(count) {
  currentPuffCount = count;
  updateCalculatorDOM();
}

function selectBoxPreset(count) {
  setPuffs(count);
  const target = document.getElementById('order-calculator');
  if (target) {
    target.scrollIntoView({ behavior: 'smooth' });
  }
}

function handleOrderSubmit(event) {
  event.preventDefault();

  const name = document.getElementById('cust-name').value.trim() || 'Valued Guest';
  const pickupTime = document.getElementById('pickup-time').value;
  const notes = document.getElementById('cust-notes').value.trim() || 'None';
  const { total, savings } = calculatePrice(currentPuffCount);

  let bundleName = `${currentPuffCount} Pcs`;
  if (currentPuffCount === 5) bundleName = '5 Pcs (Crisp Taster Box)';
  else if (currentPuffCount === 10) bundleName = '10 Pcs (Family Sharing Box)';
  else if (currentPuffCount === 20) bundleName = '20 Pcs (Balik Pulau Gift Box)';

  const savingsNote = savings > 0 ? ` (Includes RM ${savings.toFixed(2)} bundle saving)` : '';

  const message = `Halo Nat! 👋 I would like to pre-order your traditional Karipap Pusing for pickup in Balik Pulau:

📋 *Order Details:*
• *Item:* Nat's Handmade Karipap Pusing (100% Farm-Fresh Potatoes, No Meat)
• *Quantity:* ${bundleName}
• *Total:* RM ${total.toFixed(2)}${savingsNote}
• *Preferred Pickup Time:* ${pickupTime}
• *Customer Name:* ${name}
• *Special Notes:* ${notes}

📍 *Pickup Point:* Jalan Balik Pulau, 11000 Balik Pulau, Penang Island.
Please confirm my fresh batch reservation. Thank you!`;

  const phone = '60124889231';
  const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  // Open WhatsApp
  window.open(waUrl, '_blank');
}

function initOrderCalculator() {
  updateCalculatorDOM();
}

/* ==========================================================
   4. FAQ ACCORDION LOGIC
   ========================================================== */
function initFAQAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-btn');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all others
      faqItems.forEach(i => i.classList.remove('open'));

      if (!isOpen) {
        item.classList.add('open');
      }
    });
  });
}

/* ==========================================================
   5. INTERACTIVE SPIRAL ANATOMY VIEWER
   ========================================================== */
function initInteractiveAnatomy() {
  const cards = document.querySelectorAll('.layer-card');
  const crustSvg = document.getElementById('layer-crust');
  const potatoSvg = document.getElementById('layer-potato');
  const crimpSvg = document.getElementById('layer-crimp');

  cards.forEach(card => {
    card.addEventListener('click', () => {
      cards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');

      const layer = card.dataset.layer;
      highlightSvgLayer(layer);
    });
  });

  if (crustSvg) {
    crustSvg.addEventListener('click', () => selectLayerByName('dough'));
  }
  if (potatoSvg) {
    potatoSvg.addEventListener('click', () => selectLayerByName('potatoes'));
  }
  if (crimpSvg) {
    crimpSvg.addEventListener('click', () => selectLayerByName('crimp'));
  }
}

function selectLayerByName(name) {
  const targetCard = document.querySelector(`.layer-card[data-layer="${name}"]`);
  if (targetCard) {
    targetCard.click();
    targetCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

function highlightSvgLayer(layer) {
  const crustSvg = document.getElementById('layer-crust');
  const potatoSvg = document.getElementById('layer-potato');
  const crimpSvg = document.getElementById('layer-crimp');

  // Reset opacity
  if (crustSvg) crustSvg.style.opacity = '1';
  if (potatoSvg) potatoSvg.style.opacity = '1';
  if (crimpSvg) crimpSvg.style.opacity = '1';

  if (layer === 'dough' && crustSvg) {
    crustSvg.style.filter = 'drop-shadow(0 0 12px #f59e0b)';
    if (potatoSvg) potatoSvg.style.opacity = '0.5';
    if (crimpSvg) crimpSvg.style.opacity = '0.5';
  } else if (layer === 'potatoes' && potatoSvg) {
    potatoSvg.style.filter = 'drop-shadow(0 0 12px #22c55e)';
    if (crustSvg) crustSvg.style.opacity = '0.4';
    if (crimpSvg) crimpSvg.style.opacity = '0.4';
  } else if (layer === 'crimp' && crimpSvg) {
    crimpSvg.style.filter = 'drop-shadow(0 0 12px #ea580c)';
    if (crustSvg) crustSvg.style.opacity = '0.5';
    if (potatoSvg) potatoSvg.style.opacity = '0.5';
  } else {
    if (crustSvg) crustSvg.style.filter = 'none';
    if (potatoSvg) potatoSvg.style.filter = 'none';
    if (crimpSvg) crimpSvg.style.filter = 'none';
  }
}

/* ==========================================================
   6. MOBILE MENU TOGGLE
   ========================================================== */
function initMobileMenu() {
  const btn = document.getElementById('mobile-menu-btn');
  const menu = document.getElementById('mobile-menu');

  if (btn && menu) {
    btn.addEventListener('click', () => {
      menu.classList.toggle('hidden');
    });

    // Close when clicking a link
    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menu.classList.add('hidden');
      });
    });
  }
}

/* ==========================================================
   7. UTILITY: COPY ADDRESS & TOAST NOTIFICATION
   ========================================================== */
function copyAddress() {
  const address = 'Jalan Balik Pulau, 11000 Balik Pulau, Penang Island, Malaysia';
  navigator.clipboard.writeText(address).then(() => {
    const copyText = document.getElementById('copy-btn-text');
    if (copyText) {
      const original = copyText.textContent;
      copyText.textContent = '✓ Copied to Clipboard!';
      setTimeout(() => {
        copyText.textContent = original;
      }, 2500);
    }
    showToast('📍 Balik Pulau address copied! Paste into Waze or Google Maps.');
  }).catch(() => {
    showToast('Address: Jalan Balik Pulau, 11000 Balik Pulau, Penang');
  });
}

function showToast(message) {
  let toast = document.querySelector('.toast-notice');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<span class="text-amber-400">✨</span> <span>${message}</span>`;
  toast.classList.add('show');

  clearTimeout(window.toastTimeout);
  window.toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}

// Global exposure for inline HTML onclick handlers
window.playCrunchSound = playCrunchSound;
window.adjustPuffs = adjustPuffs;
window.setPuffs = setPuffs;
window.selectBoxPreset = selectBoxPreset;
window.handleOrderSubmit = handleOrderSubmit;
window.copyAddress = copyAddress;

