const missions=[
 {name:"Pazari i Vjetër",icon:"🏘️",text:"Gjej një detaj të veçantë në Pazarin e Vjetër. Kërko një shenjë të vogël në zonën e dyqaneve dhe përdor kodin e misionit.",treasure:"🪙",reward:100,code:"PAZAR-24",time:60},
 {name:"Katedralja",icon:"⛪",text:"Vëzhgo fasadën dhe kërko simbolin e fshehur në përshkrimin e sfidës. Zbulo kodin për të marrë çelësin.",treasure:"🕊️",reward:120,code:"KORA-365",time:55},
 {name:"Gjon Mili",icon:"📸",text:"Gjej fotografinë që përputhet me detajin e shfaqur në lojë dhe identifiko kodin e ekspozitës.",treasure:"📷",reward:140,code:"MILI-13",time:50},
 {name:"Kulla Panoramike",icon:"🗼",text:"Shko në pikën panoramike dhe kërko objektin që loja të kërkon. Misioni shpërblen vëzhgimin.",treasure:"🔭",reward:160,code:"KULL-07",time:45},
 {name:"Parku Rinia",icon:"🌳",text:"Gjej një element karakteristik të parkut dhe përdor kodin e sfidës për të zhbllokuar thesarin.",treasure:"🍃",reward:180,code:"RINI-21",time:40}
];
const badges=[
 {name:"Hapat e parë",icon:"👣",need:1,text:"Përfundo 1 mision."},
 {name:"Eksplorues",icon:"🧭",need:2,text:"Përfundo 2 misione."},
 {name:"Gjuetar çelësash",icon:"🔑",need:3,text:"Përfundo 3 misione."},
 {name:"Historian",icon:"📜",need:4,text:"Përfundo 4 misione."},
 {name:"Mjeshtër i Korçës",icon:"🏆",need:5,text:"Përfundo të gjitha misionet."},
 {name:"500 XP",icon:"⭐",xp:500,text:"Arrit 500 XP."}
];
let xp=Number(localStorage.getItem("khkXP")||0);
let done=JSON.parse(localStorage.getItem("khkDone")||"[]");
let streak=Number(localStorage.getItem("khkStreak")||0);
let sound=localStorage.getItem("khkSound")!=="off";
let current=0, timer=null, deferredPrompt=null, filter="all", codeVerified=false;

const $=s=>document.querySelector(s);
function save(){localStorage.setItem("khkXP",xp);localStorage.setItem("khkDone",JSON.stringify(done));localStorage.setItem("khkStreak",streak);update()}
function level(){if(xp>=700)return"Mjeshtër";if(xp>=450)return"Legjendë";if(xp>=300)return"Zbulues";if(xp>=150)return"Eksplorues";return"Vizitor"}
function levelBase(){const lv=level();return {Vizitor:0,Eksplorues:150,Zbulues:300,Legjendë:450,Mjeshtër:700}[lv]}
function nextLevel(){const lv=level();return {Vizitor:150,Eksplorues:300,Zbulues:450,Legjendë:700,Mjeshtër:1000}[lv]}
function update(){
 $("#xp").textContent=xp;$("#xp2").textContent=xp;$("#doneCount").textContent=done.length;
 $("#collectionCount").textContent=done.length;$("#level").textContent=level();$("#streak").textContent=streak;
 $("#levelText").textContent="Je në nivelin "+level()+".";
 const base=levelBase(), next=nextLevel(), pct=Math.max(0,Math.min(100,(xp-base)/(next-base)*100));
 $("#bar").style.width=pct+"%";$("#progressText").textContent=xp+" / "+next+" XP";
 $("#badgeCount").textContent=badges.filter(b=>b.xp?xp>=b.xp:done.length>=b.need).length+"/"+badges.length;
 renderMissions();renderTreasures();renderBadges();renderLeaderboard();
 const remaining=badges.find(b=>b.xp?xp<b.xp:done.length<b.need);
 $("#nextBadge").textContent=remaining?remaining.name:"Të gjitha badge-t";
 $("#nextBadgeText").textContent=remaining?remaining.text:"Ke zhbllokuar çdo badge.";
}
function renderMissions(){
 let list=missions.map((m,i)=>({...m,i})).filter(m=>filter==="all"||filter==="done"&&done.includes(m.i)||filter==="open"&&!done.includes(m.i));
 $("#missionList").innerHTML=list.map(m=>`<article class="mission ${done.includes(m.i)?"done":""}">
 <div class="mission-icon">${m.icon}</div><div><h3>${m.name}</h3><p>${done.includes(m.i)?"✓ Përfunduar":"Mision • "+m.reward+" XP • "+m.time+" sek"}</p></div>
 <button onclick="openMission(${m.i})">${done.includes(m.i)?"HAP":"LUaj"}</button></article>`).join("")||"<p>Nuk ka misione në këtë filtër.</p>";
}
function renderTreasures(){
 $("#treasures").innerHTML=missions.map((m,i)=>`<article class="treasure ${done.includes(i)?"":"locked"}"><div class="ticon">${done.includes(i)?m.treasure:"🔒"}</div><b>${m.name}</b><p>${done.includes(i)?"✓ U zbulua":"Ende i fshehur"}</p></article>`).join("");
}
function renderBadges(){
 $("#badges").innerHTML=badges.map(b=>{const ok=b.xp?xp>=b.xp:done.length>=b.need;return `<div class="badge ${ok?"":"locked"}"><div class="badge-icon">${ok?b.icon:"🔒"}</div><b>${b.name}</b><small>${b.text}</small></div>`}).join("");
}
function renderLeaderboard(){
 const base=[["Ardi","🏔️",920],["Elira","🌿",780],["Klea","📷",650],["Dori","🧭",520],["Ti","🔑",xp]].sort((a,b)=>b[2]-a[2]);
 const rank=base.findIndex(x=>x[0]==="Ti")+1;$("#rankName").textContent="Ti • #"+rank;$("#rankScore").textContent=xp+" XP";
 $("#leaderRows").innerHTML=base.map((x,i)=>`<div class="leader-row"><div class="leader-pos">#${i+1}</div><div class="leader-avatar">${x[1]}</div><div class="leader-name"><b>${x[0]}</b><small>${i===0?"Top eksplorues":i===rank-1?"Rezultati yt":"Eksplorues"}</small></div><div class="leader-score">${x[2]} XP</div></div>`).join("");
}
function showScreen(id){
 document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));$("#"+id).classList.add("active");
 const ids=["home","missions","map","collection","tools","profile"];document.querySelectorAll(".nav").forEach(n=>n.classList.remove("active"));
 const pos=ids.indexOf(id);if(pos>=0)document.querySelectorAll(".nav")[pos].classList.add("active");window.scrollTo({top:0,behavior:"smooth"});
}
function filterMissions(f,btn){filter=f;document.querySelectorAll(".filter").forEach(x=>x.classList.remove("active"));btn.classList.add("active");renderMissions()}
function openMission(i){
 current=i;codeVerified=done.includes(i);const m=missions[i];
 $("#modalIcon").textContent=m.icon;$("#modalTitle").textContent=m.name;$("#modalText").textContent=m.text;
 $("#modalReward").textContent=m.reward;$("#modalTime").textContent=m.time;
 $("#codeInput").value="";$("#codeMessage").textContent=done.includes(i)?"Ky mision është tashmë i përfunduar.":`Këshillë: kërko kodin te pika e misionit.`;
 $("#completeBtn").textContent=done.includes(i)?"MISION I PËRFUNDUAR ✓":"PËRFUNDO MISIONIN";
 $("#completeBtn").disabled=done.includes(i);$("#challengeArea").style.display=done.includes(i)?"none":"block";
 $("#timerWrap").hidden=true;$("#modal").classList.add("show");
 if(!done.includes(i))startTimer(m.time);
}
function startTimer(seconds){
 clearInterval(timer);let left=seconds;$("#timerWrap").hidden=false;$("#timerBar").style.width="100%";
 timer=setInterval(()=>{left--;$("#timerBar").style.width=(left/seconds*100)+"%";$("#modalTime").textContent=left;
 if(left<=0){clearInterval(timer);$("#codeMessage").textContent="⏱️ Koha mbaroi. Mund ta provosh përsëri.";$("#timerWrap").hidden=true}},1000);
}
function checkCode(){
 const val=$("#codeInput").value.trim().toUpperCase(), m=missions[current];
 if(val===m.code){codeVerified=true;$("#codeMessage").textContent="✅ Kodi është i saktë! Tani përfundo misionin.";$("#codeMessage").style.color="#2d7a5a";beep(660,80)}
 else {codeVerified=false;$("#codeMessage").textContent="❌ Kodi nuk përputhet. Kontrollo përsëri.";$("#codeMessage").style.color="#b64d45";beep(160,100)}
}
function completeMission(){
 if(done.includes(current))return;
 if(!codeVerified){$("#codeMessage").textContent="🔐 Përpara se ta përfundosh, kontrollo kodin. Mund të përdorësh edhe QR ose GPS.";return}
 clearInterval(timer);done.push(current);xp+=missions[current].reward;streak=Math.min(7,streak+1);save();
 closeModal();toast("🎉 Misioni u përfundua! +"+missions[current].reward+" XP");beep(880,140);
 if(done.length===missions.length) setTimeout(openFinal,500);
}
function closeModal(){clearInterval(timer);$("#modal").classList.remove("show")}
function openFinal(){
 if(done.length===missions.length){toast("🏆 Sekreti final u zhbllokua! Korça është e jotja.");}else toast("🔒 Ke edhe "+(missions.length-done.length)+" çelësa për të mbledhur.");
}
function startDaily(){const i=missions.findIndex((m,i)=>!done.includes(i));openMission(i<0?0:i)}
function toast(t){const x=$("#toast");x.textContent=t;x.classList.add("show");setTimeout(()=>x.classList.remove("show"),2500)}
function toggleSound(){sound=!sound;localStorage.setItem("khkSound",sound?"on":"off");$("#soundBtn").textContent=sound?"🔊":"🔇";toast(sound?"Tingulli aktiv":"Tingulli fikur")}
function beep(freq,dur){if(!sound)return;try{const c=new (window.AudioContext||window.webkitAudioContext)(),o=c.createOscillator(),g=c.createGain();o.frequency.value=freq;o.connect(g);g.connect(c.destination);g.gain.value=.04;o.start();setTimeout(()=>{o.stop();c.close()},dur)}catch(e){}}
function resetDemoLeaderboard(){toast("Renditja shembull u rifreskua. Rezultati yt mbetet i pandryshuar.")}
async function installApp(){if(deferredPrompt){deferredPrompt.prompt();await deferredPrompt.userChoice;deferredPrompt=null;$("#installBtn").hidden=true}}
window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferredPrompt=e;$("#installBtn").hidden=false});
if("serviceWorker" in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("sw.js").catch(()=>{}));
$("#soundBtn").textContent=sound?"🔊":"🔇";update();

function haversine(a,b){
 const R=6371000, p=Math.PI/180, dLat=(b.lat-a.lat)*p, dLon=(b.lng-a.lng)*p;
 const x=Math.sin(dLat/2)**2+Math.cos(a.lat*p)*Math.cos(b.lat*p)*Math.sin(dLon/2)**2;
 return 2*R*Math.asin(Math.sqrt(x));
}
function checkGPS(){
 const status=$("#gpsStatus");
 if(!navigator.geolocation){status.textContent="❌ Pajisja/shfletuesi nuk mbështet GPS.";return}
 status.textContent="📍 Po marr vendndodhjen…";
 navigator.geolocation.getCurrentPosition(pos=>{
   const target=locations[current]||locations[0];
   const d=Math.round(haversine({lat:pos.coords.latitude,lng:pos.coords.longitude},target));
   if(d<=target.radius){
     codeVerified=true;status.textContent="✅ Je brenda zonës së misionit ("+d+" m).";
     $("#codeMessage").textContent="📍 Vendndodhja u verifikua. Tani mund ta përfundosh misionin.";
     $("#codeMessage").style.color="#2d7a5a";beep(780,100);showScreen("missions");
     openMission(current);
   }else{
     status.textContent="📍 Je rreth "+d+" m larg pikës së misionit. Shko më afër.";
     toast("📍 Je ende larg pikës së misionit.");
   }
 },err=>{status.textContent="❌ GPS nuk u lejua. Kontrollo lejet e shfletuesit.";});
}
async function openQR(){
 const box=$("#qrBox"),video=$("#qrVideo"),out=$("#qrStatus");
 box.hidden=false;out.textContent="Po hap kamerën…";
 if(!navigator.mediaDevices?.getUserMedia){out.textContent="❌ Kamera nuk mbështetet nga ky shfletues.";return}
 try{
  qrStream=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:"environment"}}});
  video.srcObject=qrStream;await video.play();
  if(!("BarcodeDetector" in window)){out.textContent="ℹ️ Ky shfletues nuk ka BarcodeDetector. Përdor Chrome/Edge të përditësuar ose fut kodin manual te misioni.";return}
  const detector=new BarcodeDetector({formats:["qr_code"]});
  const scan=async()=>{
   if(box.hidden)return;
   try{
    const codes=await detector.detect(video);
    if(codes.length){
      const value=(codes[0].rawValue||"").trim().toUpperCase();
      const match=missions.findIndex(m=>m.code===value);
      if(match>=0){
       current=match;codeVerified=true;out.textContent="✅ QR i saktë: "+missions[match].name;
       closeQR();showScreen("missions");openMission(match);
       $("#codeMessage").textContent="📷 QR u verifikua. Mund ta përfundosh misionin.";
       $("#codeMessage").style.color="#2d7a5a";beep(900,120);return;
      }
      out.textContent="QR u lexua, por nuk i përket këtij aplikacioni.";
    }
   }catch(e){}
   qrLoop=requestAnimationFrame(scan);
  };scan();
 }catch(e){out.textContent="❌ Kamera nuk u lejua. Aktivizo lejen e kamerës dhe provo përsëri."}
}
function closeQR(){
 $("#qrBox").hidden=true;if(qrLoop)cancelAnimationFrame(qrLoop);qrLoop=null;
 if(qrStream){qrStream.getTracks().forEach(t=>t.stop());qrStream=null}
}
