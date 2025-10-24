// script.js - final single-page app logic
document.addEventListener('DOMContentLoaded', ()=>{
  // Run home entrance animation on initial load
  function runHomeEntranceAnimation() {
    const homeSection = document.getElementById('homeSection');
    if (!homeSection) return;
    // Animate home title and subtitle
    const homeTitle = document.querySelector('.home-title');
    const homeSub = document.querySelector('.home-sub');
    if (homeTitle) {
      homeTitle.style.opacity = 0;
      homeTitle.style.transform = 'translateY(-30px)';
      setTimeout(()=>{
        homeTitle.style.transition = 'opacity 0.6s cubic-bezier(.4,1.4,.6,1), transform 0.6s cubic-bezier(.4,1.4,.6,1)';
        homeTitle.style.opacity = 1;
        homeTitle.style.transform = 'translateY(0)';
      }, 60);
    }
    if (homeSub) {
      // Typewriter effect for subtitle
      const text = 'Interactive visualizer for CPU Scheduling algorithms — FCFS, SJF & Priority.';
      homeSub.style.opacity = 1;
      homeSub.style.transform = 'translateY(0)';
      homeSub.textContent = '';
      let i = 0;
      function typeNext() {
        if (i <= text.length) {
          homeSub.textContent = text.slice(0, i);
          i++;
          setTimeout(typeNext, 18);
        }
      }
      setTimeout(typeNext, 180);
    }
    // Animate cards
    const cards = document.querySelectorAll('.card');
    const cardDescs = [
      'First come, first serve: the process that arrives first gets CPU first.',
      'Shortest job first: CPU picks the process with the smallest burst time next.',
      'Each process has a priority; CPU runs the one with the highest priority first.'
    ];
    cards.forEach((card, i) => {
      card.style.opacity = 0;
      card.style.transform = 'translateY(40px) scale(0.97)';
      setTimeout(()=>{
        card.style.transition = 'opacity 0.5s cubic-bezier(.4,1.4,.6,1), transform 0.5s cubic-bezier(.4,1.4,.6,1)';
        card.style.opacity = 1;
        card.style.transform = 'translateY(0) scale(1)';
        // Typewriter for card description
        const descEl = card.querySelector('.card-desc');
        if (descEl && cardDescs[i]) {
          descEl.textContent = '';
          let j = 0;
          function typeCardDesc() {
            if (j <= cardDescs[i].length) {
              descEl.textContent = cardDescs[i].slice(0, j);
              j++;
              setTimeout(typeCardDesc, 13);
            }
          }
          setTimeout(typeCardDesc, 120);
        }
      }, 320 + i*100);
    });
  }

  // Only run if home section is visible on load
  if (!document.getElementById('schedSection') || document.getElementById('schedSection').classList.contains('hidden')) {
    runHomeEntranceAnimation();
  }

  // Scheduling entrance animation
  function runSchedulingEntranceAnimation() {
    const schedTitle = document.getElementById('schedTitle');
    const schedDesc = document.getElementById('schedDesc');
    const primaryCard = document.getElementById('primaryCard');
    const processRows = Array.from(document.querySelectorAll('.process-block'));

    if (schedTitle) {
      schedTitle.style.opacity = 0;
      schedTitle.style.transform = 'translateY(-18px)';
      setTimeout(()=>{
        schedTitle.style.transition = 'opacity 0.45s ease, transform 0.45s ease';
        schedTitle.style.opacity = 1;
        schedTitle.style.transform = 'translateY(0)';
      }, 80);
    }
    if (schedDesc) {
      // simple typewriter for scheduling description
      const text = schedDesc.getAttribute('data-full') || schedDesc.textContent.trim();
      schedDesc.textContent = '';
      let i = 0;
      function typeSched() {
        if (i <= text.length) {
          schedDesc.textContent = text.slice(0, i);
          i++;
          setTimeout(typeSched, 16);
        }
      }
      setTimeout(typeSched, 120);
    }

    if (primaryCard) {
      primaryCard.style.opacity = 0;
      primaryCard.style.transform = 'translateY(12px) scale(0.995)';
      setTimeout(()=>{
        primaryCard.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        primaryCard.style.opacity = 1;
        primaryCard.style.transform = 'translateY(0) scale(1)';
      }, 220);
    }

    // animate process rows staggered
    processRows.forEach((r, idx) => {
      r.style.opacity = 0;
      r.style.transform = 'translateX(-8px)';
      setTimeout(()=>{
        r.style.transition = 'opacity 0.36s ease, transform 0.36s ease';
        r.style.opacity = 1;
        r.style.transform = 'translateX(0)';
      }, 260 + idx * 60);
    });
  }

  // If schedSection is visible on load (deep link), run its animation
  if (document.getElementById('schedSection') && !document.getElementById('schedSection').classList.contains('hidden')) {
    runSchedulingEntranceAnimation();
  }

// Elements
const homeSection = document.getElementById('homeSection');
const schedSection = document.getElementById('schedSection');
const solutionTray = document.getElementById('solutionTray');
const aboutModal = document.getElementById('aboutModal');
const darkToggle = document.getElementById('darkToggle');
const logoBtn = document.getElementById('logoBtn');
const homeBtn = document.getElementById('homeBtn');
const aboutBtn = document.getElementById('aboutBtn');
const closeAbout = document.getElementById('closeAbout');
const hamburgerBtn = document.getElementById('hamburgerBtn');
const mobileMenu = document.getElementById('mobileMenu');
const mobileHome = document.getElementById('mobileHome');
const mobileAbout = document.getElementById('mobileAbout');
const mobileDarkToggle = document.getElementById('mobileDarkToggle');
const processList = document.getElementById('processList');
const computeBtn = document.getElementById('computeBtn');
const navBtns = Array.from(document.querySelectorAll('.nav-btn'));
const cards = Array.from(document.querySelectorAll('.card'));
const schedVideo = document.getElementById('schedVideo');
const videoSource = document.getElementById('videoSource');
const playBtn = document.getElementById('playBtn');

// set default volume for videos (40%)
try{
  if(schedVideo) schedVideo.volume = 0.1;
  // also set any other video elements on the page
  document.querySelectorAll('video').forEach(v=>{ try{ v.volume = 0.1 }catch(e){} });
}catch(e){/* ignore on browsers that block autoplay volume changes */}

  // header tray logic: allow dismissing and auto-hide after a delay
  const headerTray = document.getElementById('headerTray');
  const headerTrayClose = document.getElementById('headerTrayClose');
  if (headerTrayClose && headerTray) {
    headerTrayClose.addEventListener('click', ()=> {
      headerTray.classList.add('hidden');
    });
    // auto-hide after 6 seconds
    setTimeout(()=>{ headerTray.classList.add('hidden'); }, 6000);
  }

let currentType = 'fcfs';

// tiny typewriter effect: writes text into element then adds caret blink
function typewriter(el, text, speed=24){
  el.textContent = '';
  el.classList.add('typewriter','caret-blink');
  let i=0;
  const t = setInterval(()=>{
    el.textContent = text.slice(0,i+1);
    i++;
    if(i>=text.length){ clearInterval(t); setTimeout(()=> el.classList.remove('caret-blink'), 600); }
  }, speed);
}

// Initialize processes (6 rows)
const defaultProcs = ['P1','P2','P3','P4','P5','P6'];
function createRow(name, i){
  const row = document.createElement('div');
  row.className = 'process-block';
  row.draggable = true;
  row.innerHTML = `
    <div class="col-process"><div class="label">${name}</div></div>
  <div class="col-burst"><div class="burst-wrap"><input class="burst-input" inputmode="numeric" pattern="[0-9]*" type="text" value="" placeholder="INSERT #" /></div></div>
    <div class="col-waiting"><div class="waiting-display">0</div></div>
  <div class="col-prio" style="text-align:center"><input class="priority-input" inputmode="numeric" pattern="[0-9]*" type="number" min="1" max="6" value="1" /></div>
  `;
  // sanitize inputs (numeric only)
  const burst = row.querySelector('.burst-input');
  const prio = row.querySelector('.priority-input');
  // burst: numeric-only (integers >= 0)
  burst.addEventListener('input', (e)=>{
    const cleaned = e.target.value.replace(/[^\d]/g,'');
    if(cleaned !== e.target.value){
      row.animate([{transform:'translateX(0)'},{transform:'translateX(-6px)'},{transform:'translateX(6px)'},{transform:'translateX(0)'}],{duration:300});
      e.target.value = cleaned;
    }
  });
  // priority: number input limited from 1 to 6
  prio.addEventListener('input', (e)=>{
    // remove non-digits then clamp
    let v = e.target.value.replace(/[^\d]/g,'');
    if(v === '') v = '';
    else {
      v = parseInt(v,10) || 1;
      if(v < 1) v = 1; if(v > 6) v = 6;
    }
    if(String(v) !== e.target.value){
      row.animate([{transform:'translateX(0)'},{transform:'translateX(-6px)'},{transform:'translateX(6px)'},{transform:'translateX(0)'}],{duration:300});
    }
    e.target.value = v;
  });
  // drag
  row.addEventListener('dragstart', ()=> row.classList.add('dragging'));
  row.addEventListener('dragend', ()=> row.classList.remove('dragging'));
  return row;
}

function renderRows(){
  processList.innerHTML='';
  defaultProcs.forEach((p,i)=> processList.appendChild(createRow(p,i)));
  // enable reordering
  const blocks = Array.from(document.querySelectorAll('.process-block'));
  blocks.forEach(b=>{
    b.addEventListener('dragover',(e)=>{
      e.preventDefault();
      const dragging = document.querySelector('.dragging');
      if(!dragging || dragging===b) return;
      const rect = b.getBoundingClientRect();
      const next = (e.clientY - rect.top) > rect.height/2;
      if(next) b.after(dragging); else b.before(dragging);
    });
  });
}

renderRows();

// Home card click -> transition to scheduling section
cards.forEach(c=> c.addEventListener('click', ()=>{
      const type = c.dataset.type;
      openScheduling(type);
      setActiveNavBtn(type);
}));

function openScheduling(type){
  // set theme and content
  switchType(type);
  // animate sections: fade out home, fade in sched
  homeSection.classList.add('fading-out');
  setTimeout(()=>{
    homeSection.classList.add('hidden');
    schedSection.classList.remove('hidden');
    schedSection.classList.add('fading-in');
    setTimeout(()=> schedSection.classList.remove('fading-in'), 400);
    // run scheduling entrance animations
    runSchedulingEntranceAnimation();
  }, 280);
}

// header buttons
logoBtn.addEventListener('click', ()=> goHome());
homeBtn.addEventListener('click', ()=> goHome());
aboutBtn.addEventListener('click', ()=> { aboutModal.classList.remove('hidden'); aboutModal.style.display='flex'; });

// centralized close handler for the About modal (used by X button, backdrop click, and Esc key)
function closeAboutModal(){
  if(!aboutModal) return;
  aboutModal.classList.add('hidden');
  aboutModal.style.display = 'none';
  // if mobile menu open, close it as well
  try{ if(hamburgerBtn && mobileMenu){ mobileMenu.classList.add('hidden'); hamburgerBtn.setAttribute('aria-expanded','false'); } }catch(e){}
  // return focus to the About button for accessibility
  try{ if(aboutBtn && typeof aboutBtn.focus === 'function') aboutBtn.focus(); else if(logoBtn && typeof logoBtn.focus === 'function') logoBtn.focus(); }catch(e){}
}

closeAbout && closeAbout.addEventListener('click', closeAboutModal);

// Close the modal when clicking/tapping outside the modal-card (backdrop)
if(aboutModal){
  aboutModal.addEventListener('pointerdown', (e)=>{
    const modalCard = aboutModal.querySelector('.modal-card');
    if(!modalCard) return;
    if(!modalCard.contains(e.target)){
      closeAboutModal();
    }
  });
  // Close with Escape key
  document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape' && aboutModal && !aboutModal.classList.contains('hidden')) closeAboutModal(); });
}

// Hamburger / mobile menu handlers
if(hamburgerBtn && mobileMenu){
  hamburgerBtn.addEventListener('click', ()=>{
          const expanded = hamburgerBtn.getAttribute('aria-expanded') === 'true';
          hamburgerBtn.setAttribute('aria-expanded', String(!expanded));
          if(expanded){
            mobileMenu.classList.add('hidden');
          } else {
            mobileMenu.classList.remove('hidden');
            // Add event listener to close menu when clicking outside
            setTimeout(()=>{
              function handleOutsideClick(e) {
                // Only close if click is truly outside the menu and not on any menu item/button
                if (!mobileMenu.contains(e.target) && e.target !== hamburgerBtn) {
                  mobileMenu.classList.add('hidden');
                  hamburgerBtn.setAttribute('aria-expanded','false');
                  document.removeEventListener('mousedown', handleOutsideClick);
                  document.removeEventListener('touchstart', handleOutsideClick);
                  hamburgerBtn.blur();
                }
              }
              // Use capture phase to ensure menu buttons work before closing
              document.addEventListener('mousedown', handleOutsideClick, true);
              document.addEventListener('touchstart', handleOutsideClick, true);
            }, 0);
            // Remove focus/blur logic to avoid interfering with button clicks
          }
  });
}
// Forward mobile menu button actions to existing handlers
mobileHome && mobileHome.addEventListener('click', ()=>{ goHome(); if(mobileMenu){ mobileMenu.classList.add('hidden'); hamburgerBtn.setAttribute('aria-expanded','false'); } });
mobileAbout && mobileAbout.addEventListener('click', ()=>{ aboutModal.classList.remove('hidden'); aboutModal.style.display='flex'; if(mobileMenu){ mobileMenu.classList.add('hidden'); hamburgerBtn.setAttribute('aria-expanded','false'); } });
// Sync mobile dark toggle with main toggle
if(mobileDarkToggle){
  // initialize state to match main toggle
  mobileDarkToggle.checked = darkToggle.checked;
  mobileDarkToggle.addEventListener('change',(e)=>{
    darkToggle.checked = e.target.checked;
    applyTheme(e.target.checked);
  });
  // when main toggle changes, update mobile toggle (already wired to applyTheme above)
  darkToggle.addEventListener('change',(e)=>{ mobileDarkToggle.checked = e.target.checked; });
}

function goHome(){
  schedSection.classList.add('fading-out');
  setTimeout(()=>{
    schedSection.classList.add('hidden');
    // Animate home section entrance
    homeSection.classList.remove('hidden');
    homeSection.classList.remove('fading-out');

    // Animate home title and subtitle
    const homeTitle = document.querySelector('.home-title');
    const homeSub = document.querySelector('.home-sub');
    if (homeTitle) {
      homeTitle.style.opacity = 0;
      homeTitle.style.transform = 'translateY(-30px)';
      setTimeout(()=>{
        homeTitle.style.transition = 'opacity 0.6s cubic-bezier(.4,1.4,.6,1), transform 0.6s cubic-bezier(.4,1.4,.6,1)';
        homeTitle.style.opacity = 1;
        homeTitle.style.transform = 'translateY(0)';
      }, 60);
    }
    if (homeSub) {
      // Typewriter effect for subtitle
      const text = 'Interactive visualizer for CPU Scheduling algorithms — FCFS, SJF & Priority.';
      homeSub.style.opacity = 1;
      homeSub.style.transform = 'translateY(0)';
      homeSub.textContent = '';
      let i = 0;
      function typeNext() {
        if (i <= text.length) {
          homeSub.textContent = text.slice(0, i);
          i++;
          setTimeout(typeNext, 18);
        }
      }
      setTimeout(typeNext, 180);
    }
    // Animate cards
    const cards = document.querySelectorAll('.card');
    const cardDescs = [
      'First come, first serve: the process that arrives first gets CPU first.',
      'Shortest job first: CPU picks the process with the smallest burst time next.',
      'Each process has a priority; CPU runs the one with the highest priority first.'
    ];
    cards.forEach((card, i) => {
      card.style.opacity = 0;
      card.style.transform = 'translateY(40px) scale(0.97)';
      setTimeout(()=>{
        card.style.transition = 'opacity 0.5s cubic-bezier(.4,1.4,.6,1), transform 0.5s cubic-bezier(.4,1.4,.6,1)';
        card.style.opacity = 1;
        card.style.transform = 'translateY(0) scale(1)';
        // Typewriter for card description
        const descEl = card.querySelector('.card-desc');
        if (descEl && cardDescs[i]) {
          descEl.textContent = '';
          let j = 0;
          function typeCardDesc() {
            if (j <= cardDescs[i].length) {
              descEl.textContent = cardDescs[i].slice(0, j);
              j++;
              setTimeout(typeCardDesc, 13);
            }
          }
          setTimeout(typeCardDesc, 120);
        }
      }, 320 + i*100);
    });
  }, 280);
  solutionTray.classList.remove('open');
}

// dark mode toggle - ensure text/input colors update
function applyTheme(isDark){
  if(isDark){
    document.body.classList.remove('light'); document.body.classList.add('dark');
    darkToggle.checked = true;
  } else {
    document.body.classList.remove('dark'); document.body.classList.add('light');
    darkToggle.checked = false;
  }
}
darkToggle.addEventListener('change',(e)=> applyTheme(e.target.checked));
// default dark
applyTheme(true);

// set initial poster thumbnail
schedVideo.poster = 'FCFS_THUMBNAIL.png';

// nav buttons behaviour
navBtns.forEach(btn=> btn.addEventListener('click', ()=>{
      setActiveNavBtn(btn.dataset.type);
      switchType(btn.dataset.type);
}));
    
function setActiveNavBtn(type) {
  navBtns.forEach(n => {
    if (n.dataset.type === type) n.classList.add('active');
    else n.classList.remove('active');
  });
}

function switchType(type){
  currentType = type;
  // title + desc + colors
  const title = document.getElementById('schedTitle');
  const desc = document.getElementById('schedDesc');
  const cardLabel = document.getElementById('cardLabel');
  const secondaryBg = document.getElementById('secondaryBg');
  // video switching
  // Remove previous theme classes
  playBtn.classList.remove('theme-red', 'theme-blue', 'theme-purple');
  if(type==='fcfs'){
    videoSource.src = 'FCFS_VIDEO.mp4';
    schedVideo.load();
    schedVideo.poster = 'FCFS_THUMBNAIL.png';
    playBtn.classList.add('theme-red');
  }
  if(type==='priority'){
    videoSource.src = 'PRIORITY_VIDEO.mp4';
    schedVideo.load();
    schedVideo.poster = 'PRIORITY_THUMBNAIL.png';
    playBtn.classList.add('theme-blue');
  }
  if(type==='sjf'){
    videoSource.src = 'SJF_VIDEO.mp4';
    schedVideo.load();
    schedVideo.poster = 'SJF_THUMBNAIL.png';
    playBtn.classList.add('theme-purple');
  }
  // Always reset button text to Play when switching
  playBtn.textContent = 'Play';
  // slide out/in effect for title, then update desc with typewriter
  title.animate([{transform:'translateY(0)',opacity:1},{transform:'translateY(-12px)',opacity:0}],{duration:180,easing:'ease-in'}).onfinish = ()=>{
    // set text and theme
    if(type==='fcfs'){
      title.textContent='FIRST COME FIRST SERVE';
      cardLabel.textContent='FCFS';
      document.body.classList.remove('theme-blue','theme-purple'); document.body.classList.add('theme-red');
      secondaryBg.style.background = 'linear-gradient(90deg,var(--accent-red), rgba(0,0,0,0))';
      typewriter(desc, 'First come, first serve: the process that arrives first gets CPU first.');
    }
    if(type==='priority'){
      title.textContent='PRIORITY';
      cardLabel.textContent='PRIORITY';
      document.body.classList.remove('theme-red','theme-purple'); document.body.classList.add('theme-blue');
      secondaryBg.style.background = 'linear-gradient(90deg,var(--accent-blue), rgba(0,0,0,0))';
      typewriter(desc, 'Each process has a priority number; CPU runs the one with the highest priority first.');
    }
    if(type==='sjf'){
      title.textContent='SHORTEST JOB FIRST';
      cardLabel.textContent='SJF';
      document.body.classList.remove('theme-red','theme-blue'); document.body.classList.add('theme-purple');
      secondaryBg.style.background = 'linear-gradient(90deg,var(--accent-purple), rgba(0,0,0,0))';
      typewriter(desc, 'Shortest job first: CPU picks the process with the smallest burst time next.');
    }

    // secondary background wipe & glow
    secondaryBg.classList.remove('glow');
    void secondaryBg.offsetWidth; // force reflow
    secondaryBg.classList.add('wipe');
    setTimeout(()=>{ secondaryBg.classList.remove('wipe'); secondaryBg.classList.add('glow'); }, 600);

    title.animate([{transform:'translateY(12px)',opacity:0},{transform:'translateY(0)',opacity:1}],{duration:260,easing:'ease-out'});
  };
  // reset AWT and tray
  document.getElementById('awtValue').textContent = '—';
  solutionTray.classList.remove('open');

  // show/hide priority column and inputs depending on type
  const primaryCard = document.getElementById('primaryCard');
  if(type === 'priority'){
    primaryCard.classList.add('has-prio');
  } else {
    primaryCard.classList.remove('has-prio');
  }
}

// Read processes in current order
function readProcesses(){
  const blocks = Array.from(document.querySelectorAll('.process-block'));
  return blocks.map((b,i)=>{
    const name = b.querySelector('.label').textContent.trim();
    const burstRaw = b.querySelector('.burst-input').value.trim();
    const burst = burstRaw === '' ? 0 : parseInt(burstRaw,10) || 0;
    const prioRaw = b.querySelector('.priority-input').value.trim();
    let priority = prioRaw === '' ? 1 : parseInt(prioRaw,10) || 1;
    if(priority < 1) priority = 1; if(priority > 6) priority = 6;
    return {name,burst,origIndex:i,waiting:0,finish:0,priority};
  });
}

// Algorithms (non-preemptive) produce timeline [(pid,duration)]
function computeFCFS(procs){
  let time=0; const steps=[]; const timeline=[];
  procs.forEach(p=>{
    p.waiting = time;
    p.finish = time + p.burst;
    if(p.burst>0){ timeline.push([p.name.replace('P',''), p.burst]); steps.push(`${p.name}: starts at ${p.waiting}, burst ${p.burst}, finishes at ${p.finish}`); }
    else steps.push(`${p.name}: burst 0 → ignored`);
    time = p.finish;
  });
  return {steps,timeline,procs};
}

function computeSJF(procs){
  const order = [...procs].filter(p=>p.burst>0).sort((a,b)=> a.burst - b.burst || a.origIndex - b.origIndex);
  let time=0; const steps=[]; const timeline=[];
  order.forEach(p=>{ p.waiting = time; p.finish = time + p.burst; timeline.push([p.name.replace('P',''), p.burst]); steps.push(`${p.name}: starts at ${p.waiting}, burst ${p.burst}, finishes at ${p.finish}`); time = p.finish; });
  const nameMap = {}; order.forEach(p=> nameMap[p.name]=p);
  procs.forEach(p=>{ if(nameMap[p.name]){ p.waiting = nameMap[p.name].waiting; p.finish = nameMap[p.name].finish } else { p.waiting=0; p.finish=p.burst } });
  return {steps,timeline,procs};
}

function computePriority(procs) {
  // Lower number = higher priority
  const order = [...procs]
    .filter(p => p.burst > 0)
    .sort((a, b) => a.priority - b.priority || a.origIndex - b.origIndex);
  let time = 0;
  const steps = [];
  const timeline = [];
  order.forEach(p => {
    p.waiting = time;
    p.finish = time + p.burst;
    timeline.push([p.name.replace('P', ''), p.burst]);
    steps.push(`${p.name}: starts at ${p.waiting}, burst ${p.burst}, finishes at ${p.finish} (prio ${p.priority})`);
    time = p.finish;
  });
  // Update original procs with computed waiting/finish
  const nameMap = {};
  order.forEach(p => nameMap[p.name] = p);
  procs.forEach(p => {
    if (nameMap[p.name]) {
      p.waiting = nameMap[p.name].waiting;
      p.finish = nameMap[p.name].finish;
    } else {
      p.waiting = 0;
      p.finish = p.burst;
    }
  });
  return { steps, timeline, procs };
}

// Draw Gantt: merge adjacent, create bars proportional to durations, add ticks 0..total
function drawGantt(timeline){
  const ganttInner = document.getElementById('ganttInner');
  const ganttTicks = document.getElementById('ganttTicks');
  ganttInner.innerHTML=''; ganttTicks.innerHTML='';
  if(!timeline || timeline.length===0){ ganttInner.textContent='No timeline — enter bursts and compute.'; const t=document.createElement('div'); t.textContent='0'; ganttTicks.appendChild(t); return; }

  // merge adjacent same pid
  const merged = [];
  for(const seg of timeline){
    const [pid,dur] = seg;
    if(merged.length && merged[merged.length-1][0] === pid) merged[merged.length-1][1] += dur;
    else merged.push([pid,dur]);
  }

  const total = merged.reduce((s,seg)=>s+seg[1],0);
  const palette = ['#e85d5d','#f1995d','#f2d479','#7bd389','#5ad0d8','#5b8bfb','#a35bff','#ff7bd3'];

  let cursor=0;
  merged.forEach(([pid,dur],i)=>{
    const bar = document.createElement('div');
    bar.className='gantt-bar';
    const pct = (dur/total)*100;
    bar.style.width = pct + '%';
    let color = (typeof pid === 'string' && pid.toLowerCase()==='idle') ? getComputedStyle(document.documentElement).getPropertyValue('--gantt-idle') : palette[(parseInt(pid,10)||i)%palette.length];
    color = color.trim();
    bar.style.background = `linear-gradient(90deg, ${color}, ${shadeColor(color,-15)})`;
    const rgb = hexToRgb(color); const lum = (0.299*rgb.r + 0.587*rgb.g + 0.114*rgb.b);
    bar.style.color = lum>160 ? '#111' : '#fff';
    bar.textContent = (Number.isInteger(parseInt(pid,10)) ? `P${pid}` : `${pid}`) + ` (${dur})`;
    bar.style.opacity='0'; ganttInner.appendChild(bar);
    requestAnimationFrame(()=>{ bar.style.transition='opacity 350ms ease-out'; bar.style.opacity='1'; });

    cursor += dur;
    const tick = document.createElement('div'); tick.className='gantt-tick'; tick.style.left = (cursor/total*100) + '%'; tick.textContent = cursor; ganttTicks.appendChild(tick);
  });

  // add starting 0 tick at far left
  const tick0 = document.createElement('div'); tick0.className='gantt-tick'; tick0.style.left='0%'; tick0.textContent='0'; ganttTicks.appendChild(tick0);
}

// helpers
function hexToRgb(hex){ const short=/^#?([a-f\d])([a-f\d])([a-f\d])$/i; hex = hex.replace(short,(m,r,g,b)=> r+r+g+g+b+b); const res=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex); return res?{r:parseInt(res[1],16),g:parseInt(res[2],16),b:parseInt(res[3],16)}:{r:0,g:0,b:0}; }
function shadeColor(hex,percent){ const {r,g,b}=hexToRgb(hex); const t = percent<0?0:255; const p = Math.abs(percent)/100; const R = Math.round((t-r)*p)+r; const G = Math.round((t-g)*p)+g; const B = Math.round((t-b)*p)+b; return `rgb(${R},${G},${B})`; }

// show results (fill waiting cols, AWT, steps, draw gantt)
function showResults(result){
  const {steps,timeline,procs} = result;
  const blocks = Array.from(document.querySelectorAll('.process-block'));
  blocks.forEach(b=>{ const name=b.querySelector('.label').textContent.trim(); const proc=procs.find(p=>p.name===name); b.querySelector('.waiting-display').textContent = proc?proc.waiting:0; });
  const totalWaiting = procs.reduce((s,p)=>s+p.waiting,0); const awt = totalWaiting / procs.length; document.getElementById('awtValue').textContent = awt.toFixed(2);

    const stepsList = document.getElementById('stepsList'); stepsList.innerHTML='';
    // create AWT summary and insert it before the Computation Steps heading
    const awtEl = document.createElement('div');
    awtEl.className = 'tray-awt glow';
    awtEl.textContent = `Average Waiting Time (AWT): ${awt.toFixed(2)}`;
    const stepsArea = document.getElementById('stepsArea');
    // remove existing AWT summary(s) so repeated computes don't accumulate
    if (stepsArea) {
      const prev = stepsArea.querySelectorAll('.tray-awt');
      prev.forEach(p => p.remove());
      if (stepsArea.firstElementChild) stepsArea.insertBefore(awtEl, stepsArea.firstElementChild);
      else stepsArea.appendChild(awtEl);
    }
    // then append computation steps into the steps list below
    steps.forEach(s=>{ const el=document.createElement('div'); el.textContent=s; stepsList.appendChild(el); });

  drawGantt(timeline);
  solutionTray.classList.add('open');
}

// compute orchestration
computeBtn.addEventListener('click', ()=>{
  const procs = readProcesses();
  const totalBurst = procs.reduce((s,p)=>s+p.burst,0);
  const primaryCard = document.getElementById('primaryCard');
  if(totalBurst === 0) {
    // Add shake effect
    primaryCard.classList.add('shake');
    setTimeout(()=>{
      primaryCard.classList.remove('shake');
    }, 500);
    return;
  }
  let result;
  if(currentType==='fcfs') result = computeFCFS(procs);
  if(currentType==='sjf') result = computeSJF(procs);
  if(currentType==='priority') result = computePriority(procs);
  showResults(result);
});

// Enter key to compute
document.addEventListener('keydown',(e)=>{ if(e.key==='Enter') computeBtn.click(); });


// Close button for Gantt chart tray
const trayCloseBtn = document.getElementById('trayCloseBtn');
if (trayCloseBtn && solutionTray) {
  trayCloseBtn.addEventListener('click', ()=> {
    solutionTray.classList.remove('open');
  });
}

// init default view settings
switchType('fcfs');

// Play button logic
if(playBtn && schedVideo){
  playBtn.addEventListener('click', ()=>{
    if (schedVideo.paused || schedVideo.ended) {
      schedVideo.play();
      playBtn.textContent = 'Stop';
    } else {
      schedVideo.pause();
      playBtn.textContent = 'Play';
    }
  });
  // Update button label when video ends
  schedVideo.addEventListener('ended', ()=>{
    playBtn.textContent = 'Play';
  });
}
// Header auto-hide on scroll: efficient rAF-throttled handler
(() => {
  const siteHeader = document.querySelector('.site-header');
  if (!siteHeader) return; // nothing to do if header missing
  let lastY = window.scrollY || 0;
  let ticking = false;
  const threshold = 10; // minimum px change to act

  function onFrame(){
    const y = window.scrollY || 0;
    // ignore tiny scrolls
    if (Math.abs(y - lastY) < threshold) {
      ticking = false;
      return;
    }
    if (y > lastY && y > 80) {
      // scrolling down -> hide
      siteHeader.classList.add('header-hidden');
    } else {
      // scrolling up -> show
      siteHeader.classList.remove('header-hidden');
    }
    lastY = y;
    ticking = false;
  }

  window.addEventListener('scroll', ()=>{
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(onFrame);
    }
  }, { passive: true });
})();
// Video pause: only pause when the page/tab becomes hidden or the window loses OS focus.
(() => {
  const videos = Array.from(document.querySelectorAll('video'));
  if (!videos.length) return;

  const safePause = (v) => { try { if (!v.paused && !v.ended) v.pause(); } catch (_) {} };

  // Pause when the page visibility changes (user switches tabs)
  document.addEventListener('visibilitychange', () => { if (document.hidden) videos.forEach(safePause); });

  // Pause when the window loses focus (OS-level)
  window.addEventListener('blur', () => videos.forEach(safePause));
})();

}); // DOMContentLoaded end
