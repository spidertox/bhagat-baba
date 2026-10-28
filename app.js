const D=window.DATA,$=s=>document.querySelector(s),KEY='havan_v2';
let st={mul:1,done:{},cat:'सभी',q:'',dark:matchMedia('(prefers-color-scheme:dark)').matches};
try{Object.assign(st,JSON.parse(localStorage.getItem(KEY)||'{}'))}catch(e){}
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify({mul:st.mul,done:st.done,dark:st.dark}))}catch(e){}};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const qty=i=>i[1]!=null?(i[1]*st.mul)+(i[2]?' '+i[2]:''):'';
D.samagri.forEach((c,ci)=>c.items.forEach(i=>i.key=ci+'|'+i[0]));
const total=()=>D.samagri.reduce((a,c)=>a+c.items.length,0);

// theme + static fill
function theme(){document.documentElement.dataset.theme=st.dark?'dark':'light';$('#tg').textContent=st.dark?'☀️':'🌙'}
$('#tg').onclick=()=>{st.dark=!st.dark;theme();save()};theme();
$('#nm').textContent=D.name;$('#sb').textContent='('+D.sub+')';$('#pl').textContent='📍 '+D.place;$('#ab').textContent=D.about;
$('#mpa').textContent=D.place;$('#dir').href='https://www.google.com/maps/dir/?api=1&destination='+encodeURIComponent('Hariballabh Bhagat, Nirmali, Pipra, Bihar 852134');
const auto=/github\.io$|^localhost$|^127\./.test(location.hostname)||location.protocol==='file:';
function loadMap(){const f=document.createElement('iframe');f.src=D.mapEmbed;f.title='Map';$('#mpbox').innerHTML='';$('#mpbox').appendChild(f);$('#sm').hidden=true}
if(auto)loadMap();else $('#sm').onclick=loadMap;$('#ml').href=D.mapLink;$('#ml2').href=D.mapLink;$('#pa').textContent=D.place;
if(D.phone){$('#call').href='tel:+'+D.phone;$('#call').hidden=false}

// typing effect
const lines=['ॐ शांति शांति शांति 🙏','पूजा • कथा • हवन','सेवा ही परम धर्म है'];let li=0,ci=0,del=false;
(function ty(){const t=lines[li];$('#ty').textContent=t.slice(0,ci);ci+=del?-1:1;let w=del?40:90;
 if(!del&&ci>t.length){del=true;w=1500}else if(del&&ci<0){del=false;li=(li+1)%lines.length;w=300}setTimeout(ty,w)})();

// stats counter
const stats=[[total(),'सामग्री'],[D.samagri.length,'श्रेणियाँ'],[D.photos.length,'तस्वीरें'],[D.reviews.length,'रिव्यू']];
$('#sts').innerHTML=stats.map(s=>`<div class="st"><b data-n="${s[0]}">0</b>${s[1]}</div>`).join('');
function count(){document.querySelectorAll('[data-n]').forEach(e=>{const n=+e.dataset.n;let v=0;const id=setInterval(()=>{v+=Math.max(1,n/30);if(v>=n){v=n;clearInterval(id)}e.textContent=Math.round(v)},30)})}count();

// gallery + lightbox
$('#gal').innerHTML=D.photos.map((p,i)=>`<img src="${p.src}" alt="${esc(p.alt)}" data-i="${i}" loading="lazy">`).join('');
let cur=0;const lb=$('#lb'),show=i=>{cur=(i+D.photos.length)%D.photos.length;lb.querySelector('img').src=D.photos[cur].src;lb.style.display='flex'};
document.querySelectorAll('#gal img').forEach(im=>im.onclick=()=>show(+im.dataset.i));
lb.querySelector('.x').onclick=()=>lb.style.display='none';lb.querySelector('.pv').onclick=()=>show(cur-1);lb.querySelector('.nx').onclick=()=>show(cur+1);
addEventListener('keydown',e=>{if(lb.style.display!=='flex')return;if(e.key==='Escape')lb.style.display='none';if(e.key==='ArrowLeft')show(cur-1);if(e.key==='ArrowRight')show(cur+1)});

// reviews
(function(){const r=D.reviews,el=$('#revs');
 if(!r.length){$('#avg').innerHTML='<span class="stars">★★★★★</span><br><small>रिव्यू देखने व लिखने के लिए Google Maps खोलें</small>';return}
 const a=r.reduce((s,x)=>s+x.stars,0)/r.length;
 $('#avg').innerHTML=`<span class="stars">${'★'.repeat(Math.round(a))}${'☆'.repeat(5-Math.round(a))}</span> <b>${a.toFixed(1)}</b> (${r.length} रिव्यू)`;
 el.innerHTML=r.map(x=>`<div class="rev"><div class="stars">${'★'.repeat(x.stars)}${'☆'.repeat(5-x.stars)}</div><p>${esc(x.text)}</p><b>— ${esc(x.name)}</b>${x.date?`<br><small>${esc(x.date)}</small>`:''}</div>`).join('')})();

// samagri
const cats=['सभी',...D.samagri.map(c=>c.cat)];
$('#chips').innerHTML=cats.map(c=>`<button class="chip${c===st.cat?' on':''}" data-c="${esc(c)}">${esc(c)}</button>`).join('');
$('#chips').onclick=e=>{const c=e.target.dataset.c;if(!c)return;st.cat=c;document.querySelectorAll('.chip').forEach(x=>x.classList.toggle('on',x.dataset.c===c));draw()};
$('#q').oninput=e=>{st.q=e.target.value.trim();draw()};
$('#mp').onclick=()=>{if(st.mul>1){st.mul--;draw();save()}};$('#pp').onclick=()=>{if(st.mul<10){st.mul++;draw();save()}};
$('#all').onclick=()=>{D.samagri.forEach(c=>c.items.forEach(i=>st.done[i.key]=1));draw();save()};
$('#rst').onclick=()=>{if(confirm('सभी टिक हटाएँ?')){st.done={};draw();save()}};
$('#prn').onclick=()=>{document.querySelectorAll('.cat').forEach(c=>c.classList.add('on'));print()};
$('#wa').onclick=()=>{const rest=D.samagri.map(c=>{const l=c.items.filter(i=>!st.done[i.key]).map(i=>'• '+i[0]+(qty(i)?' - '+qty(i):''));return l.length?'*'+c.cat+'*\n'+l.join('\n'):''}).filter(Boolean).join('\n\n');
 const msg='ॐ शांति हवन सामग्री (बाकी)\n\n'+(rest||'सब सामग्री पूरी ✅');open('https://wa.me/'+(D.phone||'')+'?text='+encodeURIComponent(msg),'_blank')};
function draw(){
 const q=st.q.toLowerCase(),box=$('#lst');box.innerHTML='';
 D.samagri.forEach((c,ci)=>{if(st.cat!=='सभी'&&st.cat!==c.cat)return;
  const its=c.items.filter(i=>!q||i[0].toLowerCase().includes(q));if(!its.length)return;
  const dn=c.items.filter(i=>st.done[i.key]).length;
  box.insertAdjacentHTML('beforeend',`<div class="cat on"><h3>${esc(c.cat)}<small>${dn}/${c.items.length}</small></h3><ul>${its.map((i,k)=>`<li style="transition-delay:${k*40}ms"><label><input type="checkbox" data-k="${esc(i.key)}"${st.done[i.key]?' checked':''}><span>${esc(i[0])}</span><b>${qty(i)}</b></label></li>`).join('')}</ul></div>`)});
 if(!box.children.length)box.innerHTML='<p class="cen">कुछ नहीं मिला 🔍</p>';
 const d=Object.keys(st.done).length,t=total();$('#pgi').style.width=(d/t*100)+'%';$('#pgt').textContent=`${d}/${t} सामग्री तैयार • ×${st.mul}`;$('#mv').textContent='×'+st.mul}
$('#lst').onchange=e=>{const k=e.target.dataset.k;if(!k)return;e.target.checked?st.done[k]=1:delete st.done[k];save();draw();if(Object.keys(st.done).length===total())burst()};
draw();

// celebration
function burst(){for(let i=0;i<60;i++)P.push({x:innerWidth/2,y:innerHeight/2,r:4+Math.random()*5,s:-(2+Math.random()*5),d:Math.random()*6,h:Math.random()*60,vx:(Math.random()-.5)*10,life:90})}

// reveal, nav active, scroll bar, to-top
const io=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting&&e.target.classList.add('on')),{threshold:.1});document.querySelectorAll('.rv').forEach(e=>io.observe(e));
const secs=[...document.querySelectorAll('main section')];
addEventListener('scroll',()=>{const h=document.documentElement,p=h.scrollTop/(h.scrollHeight-h.clientHeight);$('#bar').style.width=p*100+'%';$('.top').classList.toggle('on',h.scrollTop>500);
 const cs=secs.filter(s=>s.getBoundingClientRect().top<150).pop();document.querySelectorAll('nav a').forEach(a=>a.classList.toggle('on',cs&&a.hash==='#'+cs.id))},{passive:true});
$('.top').onclick=()=>scrollTo({top:0});

// petals canvas
const c=$('#fx'),x=c.getContext('2d');const rs=()=>{c.width=innerWidth;c.height=innerHeight};rs();addEventListener('resize',rs);
const P=Array.from({length:32},()=>({x:Math.random()*innerWidth,y:Math.random()*innerHeight,r:3+Math.random()*6,s:.4+Math.random()*1.1,d:Math.random()*6,h:Math.random()<.5?30:45}));
(function f(){x.clearRect(0,0,c.width,c.height);
 for(let i=P.length-1;i>=0;i--){const p=P[i];p.d+=.02;if(p.life){p.x+=p.vx;p.y+=p.s;p.s+=.12;if(--p.life<=0){P.splice(i,1);continue}}else{p.y-=p.s;p.x+=Math.sin(p.d)*.8;if(p.y<-10){p.y=c.height+10;p.x=Math.random()*c.width}}
 x.beginPath();x.fillStyle=`hsla(${p.h},100%,60%,.55)`;x.shadowBlur=12;x.shadowColor='#ffb300';x.ellipse(p.x,p.y,p.r,p.r*1.5,p.d,0,7);x.fill()}
 requestAnimationFrame(f)})();
if('serviceWorker'in navigator&&location.protocol.startsWith('http'))navigator.serviceWorker.register('sw.js').catch(()=>{});
