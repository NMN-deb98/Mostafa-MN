(function(){
  var els=document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{threshold:.12});
    els.forEach(function(e){io.observe(e);});
  }else{els.forEach(function(e){e.classList.add('in');});}
  var cv=document.getElementById('chart');
  if(!cv)return;
  var ctx=cv.getContext('2d'),W,H,dpr=Math.min(window.devicePixelRatio||1,2);
  var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  function size(){var r=cv.getBoundingClientRect();W=r.width;H=r.height;cv.width=W*dpr;cv.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);}
  size();window.addEventListener('resize',size);
  var N=70,step=0,off=0,data=[],v=50,trend=0.4;
  function next(){
    trend+= (Math.random()-.5)*.35; if(trend>1.4)trend=1.4; if(trend<-1.4)trend=-1.4;
    v+= trend*1.6+(Math.random()-.5)*5; if(v<12)v=12+Math.random()*4; if(v>88)v=88-Math.random()*4;
    return v;
  }
  for(var i=0;i<N+3;i++)data.push(next());
  var lo=0,hi=100;
  function draw(){
    step=W/(N-1);
    var mn=Math.min.apply(null,data),mx=Math.max.apply(null,data);
    lo+=(mn-lo)*.05;hi+=(mx-hi)*.05;
    var top=H*.18,bot=H*.88;
    function X(i){return i*step-off;}
    function Y(val){return bot-(val-lo)/((hi-lo)||1)*(bot-top);}
    ctx.clearRect(0,0,W,H);
    ctx.strokeStyle='rgba(199,154,85,.07)';ctx.lineWidth=1;
    for(var g=1;g<6;g++){var gy=H*g/6;ctx.beginPath();ctx.moveTo(0,gy);ctx.lineTo(W,gy);ctx.stroke();}
    for(var g2=1;g2<10;g2++){var gx=W*g2/10;ctx.beginPath();ctx.moveTo(gx,0);ctx.lineTo(gx,H);ctx.stroke();}
    ctx.beginPath();ctx.moveTo(X(0),Y(data[0]));
    for(var k=1;k<data.length;k++){var mx2=(X(k-1)+X(k))/2,my=(Y(data[k-1])+Y(data[k]))/2;ctx.quadraticCurveTo(X(k-1),Y(data[k-1]),mx2,my);}
    var lastI=data.length-1;ctx.lineTo(X(lastI),Y(data[lastI]));
    var path=new Path2D();
    ctx.lineWidth=2.4;ctx.lineJoin='round';
    var grd=ctx.createLinearGradient(0,0,W,0);grd.addColorStop(0,'rgba(199,154,85,.15)');grd.addColorStop(.6,'#c79a55');grd.addColorStop(1,'#f3dca8');
    ctx.strokeStyle=grd;ctx.shadowColor='rgba(230,200,141,.55)';ctx.shadowBlur=12;ctx.stroke();ctx.shadowBlur=0;
    ctx.lineTo(X(lastI),H);ctx.lineTo(X(0),H);ctx.closePath();
    var fg=ctx.createLinearGradient(0,top,0,H);fg.addColorStop(0,'rgba(199,154,85,.22)');fg.addColorStop(1,'rgba(199,154,85,0)');
    ctx.fillStyle=fg;ctx.fill();
    var ex=X(lastI),ey=Y(data[lastI]);
    ctx.beginPath();ctx.arc(ex,ey,4.5,0,7);ctx.fillStyle='#f3dca8';ctx.shadowColor='#e6c88d';ctx.shadowBlur=16;ctx.fill();ctx.shadowBlur=0;
  }
  var last=performance.now();
  function frame(t){
    var dt=Math.min(t-last,60);last=t;
    if(!reduce){off+=dt*0.028*(step||8)/ 4;}
    while(off>=step&&step>0){off-=step;data.shift();data.push(next());}
    draw();requestAnimationFrame(frame);
  }
  draw();
  if(reduce){return;}
  requestAnimationFrame(frame);
})();

/* Mobile navigation */
(function(){
  var button=document.querySelector('.menu-toggle');
  var menu=document.getElementById('primary-navigation');
  if(!button||!menu)return;
  function closeMenu(){
    button.setAttribute('aria-expanded','false');
    button.setAttribute('aria-label','باز کردن منو');
    menu.classList.remove('is-open');
  }
  button.addEventListener('click',function(){
    var open=button.getAttribute('aria-expanded')!=='true';
    button.setAttribute('aria-expanded',String(open));
    button.setAttribute('aria-label',open?'بستن منو':'باز کردن منو');
    menu.classList.toggle('is-open',open);
  });
  menu.querySelectorAll('a').forEach(function(link){link.addEventListener('click',closeMenu);});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')closeMenu();});
  window.addEventListener('resize',function(){if(window.innerWidth>760)closeMenu();});
  document.addEventListener('click',function(e){if(!menu.contains(e.target)&&!button.contains(e.target))closeMenu();});
})();
