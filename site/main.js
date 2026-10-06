/* rundbit.de – Ring, Scroll-Bit und Hintergrund-Ringe */
(function(){
  // Das Bit löst sich aus dem Ring und wandert mit dem Lesefortschritt
  var rail=document.querySelector('.rail'), bit=rail.querySelector('.bit'), core=document.getElementById('core');
  var secs=[].slice.call(document.querySelectorAll('main section'));
  function marks(){
    rail.querySelectorAll('.mark').forEach(function(m){m.remove()});
    var max=document.documentElement.scrollHeight-innerHeight;
    secs.forEach(function(s){var p=Math.min(1,Math.max(0,(s.offsetTop-80)/max));var m=document.createElement('span');m.className='mark';m.style.top='calc('+p+' * (64vh - 12px) + 6px)';rail.appendChild(m)});
  }
  function tone(){
    var mid=innerHeight*.5, light=false;
    secs.forEach(function(s){var r=s.getBoundingClientRect();if(r.top<=mid&&r.bottom>mid)light=s.classList.contains('light')});
    var lt=getComputedStyle(document.documentElement).getPropertyValue('--light-text');
    rail.style.color=light?lt:'#F5F4EF';
  }
  function tick(){
    var max=document.documentElement.scrollHeight-innerHeight, y=scrollY;
    rail.style.setProperty('--p',max>0?y/max:0);
    var t=Math.min(1,y/260);
    rail.style.opacity=t;
    if(!document.documentElement.classList.contains('js')||core.getAnimations&&core.getAnimations().every(function(a){return a.playState==='finished'})) core.style.opacity=1-t;
    tone();
  }
  addEventListener('scroll',tick,{passive:true});
  addEventListener('resize',function(){marks();tick()});
  addEventListener('load',function(){marks();tick()});
  marks();tick();

  // Produkte kreisen auf der Umlaufbahn, Beschriftung bleibt aufrecht
  var svg=document.querySelector('.ring'), nodes=[].slice.call(svg.querySelectorAll('.node'));
  var still=matchMedia('(prefers-reduced-motion: reduce)').matches, off=0, last=0, paused=false, visible=true;
  function place(){
    nodes.forEach(function(n){
      var a=(parseFloat(n.dataset.a)+off)*Math.PI/180, x=300+255*Math.cos(a), y=300+255*Math.sin(a);
      n.setAttribute('transform','translate('+x.toFixed(1)+','+y.toFixed(1)+')');
      var left=Math.cos(a)<-0.15;
      n.querySelectorAll('text').forEach(function(tx){tx.setAttribute('text-anchor',left?'end':'start');tx.setAttribute('x',left?-20:20)});
    });
  }
  function frame(ts){
    if(last&&!paused&&visible) off=(off+(ts-last)*0.0035)%360; // eine Runde in rund 100 s
    last=ts; place(); requestAnimationFrame(frame);
  }
  place();
  if(!still){
    requestAnimationFrame(frame);
    nodes.forEach(function(n){['mouseenter','focusin'].forEach(function(e){n.addEventListener(e,function(){paused=true})});['mouseleave','focusout'].forEach(function(e){n.addEventListener(e,function(){paused=false})})});
    if('IntersectionObserver' in window) new IntersectionObserver(function(es){visible=es[0].isIntersecting}).observe(svg);
    // Leichte Neigung zur Maus
    var hero=document.querySelector('.hero');
    hero.addEventListener('pointermove',function(e){
      if(e.pointerType!=='mouse')return;
      var r=svg.getBoundingClientRect(), dx=(e.clientX-(r.left+r.width/2))/r.width, dy=(e.clientY-(r.top+r.height/2))/r.height;
      svg.style.transform='perspective(1100px) rotateY('+(dx*10).toFixed(2)+'deg) rotateX('+(-dy*10).toFixed(2)+'deg)';
    });
    hero.addEventListener('pointerleave',function(){svg.style.transform=''});
  }

  // Hintergrund-Ringe folgen dem Scrollen: Logo zeichnet sich, Skala dreht, Bit wandert auf der Bahn
  var bgs=[].slice.call(document.querySelectorAll('.bgring'));
  function bgTick(){
    var vh=innerHeight;
    bgs.forEach(function(s){
      var sec=s.parentNode.getBoundingClientRect();
      var p=still?0.6:Math.min(1,Math.max(0,(vh-sec.top)/(sec.height+vh)));
      var d=parseFloat(s.dataset.dir), a=(parseFloat(s.dataset.a)+d*p*220)*Math.PI/180;
      s.style.setProperty('--draw',Math.max(0,1-p*1.8).toFixed(3));
      s.style.setProperty('--rot',(d*p*-60).toFixed(2)+'deg');
      s.querySelector('.bb').setAttribute('transform','translate('+(300+255*Math.cos(a)).toFixed(1)+','+(300+255*Math.sin(a)).toFixed(1)+')');
    });
  }
  addEventListener('scroll',bgTick,{passive:true}); addEventListener('resize',bgTick); bgTick();

})();
