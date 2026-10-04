/* ============================================================
   Grace Julius — Portfolio scripts
   Vanilla JS, no dependencies. Respects prefers-reduced-motion.
   ============================================================ */
(function(){
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function(s, r){ return (r||document).querySelector(s); };
  var $$ = function(s, r){ return Array.prototype.slice.call((r||document).querySelectorAll(s)); };

  /* current year in footer */
  $('#yr').textContent = new Date().getFullYear();

  /* nav background on scroll + scroll-progress bar + back-to-top */
  var nav = $('#nav'), bar = $('#progress'), toTop = $('#toTop');
  function onScroll(){
    var y = window.scrollY || 0;
    nav.classList.toggle('solid', y > 40);
    toTop.classList.toggle('show', y > window.innerHeight);
    var h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (h > 0 ? (y/h)*100 : 0) + '%';
  }
  window.addEventListener('scroll', onScroll, {passive:true}); onScroll();

  /* mobile menu toggle */
  var burger = $('#burger'), menu = $('#menu');
  burger.addEventListener('click', function(){
    var open = menu.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
  });
  menu.addEventListener('click', function(e){
    if(e.target.tagName==='A'){ menu.classList.remove('open'); burger.setAttribute('aria-expanded', false); }
  });

  /* reveal-on-scroll with staggered delay */
  var reveals = $$('[data-reveal]');
  if(reduce){
    reveals.forEach(function(el){ el.classList.add('in'); });
  } else {
    var ro = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(en.isIntersecting){
          var sibs = Array.prototype.slice.call(en.target.parentNode.children)
            .filter(function(c){ return c.hasAttribute('data-reveal'); });
          var i = sibs.indexOf(en.target);
          en.target.style.transitionDelay = (Math.min(i,6)*70) + 'ms';
          en.target.classList.add('in');
          ro.unobserve(en.target);
        }
      });
    }, {threshold:0.12, rootMargin:'0px 0px -40px 0px'});
    reveals.forEach(function(el){ ro.observe(el); });
  }

  /* active section highlighting — top nav + side rail */
  var navLinks = $$('#menu a, #rail a');
  var secIds = [];
  navLinks.forEach(function(a){ var id = a.getAttribute('href').slice(1); if(secIds.indexOf(id) < 0) secIds.push(id); });
  var spy = new IntersectionObserver(function(entries){
    entries.forEach(function(en){
      if(en.isIntersecting){
        navLinks.forEach(function(a){ a.classList.toggle('active', a.getAttribute('href') === '#'+en.target.id); });
      }
    });
  }, {threshold:0, rootMargin:'-45% 0px -54% 0px'});
  secIds.forEach(function(id){ var s = document.getElementById(id); if(s) spy.observe(s); });

  /* count-up stat numbers */
  var counted = new IntersectionObserver(function(entries){
    entries.forEach(function(en){
      if(en.isIntersecting){
        var el = en.target, target = parseFloat(el.getAttribute('data-count'));
        var decimals = (el.getAttribute('data-count').split('.')[1]||'').length;
        if(reduce){ el.textContent = target.toFixed(decimals); counted.unobserve(el); return; }
        var start = null, dur = 1000;
        function step(ts){
          if(!start) start = ts;
          var p = Math.min((ts-start)/dur, 1);
          el.textContent = (p*target).toFixed(decimals);
          if(p<1) requestAnimationFrame(step); else el.textContent = target.toFixed(decimals);
        }
        requestAnimationFrame(step);
        counted.unobserve(el);
      }
    });
  }, {threshold:0.5});
  $$('[data-count]').forEach(function(el){ counted.observe(el); });

  /* TheBlip evaluation bars fill when visible */
  var bars = new IntersectionObserver(function(entries){
    entries.forEach(function(en){
      if(en.isIntersecting){ en.target.style.width = en.target.getAttribute('data-w') + '%'; bars.unobserve(en.target); }
    });
  }, {threshold:0.6});
  $$('.bar-fill').forEach(function(el){ bars.observe(el); });

  /* project filters */
  var filters = $('#filters'), cards = $$('#workGrid .card');
  if(filters){
    filters.addEventListener('click', function(e){
      if(e.target.tagName!=='BUTTON') return;
      var f = e.target.getAttribute('data-filter');
      $$('button', filters).forEach(function(b){ b.classList.toggle('on', b===e.target); b.setAttribute('aria-pressed', b===e.target); });
      cards.forEach(function(c){
        var show = f==='all' || (c.getAttribute('data-cat')||'').split(' ').indexOf(f) > -1;
        c.classList.toggle('hide', !show);
      });
    });
  }

  /* publications: filter by type and by research lens */
  var THEMES = {policy:'Tech Policy', ethics:'Ethics', css:'Computational Social Science', hcai:'Human-Centered AI'};
  var pubState = {type:'all', theme:null};
  var pubs = $$('#pubList .pub'), pubFilters = $('#pubFilters');
  var pill = $('#themePill'), pillName = $('#themePillName'), pubCount = $('#pubCount');
  var pillars = $$('.pillar[data-theme]');

  function applyPubs(){
    var shown = 0;
    pubs.forEach(function(p){
      var okType = pubState.type==='all' || p.getAttribute('data-type')===pubState.type;
      var okTheme = !pubState.theme || (p.getAttribute('data-themes')||'').split(' ').indexOf(pubState.theme) > -1;
      var show = okType && okTheme;
      p.classList.toggle('hide', !show);
      if(show){ shown++; p.classList.add('in'); }
    });
    $$('button', pubFilters).forEach(function(b){
      var on = b.getAttribute('data-type')===pubState.type;
      b.classList.toggle('on', on); b.setAttribute('aria-pressed', on);
    });
    pill.hidden = !pubState.theme;
    if(pubState.theme) pillName.textContent = THEMES[pubState.theme];
    pillars.forEach(function(pl){
      var on = pl.getAttribute('data-theme')===pubState.theme;
      pl.classList.toggle('selected', on); pl.setAttribute('aria-pressed', on);
    });
    pubCount.textContent = (pubState.type==='all' && !pubState.theme) ? '' :
      'Showing ' + shown + ' of ' + pubs.length;
  }
  pubFilters.addEventListener('click', function(e){
    if(e.target.tagName!=='BUTTON') return;
    pubState.type = e.target.getAttribute('data-type'); applyPubs();
  });
  $('#themeClear').addEventListener('click', function(){ pubState.theme = null; applyPubs(); });
  pillars.forEach(function(pl){
    pl.addEventListener('click', function(){
      var t = pl.getAttribute('data-theme');
      pubState.theme = (pubState.theme === t) ? null : t;
      pubState.type = 'all';
      applyPubs();
      if(pubState.theme) $('#publications').scrollIntoView({behavior: reduce ? 'auto' : 'smooth'});
    });
  });
  applyPubs();

  /* copy citation */
  var toast = $('#toast'), toastT;
  function showToast(msg){
    toast.textContent = msg; toast.classList.add('show');
    clearTimeout(toastT); toastT = setTimeout(function(){ toast.classList.remove('show'); }, 1800);
  }
  $$('[data-cite]').forEach(function(b){
    b.addEventListener('click', function(){
      var text = b.getAttribute('data-cite');
      function done(){ showToast('Citation copied'); }
      if(navigator.clipboard && window.isSecureContext){
        navigator.clipboard.writeText(text).then(done, function(){ fallbackCopy(text); done(); });
      } else { fallbackCopy(text); done(); }
    });
  });
  function fallbackCopy(text){
    var ta = document.createElement('textarea');
    ta.value = text; ta.setAttribute('readonly',''); ta.style.position='fixed'; ta.style.opacity='0';
    document.body.appendChild(ta); ta.select();
    try{ document.execCommand('copy'); }catch(e){}
    document.body.removeChild(ta);
  }

  /* hero rotating word */
  var rot = $('#rotator span'), words = ['justice','privacy','access','accountability','trust'], wi = 0;
  if(rot && !reduce){
    setInterval(function(){
      rot.classList.add('out');
      setTimeout(function(){
        wi = (wi+1) % words.length;
        rot.textContent = words[wi];
        rot.classList.remove('out'); rot.classList.add('in-start');
        void rot.offsetWidth;
        rot.classList.remove('in-start');
      }, 350);
    }, 2400);
  }

  /* terminal boot sequence */
  var termText = $('#termText');
  var lines = [
    {p:'$ ', t:'whoami'},
    {o:'> grace_julius'},
    {p:'$ ', t:'cat ./question.txt'},
    {o:'> who does this technology serve — and who does it leave behind?'},
    {p:'$ ', t:'ls ./lenses'},
    {o:'> tech-policy  ethics  comp-social-science  human-centered-ai'}
  ];
  if(reduce){
    termText.innerHTML = lines.map(function(l){
      return l.p ? '<span class="pr">'+l.p+'</span>'+l.t : '<span class="out">'+l.o+'</span>';
    }).join('<br>');
  } else {
    var li=0, html='';
    (function typeLine(){
      if(li>=lines.length){ return; }
      var l = lines[li];
      if(l.o){
        html += '<span class="out">'+l.o+'</span><br>';
        termText.innerHTML = html + '<span class="cur"></span>';
        li++; setTimeout(typeLine, 320);
      } else {
        html += '<span class="pr">'+l.p+'</span>';
        var i=0, t=l.t;
        (function ty(){
          termText.innerHTML = html + t.slice(0,i) + '<span class="cur"></span>';
          if(i<t.length){ i++; setTimeout(ty, 42); }
          else { html += t + '<br>'; li++; setTimeout(typeLine, 260); }
        })();
      }
    })();
  }

  /* quick-navigation palette (⌘K / Ctrl+K / "/") */
  var palette = $('#palette'), pInput = $('#paletteInput'), pList = $('#paletteList'), lastFocus = null;
  var isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
  $('#kbdHint').textContent = isMac ? '⌘K' : 'Ctrl K';
  var items = [];
  $$('#rail a').forEach(function(a){ items.push({label:a.getAttribute('data-label'), kind:'Section', href:a.getAttribute('href')}); });
  $$('#pubList .pub').forEach(function(p, i){
    if(!p.id) p.id = 'pub-' + (i+1);
    items.push({label:$('h3', p).textContent, kind:p.getAttribute('data-type')==='talk' ? 'Talk' : 'Paper', href:'#'+p.id});
  });
  var feat = $('.feature'); feat.id = 'theblip';
  items.push({label:'TheBlip — SteelHacks 2026', kind:'Project', href:'#theblip'});
  $$('#workGrid .card').forEach(function(c, i){
    if(!c.id) c.id = 'project-' + (i+1);
    items.push({label:$('h3', c).textContent, kind:'Project', href:'#'+c.id});
  });
  items.push({label:'Résumé (PDF)', kind:'Open', href:'assets/resume.pdf', ext:true});
  items.push({label:'Email Grace', kind:'Contact', href:'mailto:gjuliusanu@gmail.com', ext:true});
  items.push({label:'LinkedIn', kind:'Link', href:'https://www.linkedin.com/in/grace-julius/', ext:true});
  items.push({label:'GitHub', kind:'Link', href:'https://github.com/GraceJulius', ext:true});

  var results = [], sel = 0;
  function render(){
    var q = pInput.value.trim().toLowerCase();
    results = items.filter(function(it){ return !q || (it.label+' '+it.kind).toLowerCase().indexOf(q) > -1; });
    sel = Math.min(sel, Math.max(results.length-1, 0));
    pList.innerHTML = '';
    if(!results.length){
      var e = document.createElement('li'); e.className='empty'; e.textContent='No matches'; pList.appendChild(e); return;
    }
    results.forEach(function(it, i){
      var li = document.createElement('li');
      li.setAttribute('role','option'); li.id = 'pal-'+i;
      li.setAttribute('aria-selected', i===sel);
      var a = document.createElement('span'); a.textContent = it.label;
      var k = document.createElement('span'); k.className='pk'; k.textContent = it.kind;
      li.appendChild(a); li.appendChild(k);
      li.addEventListener('mousemove', function(){ if(sel!==i){ sel=i; mark(); } });
      li.addEventListener('click', function(){ go(it); });
      pList.appendChild(li);
    });
    pInput.setAttribute('aria-activedescendant', 'pal-'+sel);
  }
  function mark(){
    $$('li', pList).forEach(function(li, i){ li.setAttribute('aria-selected', i===sel); });
    var cur = $('#pal-'+sel); if(cur) cur.scrollIntoView({block:'nearest'});
    pInput.setAttribute('aria-activedescendant', 'pal-'+sel);
  }
  function go(it){
    closePalette(true);
    if(it.ext){ window.open(it.href, it.href.indexOf('mailto:')===0 ? '_self' : '_blank', 'noopener'); return; }
    var t = document.querySelector(it.href);
    if(t){
      t.scrollIntoView({behavior: reduce ? 'auto' : 'smooth', block: it.kind==='Section' ? 'start' : 'center'});
      t.classList.add('in');
      if(it.kind==='Paper' || it.kind==='Talk'){
        pubState.type = 'all'; pubState.theme = null; applyPubs();
        flash(t);
      } else if(it.kind==='Project'){
        var all = $('#filters button[data-filter="all"]'); if(all) all.click();
        flash(t);
      }
      history.replaceState(null, '', it.href);
    }
  }
  function flash(el){
    el.style.transition = 'box-shadow .3s';
    el.style.boxShadow = '0 0 0 2px rgba(255,176,0,.7)';
    setTimeout(function(){ el.style.boxShadow = ''; }, 1400);
  }
  function openPalette(){
    lastFocus = document.activeElement;
    palette.hidden = false; pInput.value = ''; sel = 0; render();
    pInput.focus();
  }
  function closePalette(skipRestore){
    palette.hidden = true;
    if(!skipRestore && lastFocus && lastFocus.focus) lastFocus.focus();
  }
  $('#paletteBtn').addEventListener('click', openPalette);
  palette.addEventListener('click', function(e){ if(e.target===palette) closePalette(); });
  pInput.addEventListener('input', function(){ sel = 0; render(); });
  pInput.addEventListener('keydown', function(e){
    if(e.key==='ArrowDown'){ e.preventDefault(); if(results.length){ sel=(sel+1)%results.length; mark(); } }
    else if(e.key==='ArrowUp'){ e.preventDefault(); if(results.length){ sel=(sel-1+results.length)%results.length; mark(); } }
    else if(e.key==='Enter'){ e.preventDefault(); if(results[sel]) go(results[sel]); }
    else if(e.key==='Tab'){ e.preventDefault(); }
  });
  document.addEventListener('keydown', function(e){
    var typing = /INPUT|TEXTAREA|SELECT/.test((e.target.tagName||'')) || e.target.isContentEditable;
    if((e.metaKey || e.ctrlKey) && e.key.toLowerCase()==='k'){ e.preventDefault(); palette.hidden ? openPalette() : closePalette(); }
    else if(e.key==='/' && !typing && palette.hidden){ e.preventDefault(); openPalette(); }
    else if(e.key==='Escape' && !palette.hidden){ closePalette(); }
  });

  /* soft cursor glow (desktop + motion-ok only) */
  if(!reduce && window.matchMedia('(pointer:fine)').matches){
    var glow = $('#cursorGlow'), gx=0, gy=0, tx=0, ty=0, on=false;
    window.addEventListener('mousemove', function(e){ tx=e.clientX; ty=e.clientY; if(!on){on=true;glow.style.opacity=1;} });
    (function loop(){ gx+=(tx-gx)*.12; gy+=(ty-gy)*.12; glow.style.transform='translate('+gx+'px,'+gy+'px) translate(-50%,-50%)'; requestAnimationFrame(loop); })();
  }
})();
