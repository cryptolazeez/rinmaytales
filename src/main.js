import './style.css';

// ─── CART STATE ───
let cart = [];
let cartOpen = false;

window.toggleCart = function() {
  cartOpen = !cartOpen;
  document.getElementById('cartOverlay').classList.toggle('open', cartOpen);
  document.getElementById('cartDrawer').classList.toggle('open', cartOpen);
  document.body.style.overflow = cartOpen ? 'hidden' : '';
}

window.addToCart = function(btn, name) {
  const price = parseInt(btn.closest('.product-card').querySelector('.price-new').textContent.replace(/[^0-9]/g,''));
  const existing = cart.find(i => i.name === name);
  if (existing) existing.qty++;
  else cart.push({ name, price, qty: 1 });
  
  const originalText = btn.textContent;
  btn.textContent = '✓ Added';
  btn.style.background = 'var(--forest)';
  
  setTimeout(() => { 
    btn.textContent = originalText; 
    btn.style.background = ''; 
  }, 1500);
  
  renderCart();
  window.toggleCart();
}

function renderCart() {
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  document.getElementById('cartTotal').textContent = '₹' + total.toLocaleString('en-IN');
  
  const hasItems = cart.length > 0;
  document.getElementById('cartEmpty').style.display = hasItems ? 'none' : 'flex';
  document.getElementById('cartItems').style.display = hasItems ? 'block' : 'none';
  document.getElementById('cartFooter').style.display = hasItems ? 'block' : 'none';
  
  document.getElementById('cartItems').innerHTML = cart.map(i => `
    <div style="display:flex;justify-content:space-between;align-items:center;padding:16px 0;border-bottom:1px solid var(--mist)">
      <div>
        <div style="font-family:var(--font-serif);font-size:15px;color:var(--ink);margin-bottom:4px">${i.name}</div>
        <div style="font-size:12px;color:var(--bark)">Qty: ${i.qty}</div>
      </div>
      <span style="font-family:var(--font-serif);font-size:16px;font-weight:600;color:var(--terracotta)">₹${(i.price*i.qty).toLocaleString('en-IN')}</span>
    </div>
  `).join('');

  // Update bag count in header
  const totalQty = cart.reduce((s, i) => s + i.qty, 0);
  const bagBtn = document.querySelector('.cart-btn');
  if (bagBtn) {
    bagBtn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
      Bag (${totalQty})
    `;
  }
}

// ─── COUNTDOWN TIMER ───
function initTimer() {
  let end = new Date();
  end.setHours(end.getHours() + 8, end.getMinutes() + 42, end.getSeconds() + 17);
  
  function tick() {
    const diff = Math.max(0, end - new Date());
    const h = Math.floor(diff/3600000), 
          m = Math.floor((diff%3600000)/60000), 
          s = Math.floor((diff%60000)/1000);
          
    const pad = n => String(n).padStart(2,'0');
    const th = document.getElementById('timer-h'), 
          tm = document.getElementById('timer-m'), 
          ts = document.getElementById('timer-s');
          
    if(th) th.textContent = pad(h);
    if(tm) tm.textContent = pad(m);
    if(ts) ts.textContent = pad(s);
  }
  
  tick();
  setInterval(tick, 1000);
}

// ─── SCROLL REVEAL ───
function initScrollReveal() {
  // Scroll Reveal & Staggered Animations
  const revealElements = document.querySelectorAll('.reveal, .stagger-in');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.01, rootMargin: '0px 0px -50px 0px' });

  revealElements.forEach(el => revealObserver.observe(el));

  // Parallax Effect
  window.addEventListener('scroll', () => {
    const parallax = document.querySelector('.parallax');
    if (parallax) {
      let scrolled = window.pageYOffset;
      let rate = parseFloat(parallax.dataset.speed) || 0.5;
      parallax.style.transform = `translate3d(0, ${scrolled * rate}px, 0)`;
    }
  });
}

// ─── NEWSLETTER ───
window.subscribeNewsletter = function(btn) {
  const input = btn.previousElementSibling;
  if (!input.value || !input.value.includes('@')) {
    input.style.borderColor = 'var(--terracotta)';
    input.focus();
    return;
  }
  
  const originalText = btn.textContent;
  btn.textContent = '✓ Subscribed!';
  btn.style.background = 'var(--forest)';
  input.value = '';
  
  setTimeout(() => { 
    btn.textContent = originalText; 
    btn.style.background = ''; 
  }, 3000);
}

// ─── INIT ───
document.addEventListener('DOMContentLoaded', () => {
  initTimer();
  initScrollReveal();
  
  // Marquee duplication
  const track = document.querySelector('.announcement-track');
  if (track) {
    track.innerHTML += track.innerHTML;
  }

  // Mobile nav toggle
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      mainNav.classList.toggle('mobile-open');
    });
  }
});
