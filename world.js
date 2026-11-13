const $ = selector => document.querySelector(selector);
let world = (new URLSearchParams(location.search).get('world') || document.body.dataset.world) === 'jungle' ? 'jungle' : 'space';
let move = '';
const moves = {
 turn: ['A DIFFERENT ANGLE', 'What if the opposite were true?', 'Turned it around'],
 connect: ['AN UNEXPECTED CONNECTION', 'What could this borrow from a completely different world?', 'Made a connection'],
 unpack: ['ONE PIECE AT A TIME', 'Which small part could you try first?', 'Found a smaller piece'],
 follow: ['A THREAD WORTH FOLLOWING', 'What keeps pulling you back to this?', 'Followed the thread']
};
function theme(value) {
 world = value; document.body.dataset.world = world;
 window.dispatchEvent(new Event('worldchange'));
 document.querySelectorAll('.world-picker button').forEach(button => button.setAttribute('aria-pressed',String(button.dataset.world === world)));
 $('#world-caption').textContent = world === 'space' ? 'FIELD NOTES / THE UNCHARTED SKY' : 'FIELD NOTES / INTO THE WILD';
 $('#meeting-title').innerHTML = world === 'space' ? "LET'S CONNECT<br>THE DOTS." : "LET'S SEE<br>WHAT GROWS.";
 try { const url = new URL(location.href); url.searchParams.set('world',world); history.replaceState(null,'',url); } catch {}
}
document.querySelectorAll('.world-picker button').forEach(button => button.onclick = () => theme(button.dataset.world));
theme(world);
function sync(source) {
 const text = source.value;
 if (source === $('#seed')) $('#note').value = text;
 else $('#seed').value = text;
 $('#thread-preview').textContent = text.trim() ? text.trim().slice(0,160) : 'A question can take you anywhere.';
 $('#personal-echo').textContent = text.trim() ? 'Your thread: ' + text.trim().slice(0,180) : 'You can bring your own question, or just try the thought.';
}
$('#seed').addEventListener('input',event => sync(event.target));
$('#note').addEventListener('input',event => sync(event.target));
$('#begin').onclick = () => $('#field').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
$('#seed').addEventListener('keydown',event => {if(event.key === 'Enter') $('#begin').click();});
document.querySelectorAll('[data-move]').forEach(button => button.onclick = () => {
 move = button.dataset.move;
 document.querySelectorAll('[data-move]').forEach(item => item.setAttribute('aria-pressed',String(item === button)));
 $('.travelling-note').dataset.move = move;
 $('#thread-action').textContent = moves[move][2];
 $('#discovery-label').textContent = moves[move][0];
 $('#prompt').textContent = moves[move][1];
 $('#note-lens').textContent = moves[move][1];
 $('#discovery').hidden = false;
 sync($('#note'));
});
function content() {return $('#note').value.trim() + (move ? '\n\nA thought to explore:\n' + moves[move][1] : '');}
$('#download').onclick = () => {
 if (!$('#note').value.trim()) {$('#note').focus();$('#status').textContent='Start with a few words.';return;}
 const url=URL.createObjectURL(new Blob([content()],{type:'text/plain;charset=utf-8'}));
 const link=document.createElement('a');link.href=url;link.download='my-field-note.txt';link.click();setTimeout(()=>URL.revokeObjectURL(url),2000);
 $('#status').textContent='Your note is ready for download. Nothing has been sent.';
};
$('#copy').onclick=async()=>{
 if(!$('#note').value.trim()){$('#note').focus();$('#status').textContent='Write a note first.';return;}
 try{await navigator.clipboard.writeText(content());$('#status').textContent='Copied. Bring your note wherever you like.';}
 catch{$('#note').focus();$('#note').select();$('#status').textContent='Your note is selected. Use Copy to keep it.';}
};
$('#about-open').onclick=()=>$('#about').showModal();$('#about-close').onclick=()=>$('#about').close();
$('#about-traces').onclick=()=>$('#about').close();
