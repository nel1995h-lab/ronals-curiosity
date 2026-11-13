// Edit these two values when the contact destination changes.
(() => {
 const contact={whatsapp:'972508638381',email:'hadadironel@gmail.com'};
 const note=document.querySelector('#note');
 const status=document.querySelector('#status');
 const whatsapp=document.querySelector('#share-whatsapp');
 const email=document.querySelector('#share-email');
 function message(){
  const chosen=document.querySelector('[data-move][aria-pressed="true"]');
  const question=document.querySelector('#note-lens').textContent;
  return 'Hi Ronal,\n\n'+note.value.trim()+(chosen?'\n\nA thought to explore:\n'+question:'');
 }
 function refresh(){
  const body=encodeURIComponent(message());
  whatsapp.href='https://wa.me/'+contact.whatsapp+'?text='+body;
  email.href='mailto:'+contact.email+'?subject='+encodeURIComponent("Something to explore — Ronal's Curiosity")+'&body='+body;
  [whatsapp,email].forEach(link=>link.setAttribute('aria-disabled',String(!note.value.trim())));
 }
 document.querySelector('#seed').addEventListener('input',refresh);
 note.addEventListener('input',refresh);
 document.querySelectorAll('[data-move]').forEach(button=>button.addEventListener('click',refresh));
 [whatsapp,email].forEach(link=>link.addEventListener('click',event=>{
  if(!note.value.trim()){event.preventDefault();note.focus();status.textContent='A few words are enough. Add your thought first.';return;}
  refresh();
  status.textContent='Your message is ready in your app. Review it there and choose whether to send.';
 }));
 refresh();
})();
