/* ============================================================
   Grace Julius — Portfolio scripts
   Vanilla JS, no dependencies. Respects prefers-reduced-motion.
   ============================================================ */
(function(){
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* current year in footer */
  document.getElementById('yr').textContent = new Date().getFullYear();

  /* nav background on scroll + scroll-progress bar */
  var nav = document.getElementById('nav'), bar = document.getElementById('progress');
  function onScroll(){
    var y = window.scrollY || 0;
    nav.classList.toggle('solid', y > 40);
    var h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (h > 0 ? (y/h)*100 : 0) + '%';
  }
  window.addEventListener('scroll', onScroll, {passive:true}); onScroll();

  /* mobile menu toggle */
  var burger = document.getElementById('burger'), menu = document.getElementById('menu');
  burger.addEventListener('click', function(){
    var open = menu.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
  });
  menu.addEventListener('click', function(e){ if(e.target.tagName==='A') menu.classList.remove('open'); });

  /* reveal-on-scroll with staggered delay */
  var reveals = document.querySelectorAll('[data-reveal]');
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

  /* active nav link highlighting */
  var links = Array.prototype.slice.call(document.querySelectorAll('#menu a'));
  var secIds = links.map(function(a){ return a.getAttribute('href').slice(1); });
  var spy = new IntersectionObserver(function(entries){
    entries.forEach(function(en){
      if(en.isIntersecting){
        links.forEach(function(a){ a.classList.toggle('active', a.getAttribute('href') === '#'+en.target.id); });
      }
    });
  }, {threshold:0.2, rootMargin:'-30% 0px -60% 0px'});
  secIds.forEach(function(id){ var s=document.getElementById(id); if(s) spy.observe(s); });

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
  document.querySelectorAll('[data-count]').forEach(function(el){ counted.observe(el); });

  /* work / project filters */
  var filters = document.getElementById('filters'), cards = document.querySelectorAll('#workGrid .card');
  if(filters){
    filters.addEventListener('click', function(e){
      if(e.target.tagName!=='BUTTON') return;
      var f = e.target.getAttribute('data-filter');
      filters.querySelectorAll('button').forEach(function(b){ b.classList.toggle('on', b===e.target); });
      cards.forEach(function(c){
        var show = f==='all' || (c.getAttribute('data-cat')||'').indexOf(f) > -1;
        c.classList.toggle('hide', !show);
      });
    });
  }

  /* terminal boot sequence */
  var termText = document.getElementById('termText');
  var lines = [
    {p:'$ ', t:'whoami'},
    {o:'> grace_julius'},
    {p:'$ ', t:'cat ./focus.txt'},
    {o:'> human-centered AI  ×  cybersecurity'},
    {p:'$ ', t:'./init --role'},
    {o:'> practitioner-researcher'}
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

  /* soft cursor glow (desktop + motion-ok only) */
  if(!reduce && window.matchMedia('(pointer:fine)').matches){
    var glow = document.getElementById('cursorGlow'), gx=0, gy=0, tx=0, ty=0, on=false;
    window.addEventListener('mousemove', function(e){ tx=e.clientX; ty=e.clientY; if(!on){on=true;glow.style.opacity=1;} });
    (function loop(){ gx+=(tx-gx)*.12; gy+=(ty-gy)*.12; glow.style.transform='translate('+gx+'px,'+gy+'px) translate(-50%,-50%)'; requestAnimationFrame(loop); })();
  }
})();
