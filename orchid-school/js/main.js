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

/* ---- Notice Board: live Google Sheet feed ----
   Published Google Sheet (File > Share > Publish to web > CSV).
   Columns: Date, Title, Description. To change the sheet, replace the URL below. */
const NOTICE_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRrM0wznJy7Tln5YaSFzLZA6x8VJrMOXrO9BpSg6zZOhVW8RdJZMUNHbYVeRrRE0ZmP6iiUrLaZwBUI/pub?output=csv";

// Proper CSV parser: handles quoted fields, commas inside quotes, and escaped quotes ("")
function parseCSV(text){
  const rows=[]; let row=[], field='', inQ=false;
  for(let i=0;i<text.length;i++){
    const c=text[i];
    if(inQ){
      if(c==='"'){ if(text[i+1]==='"'){field+='"';i++;} else inQ=false; }
      else field+=c;
    } else {
      if(c==='"') inQ=true;
      else if(c===',') { row.push(field); field=''; }
      else if(c==='\n'){ row.push(field); rows.push(row); row=[]; field=''; }
      else if(c==='\r'){ /* skip */ }
      else field+=c;
    }
  }
  if(field.length||row.length){ row.push(field); rows.push(row); }
  return rows;
}
function escapeHTML(s){return (s||'').replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));}
// Format a BS date like 2083/03/15 -> {day:'15', month:'Ashar'}; else show raw text
function formatNoticeDate(raw){
  const months=['','Baishakh','Jestha','Ashar','Shrawan','Bhadra','Ashwin','Kartik','Mangsir','Poush','Magh','Falgun','Chaitra'];
  const m=(raw||'').trim().match(/^(\d{4})[\/\-.](\d{1,2})[\/\-.](\d{1,2})$/);
  if(m){ const mo=parseInt(m[2],10); return {day:m[3].replace(/^0/,''), month:months[mo]||m[2]}; }
  return {day:'📌', month:(raw||'').trim().slice(0,6)};
}
(function(){
  const feed = document.getElementById('noticeFeed');       // full Notice Board page
  const home = document.getElementById('noticeListHome');    // homepage preview box
  if((!feed && !home) || !NOTICE_CSV_URL) return;
  fetch(NOTICE_CSV_URL).then(r=>r.text()).then(csv=>{
    let rows = parseCSV(csv).filter(r=>r.length>=2 && (r[0]||r[1]));
    if(rows.length) rows = rows.slice(1); // drop header
    if(!rows.length) return;

    if(feed){
      feed.innerHTML = rows.map(([date,title,desc])=>{
        const d=formatNoticeDate(date);
        return `<div class="notice-row reveal in">
          <div class="notice-date-big"><b>${escapeHTML(d.day)}</b><small>${escapeHTML(d.month)}</small></div>
          <div class="notice-row-body"><span class="ntag">📢 Notice</span><h4>${escapeHTML((title||'').trim())}</h4><p>${escapeHTML((desc||'').trim())}</p></div>
        </div>`;
      }).join('');
      const fb=document.getElementById('noticeFallback'); if(fb) fb.style.display='none';
    }

    if(home){
      home.innerHTML = rows.slice(0,3).map(([date,title,desc])=>{
        const d=formatNoticeDate(date);
        return `<div class="notice-li"><div class="notice-date-box"><b>${escapeHTML(d.day)}</b><small>${escapeHTML(d.month)}</small></div><div class="notice-li-body"><h5>${escapeHTML((title||'').trim())}</h5><p>${escapeHTML((desc||'').trim())}</p></div></div>`;
      }).join('');
    }
  }).catch(()=>{ /* keep static fallback on error */ });
})();
