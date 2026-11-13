(() => {
 const $=selector=>document.querySelector(selector);
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let motion=!reduced.matches,scheduled=false;
 const visited=[];
 const captions={space:['01 / OUTSIDE THE GALAXY','02 / A SYSTEM OF POSSIBILITIES','03 / A DESTINATION DISCOVERED'],jungle:['01 / ABOVE THE CANOPY','02 / FOLLOW THE WATER','03 / A LIGHT WITHIN']};
 const clamp=n=>Math.max(0,Math.min(1,n));
 const ease=n=>n*n*(3-2*n);
 function frame(){
  scheduled=false;
  const y=window.scrollY||document.scrollingElement.scrollTop||0;
  const world=document.body.dataset.world;
  const field=$('#field').getBoundingClientRect().top+y;
  const meeting=$('#meeting').getBoundingClientRect().top+y;
  // Anchored to content destinations, not the footer or an arbitrary image height.
  const cursor=y+innerHeight*.15;
  const phase=cursor<field?clamp(cursor/Math.max(field,1)):1+clamp((cursor-field)/Math.max(meeting-field,1));
  // Keep the lower layer opaque while the next fades in: no dark dip or cut.
  const weights=phase<1?[1,ease(phase),0]:[0,1,ease(phase-1)];
  const stop=Math.min(2,Math.round(phase));
  document.querySelectorAll('.scene-image').forEach(image=>{
   const [w,n]=image.dataset.scene.split('-');const i=Number(n)-1;
   image.style.opacity=w===world?String(weights[i]):'0';
   const local=clamp((phase-i+1)/2);
   // Keep the entire illustration inside the viewport, including on portrait screens.
   image.style.transform=motion?'scale('+(.965+local*.025).toFixed(3)+') translateY('+((.5-local)*.8).toFixed(2)+'%)':'none';
  });
  $('#scene-caption').textContent=captions[world][stop];
  document.querySelectorAll('[data-stop]').forEach(link=>{if(Number(link.dataset.stop)===stop)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});
  document.documentElement.style.setProperty('--progress',String(clamp(y/Math.max(1,document.documentElement.scrollHeight-innerHeight))));
  $('.travelling-note').classList.toggle('empty',!$('#note').value.trim());
  const rect=$('.note-editor').getBoundingClientRect();
  $('.travelling-note').classList.toggle('near-editor',rect.top<innerHeight*.8&&rect.bottom>0);
  $('#arrival-caption').textContent=world==='space'?'A place for your next possibility.':'Something new can begin here.';
  $('#motion-toggle').setAttribute('aria-pressed',String(motion));
  $('#motion-toggle').textContent=motion?'Camera motion on · pause':'Soft fades · enable camera';
 }
 function schedule(){if(!scheduled){scheduled=true;requestAnimationFrame(frame);}}
 addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);addEventListener('worldchange',schedule);
 document.addEventListener('scroll',schedule,{passive:true,capture:true});
 reduced.addEventListener('change',()=>{motion=!reduced.matches;schedule();});
 $('#motion-toggle').onclick=()=>{motion=!motion;schedule();};
 ['#seed','#note'].forEach(s=>$(s).addEventListener('input',()=>{if(!$('#placed-note').hidden){$('#placed-note').textContent=$('#note').value;}schedule();}));
 document.querySelectorAll('details').forEach(item=>item.addEventListener('toggle',schedule));
 const points={turn:[65,160],connect:[215,65],unpack:[365,200],follow:[530,100]};
 document.querySelectorAll('[data-move]').forEach(button=>button.addEventListener('click',()=>{
  button.dataset.visited='true';if(!visited.includes(button.dataset.move))visited.push(button.dataset.move);
  $('#visited-path').setAttribute('d',visited.map((key,i)=>(i?'L':'M')+points[key].join(' ')).join(' '));schedule();
 }));
 $('#place-note').onclick=()=>{
  if(!$('#note').value.trim()){$('#note').focus();$('#place-status').textContent='A few words are enough to begin.';return;}
  $('#placed-note').textContent=$('#note').value;$('#placed-note').hidden=false;
  $('#place-status').textContent='Placed for this visit. Download your note to keep it.';schedule();
 };
 if('ResizeObserver' in window)new ResizeObserver(schedule).observe($('main'));
 frame();
})();
