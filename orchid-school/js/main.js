/* ============================================================
   ORCHID ENGLISH SECONDARY SCHOOL — Shared JS
   ============================================================ */

/* ---- Mobile nav ---- */
function toggleMenu(){
  document.getElementById('navLinks').classList.toggle('open');
}
// mobile dropdown toggle
document.addEventListener('click', function(e){
  if(window.innerWidth <= 900){
    const top = e.target.closest('.nav-links > li > a');
    if(top && top.nextElementSibling && top.nextElementSibling.classList.contains('dropdown')){
      e.preventDefault();
      top.parentElement.classList.toggle('open-sub');
    }
  }
});

/* ---- Scroll reveal ---- */
const io = new IntersectionObserver(entries=>{
  entries.forEach(en=>{ if(en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target); }});
},{threshold:0.12});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

/* ---- Hero slideshow ---- */
(function(){
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero .dot');
  if(!slides.length) return;
  let cur = 0, timer;
  function go(n){
    slides[cur].classList.remove('active'); if(dots[cur]) dots[cur].classList.remove('active');
    cur = (n+slides.length)%slides.length;
    slides[cur].classList.add('active'); if(dots[cur]) dots[cur].classList.add('active');
  }
  window.heroGo = go;
  function next(){ go(cur+1); }
  timer = setInterval(next, 5000);
  const hero = document.querySelector('.hero');
  hero.addEventListener('mouseenter',()=>clearInterval(timer));
  hero.addEventListener('mouseleave',()=>{ timer = setInterval(next,5000); });
})();

/* ---- Admission popup (shows first visit only) ----
   Uses localStorage so it appears once per browser. To show it again on every
   visit instead, change POPUP_ONCE to false. To re-show after the school updates
   the graphic, bump POPUP_VERSION (e.g. 'v2').                                   */
const POPUP_ONCE = true;
const POPUP_VERSION = 'v1';
(function(){
  const overlay = document.getElementById('admissionPopup');
  if(!overlay) return;
  function close(){
    overlay.classList.remove('show');
    if(POPUP_ONCE){ try{ localStorage.setItem('orchidPopupSeen', POPUP_VERSION); }catch(e){} }
  }
  window.closePopup = close;
  overlay.addEventListener('click', e=>{ if(e.target===overlay) close(); });
  document.addEventListener('keydown', e=>{ if(e.key==='Escape') close(); });
  let seen = false;
  if(POPUP_ONCE){ try{ seen = localStorage.getItem('orchidPopupSeen') === POPUP_VERSION; }catch(e){} }
  if(!seen){ setTimeout(()=> overlay.classList.add('show'), 1200); }
})();

/* ---- Testimonial filter ---- */
function filterTesti(cat, tab){
  document.querySelectorAll('.testi-tab').forEach(t=>t.classList.remove('active'));
  tab.classList.add('active');
  document.querySelectorAll('.testi-card').forEach(c=>{
    c.style.display = (cat==='all' || c.dataset.cat===cat) ? 'block' : 'none';
  });
}

/* ---- Gallery filter ---- */
function filterGallery(cat, tab){
  document.querySelectorAll('.gal-tab').forEach(t=>t.classList.remove('active'));
  tab.classList.add('active');
  document.querySelectorAll('.gal-item').forEach(c=>{
    c.style.display = (cat==='all' || c.dataset.cat===cat) ? 'block' : 'none';
  });
}

/* ---- Contact / inquiry form (mailto handoff) ---- */
function handleContact(e){
  e.preventDefault();
  const f = e.target;
  const name = (f.querySelector('[name=name]')||{}).value || '';
  const email = (f.querySelector('[name=email]')||{}).value || '';
  const phone = (f.querySelector('[name=phone]')||{}).value || '';
  const subject = (f.querySelector('[name=subject]')||{}).value || 'Website Inquiry';
  const message = (f.querySelector('[name=message]')||{}).value || '';
  const body = `Name: ${name}%0D%0AEmail: ${email}%0D%0APhone: ${phone}%0D%0A%0D%0A${message}`;
  window.location.href = `mailto:accounts@orchidharion.edu.np?subject=${encodeURIComponent(subject)}&body=${body}`;
  const msg = f.querySelector('.form-msg');
  if(msg) msg.style.display = 'block';
  return false;
}

/* ---- Notice Board: optional live Google Sheet feed ----
   To go live: publish a Google Sheet as CSV (File > Share > Publish to web > CSV)
   with columns: Date, Title, Description. Paste the CSV URL below.        */
const NOTICE_CSV_URL = ""; // <-- paste published CSV link here when ready
(function(){
  const wrap = document.getElementById('noticeFeed');
  if(!wrap || !NOTICE_CSV_URL) return;
  fetch(NOTICE_CSV_URL).then(r=>r.text()).then(csv=>{
    const rows = csv.trim().split('\n').slice(1).map(r=>r.split(','));
    if(!rows.length) return;
    wrap.innerHTML = rows.map(([date,title,desc])=>`
      <div class="notice-row reveal in">
        <div class="notice-date-box"><span>${(date||'').trim()}</span></div>
        <div class="notice-row-body"><h4>${(title||'').trim()}</h4><p>${(desc||'').trim()}</p></div>
      </div>`).join('');
  }).catch(()=>{});
})();
