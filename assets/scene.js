/* Sunsheng pavilion: original procedural geometry, no external data requests. Three.js MIT. */
(()=>{'use strict';
const $=id=>document.getElementById(id),P=new URLSearchParams(location.search),film=P.get('film'),capture=P.has('capture');
if(film)document.body.classList.add('film');
if(!window.THREE){$('fallback').style.display='block';return;}
const W=window.innerWidth,H=window.innerHeight;
let renderer;try{renderer=new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});}catch(e){$('fallback').style.display='block';return;}
renderer.setSize(W,H);renderer.setPixelRatio(capture?1:Math.min(devicePixelRatio,1.5));renderer.setClearColor(0x071c21);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.25;$('stage').append(renderer.domElement);
const scene=new THREE.Scene();scene.fog=new THREE.FogExp2(0x071c21,.017);const camera=new THREE.PerspectiveCamera(36,W/H,.1,150);
scene.add(new THREE.HemisphereLight(0xd4ece6,0x344b44,2.3));
const sun=new THREE.DirectionalLight(0xffe2aa,3.2);sun.position.set(-5,14,7);sun.castShadow=true;sun.shadow.mapSize.set(1536,1536);Object.assign(sun.shadow.camera,{left:-16,right:16,top:16,bottom:-16,near:1,far:50});sun.shadow.bias=-.0003;sun.shadow.normalBias=.035;scene.add(sun);
const fill=new THREE.DirectionalLight(0x77b8bd,1.7);fill.position.set(10,8,-6);scene.add(fill);
const glow=new THREE.PointLight(0xffb15b,18,14,2);glow.position.set(0,3.4,0);scene.add(glow);
const state={span:6,depth:4.8,eave:1.1,explode:0,roof:true,rain:true,mode:'building',angle:.8,elevation:.44,distance:23,auto:false,night:false};
let seed=1919;const rand=()=>{seed=(1664525*seed+1013904223)>>>0;return seed/4294967296;};
const texCanvas=document.createElement('canvas');texCanvas.width=512;texCanvas.height=512;const tc=texCanvas.getContext('2d');tc.fillStyle='#b67b3e';tc.fillRect(0,0,512,512);for(let i=0;i<540;i++){const x=rand()*512;tc.strokeStyle=`rgba(${rand()>.4?'55,26,9':'240,195,128'},${rand()*.17})`;tc.lineWidth=.3+rand()*1.7;tc.beginPath();tc.moveTo(x,0);for(let y=0;y<=512;y+=8)tc.lineTo(x+Math.sin(y*.025+x)*3,y);tc.stroke();}
const woodTex=new THREE.CanvasTexture(texCanvas);woodTex.colorSpace=THREE.SRGBColorSpace;woodTex.wrapS=woodTex.wrapT=THREE.RepeatWrapping;
const wood=new THREE.MeshStandardMaterial({color:0xe6b975,map:woodTex,roughness:.7});const darkWood=wood.clone();darkWood.color.set(0xae763d);
const stone=new THREE.MeshStandardMaterial({color:0xa7ac9d,roughness:.95});const darkStone=new THREE.MeshStandardMaterial({color:0x405652,roughness:.8});const soil=new THREE.MeshStandardMaterial({color:0x193a30,roughness:1});const gold=new THREE.MeshStandardMaterial({color:0xc99f5b,metalness:.6,roughness:.35});const water=new THREE.MeshStandardMaterial({color:0x528e8e,metalness:.6,roughness:.22,transparent:true,opacity:.8});
const tileC=document.createElement('canvas');tileC.width=512;tileC.height=512;let tt=tileC.getContext('2d');tt.fillStyle='#263d3e';tt.fillRect(0,0,512,512);for(let i=0;i<32;i++){let x=i*16;let g=tt.createLinearGradient(x,0,x+16,0);g.addColorStop(0,'#17292c');g.addColorStop(.5,'#526161');g.addColorStop(1,'#1c3033');tt.fillStyle=g;tt.fillRect(x,0,16,512);}tt.strokeStyle='#10282d';tt.lineWidth=2;for(let y=0;y<512;y+=64){tt.beginPath();tt.moveTo(0,y);tt.lineTo(512,y);tt.stroke();}
const tiles=new THREE.CanvasTexture(tileC);tiles.colorSpace=THREE.SRGBColorSpace;tiles.wrapS=tiles.wrapT=THREE.RepeatWrapping;tiles.repeat.set(2,2);const roofMat=new THREE.MeshStandardMaterial({color:0x8d9c99,map:tiles,roughness:.62,metalness:.12});
const building=new THREE.Group();scene.add(building);const grounds=new THREE.Group();scene.add(grounds);const joints=new THREE.Group();scene.add(joints);joints.visible=false;let layers=[],exportables=[],builtSpan,builtEave;
function box(parent,w,h,d,x,y,z,mat){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
function beam(parent,a,b,width,depth,mat){let va=new THREE.Vector3(...a),vb=new THREE.Vector3(...b),m=new THREE.Mesh(new THREE.BoxGeometry(width,va.distanceTo(vb),depth),mat);m.position.copy(va).add(vb).multiplyScalar(.5);m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),vb.sub(va).normalize());m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
function clearGroup(g){for(const c of [...g.children]){g.remove(c);c.traverse(o=>{if(o.isMesh)o.geometry.dispose();});}}
function makeBuilding(){clearGroup(building);layers=[];exportables=[];const a=state.span/2,b=2.4,e=state.eave,roofX=a+e,roofZ=b+e,eaveY=3.70,ridge=5,slope=(ridge-eaveY)/roofZ;
 for(let i=0;i<6;i++){let g=new THREE.Group();g.userData.base=i;building.add(g);layers.push(g);}let [base,cols,frame,purlins,rafters,roof]=layers;
 box(base,state.span+1.5,.22,6.3,0,.11,0,stone);box(base,state.span+1.7,.08,6.5,0,.04,0,darkStone);
 for(const x of [-a,0,a])for(const z of [-b,b]){box(base,.52,.28,.52,x,.34,z,darkStone);box(cols,.22,3.16,.22,x,1.94,z,wood);box(frame,.62,.18,.26,x,3.52,z,darkWood);box(frame,.34,.18,.65,x,3.68,z,wood);}
 // Three transverse tie beams and elevated ridge posts (interpretive frame).
 for(const x of [-a,0,a]){box(frame,.23,.3,5.13,x,3.65,0,wood);box(frame,.2,1.05,.2,x,4.27,0,wood);for(const z of [-1.2,1.2])box(frame,.18,.50,.18,x,3.99,z,wood);for(const sign of [-1,1])beam(frame,[x,3.8,sign*1.7],[x,4.75,0],.13,.14,darkWood);}
 for(const z of [-b,-1.2,0,1.2,b]){let y=ridge-Math.abs(z)*slope-.2;box(purlins,state.span+.4,.18,.19,0,y,z,wood);}
 let count=Math.ceil((state.span+2*e)/.42);for(let n=0;n<=count;n++){let x=-roofX+n*2*roofX/count;for(const s of [-1,1])beam(rafters,[x,ridge-.07,0],[x,eaveY-.07,s*roofZ],.10,.14,wood);}
 const slant=Math.sqrt(roofZ*roofZ+(ridge-eaveY)*(ridge-eaveY)),pitch=Math.atan2(ridge-eaveY,roofZ);
 for(const s of [-1,1]){let m=box(roof,2*roofX+.18,.1,slant,0,(ridge+eaveY)/2+.02,s*roofZ/2,roofMat);m.rotation.x=s*pitch;box(roof,roofX*2+.35,.15,.16,0,eaveY,s*roofZ,darkWood);}
 box(roof,roofX*2+.3,.16,.17,0,ridge+.13,0,roofMat);
 for(const x of [-roofX,roofX])for(const s of [-1,1])beam(roof,[x,ridge+.09,0],[x,eaveY+.09,s*roofZ],.14,.13,roofMat);
 // Resting bench at rear, central floor remains open.
 box(base,state.span-1,.10,.55,0,.68,-1.92,wood);for(const x of [-a+.75,a-.75])box(base,.16,.45,.42,x,.44,-1.92,darkWood);
 // Low approach ramp: concept geometry, surface slope 1:12 (0.22m rise over 2.64m).
 const rw=1.5,rl=2.64,rz=3.15;const v=new Float32Array([-rw/2,0,rz+rl,rw/2,0,rz+rl,rw/2,.22,rz,-rw/2,.22,rz,-rw/2,0,rz,rw/2,0,rz]);const rg=new THREE.BufferGeometry();rg.setAttribute('position',new THREE.BufferAttribute(v,3));rg.setIndex([0,1,2,0,2,3,0,3,4,1,5,2,3,2,5,3,5,4]);rg.computeVertexNormals();let ramp=new THREE.Mesh(rg,stone);ramp.receiveShadow=true;base.add(ramp);
 for(const z of [-(b+e),b+e]){box(base,state.span+2*e,.04,.22,0,.05,z,water);for(const dz of [-.16,.16])box(base,state.span+2*e,.1,.08,0,.05,z+dz,darkStone);}
 // Rain garden connected around east edge; conceptual drainage, not hydraulic simulation.
 box(base,.18,.04,4.65-(b+e),a+.73,.05,-(4.65+b+e)/2,water);box(base,state.span+2.2,.1,1.6,0,.02,-4.65,soil);
 seed=95;const grassMat=new THREE.MeshStandardMaterial({color:0x6e8e5b,roughness:1,side:THREE.DoubleSide});for(let i=0;i<80;i++){let x=(rand()-.5)*(state.span+2),z=-4.65+(rand()-.5)*1.3;for(let n=0;n<3;n++){let blade=box(base,.035,.28+rand()*.25,.025,x,.22,z,grassMat);blade.rotation.z=(rand()-.5)*.6;blade.rotation.y=rand()*Math.PI;}}
 roof.visible=state.roof;building.traverse(o=>{if(o.isMesh)exportables.push(o);});builtSpan=state.span;builtEave=state.eave;updateLayers();updateUI();
}
// Context plinth, circular contour lines and a restrained landscape.
box(grounds,160,.08,160,0,-.16,0,new THREE.MeshStandardMaterial({color:0x0a282b,roughness:1}));
for(let r=8;r<28;r+=3){const pts=[];for(let n=0;n<=160;n++){let t=n/160*Math.PI*2;pts.push(new THREE.Vector3(Math.cos(t)*r,-.109,Math.sin(t)*r*.74));}grounds.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),new THREE.LineBasicMaterial({color:0x59776e,transparent:true,opacity:.13})));}
seed=912;for(let i=0;i<18;i++){let angle=rand()*Math.PI*2,rr=10+rand()*13;let x=Math.cos(angle)*rr,z=Math.sin(angle)*rr;let h=1.5+rand()*3;const m=new THREE.Mesh(new THREE.ConeGeometry(.7+rand()*.7,h,6),new THREE.MeshStandardMaterial({color:new THREE.Color().setHSL(.39,.22,.12+rand()*.1),roughness:1}));m.position.set(x,h/2-.1,z);grounds.add(m);}
// Simplified mortise and tenon demo: receiving post built around an actual rectangular opening.
const jMale=new THREE.Group(),jFemale=new THREE.Group();joints.add(jMale,jFemale);
box(jMale,2.8,.9,1.05,-1.0,2.5,0,wood);box(jMale,.9,.42,.48,.85,2.5,0,darkWood);
box(jFemale,1,1.35,1.2,.9,1.565,0,wood);box(jFemale,1,1.35,1.2,.9,3.435,0,wood);box(jFemale,1,.52,.30,.9,2.5,-.45,wood);box(jFemale,1,.52,.30,.9,2.5,.45,wood);
box(joints,6,.12,3,0,.15,0,darkStone);
const rainGeo=new THREE.BufferGeometry(),rainCount=420,rainData=new Float32Array(rainCount*6),rainSeeds=[];seed=411;for(let i=0;i<rainCount;i++)rainSeeds.push([rand(),rand(),rand()]);rainGeo.setAttribute('position',new THREE.BufferAttribute(rainData,3));const rainLines=new THREE.LineSegments(rainGeo,new THREE.LineBasicMaterial({color:0x9cbeb3,transparent:true,opacity:.22}));scene.add(rainLines);
function updateRain(t){const a=state.span/2+state.eave,b=state.depth/2+state.eave;for(let i=0;i<rainCount;i++){const [u,v,w]=rainSeeds[i];const x=(u-.5)*(a*2+4),y=6.8-((v+t*(.35+w*.2))%1)*6.7,z=(w-.5)*(b*2+4);rainData.set([x,y,z,x-.025,y-.17,z+.025],i*6);}rainGeo.attributes.position.needsUpdate=true;rainLines.visible=state.rain&&state.mode!=='joint';}
function updateLayers(){const offsets=[0,.28,1.2,2.1,3.0,4.0];layers.forEach((g,i)=>g.position.y=state.explode*offsets[i]);jMale.position.x=-state.explode*2.4;}
function updateUI(){if(!$('spanText'))return;$('spanText').textContent=state.span.toFixed(1)+' m';$('eaveText').textContent=state.eave.toFixed(2)+' m';$('areaText').textContent=(state.span*4.8).toFixed(1);$('explodeText').textContent=Math.round(state.explode*100)+'%';$('explodeLabel').textContent=state.mode==='joint'?'节点拆合':'构造拆解';['span','eave'].forEach(k=>$(k).value=state[k]);$('explode').value=state.explode*100;}
function setMode(mode){state.mode=mode;building.visible=mode!=='joint';joints.visible=mode==='joint';document.body.classList.toggle('joinmode',mode==='joint');['viewBuilding','viewJoint','viewPlan'].forEach((id,i)=>$(id).classList.toggle('on',['building','joint','plan'][i]===mode));updateUI();}
function render(t=0){updateLayers();updateRain(t);const isJoint=state.mode==='joint',isPlan=state.mode==='plan';let target=new THREE.Vector3(0,isJoint?2.15:2.0+state.explode*1.6,0);let dist=isJoint?12:state.distance,el=isPlan?1.47:state.elevation;camera.position.set(Math.sin(state.angle)*Math.cos(el)*dist,target.y+Math.sin(el)*dist,Math.cos(state.angle)*Math.cos(el)*dist);camera.lookAt(target);camera.clearViewOffset();if(film)camera.setViewOffset(W,H,-W*.16,0,W,H);renderer.render(scene,camera);}
makeBuilding();window.sunsheng={state,render,setMode,makeBuilding,scene,building,renderer,camera};
function toast(s){$('toast').textContent=s;$('toast').classList.add('show');setTimeout(()=>$('toast').classList.remove('show'),2200);}
function saveBlob(blob,name){let a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);}
['span','eave'].forEach(k=>$(k).addEventListener('input',e=>{state[k]=+e.target.value;makeBuilding();render();}));$('explode').oninput=e=>{state.explode=+e.target.value/100;updateUI();render();};
$('viewBuilding').onclick=()=>{setMode('building');state.elevation=.44;render();};$('viewJoint').onclick=()=>{setMode('joint');state.explode=1;updateUI();render();};$('viewPlan').onclick=()=>{setMode('plan');render();};
$('roof').onclick=()=>{state.roof=!state.roof;layers[5].visible=state.roof;$('roof').classList.toggle('on',state.roof);};$('rain').onclick=()=>{state.rain=!state.rain;$('rain').classList.toggle('on',state.rain);};$('auto').onclick=()=>{state.auto=!state.auto;$('auto').classList.toggle('on',state.auto);};
$('reset').onclick=()=>{Object.assign(state,{span:6,eave:1.1,explode:0,roof:true,rain:true,angle:.8,elevation:.44,distance:23,auto:false});setMode('building');makeBuilding();['roof','rain'].forEach(k=>$(k).classList.add('on'));$('auto').classList.remove('on');toast('已恢复基准方案');};
$('export').onclick=()=>{render();const c=document.createElement('canvas');c.width=2000;c.height=1400;const ctx=c.getContext('2d');ctx.fillStyle='#071c21';ctx.fillRect(0,0,2000,1400);ctx.drawImage(renderer.domElement,0,0,2000,1120);ctx.fillStyle='#ddbb80';ctx.font='40px Microsoft YaHei';ctx.fillText('榫生 · 听雨亭 / 我的方案',80,1200);ctx.fillStyle='#b9c4b6';ctx.font='23px Microsoft YaHei';ctx.fillText(`柱网 ${state.span.toFixed(1)} × 4.8 m    出檐 ${state.eave.toFixed(2)} m    柱网面积 ${(state.span*4.8).toFixed(1)} m²`,80,1260);ctx.font='18px Microsoft YaHei';ctx.fillText('概念设计 · 参数探索结果 · 未经工程验算',80,1320);c.toBlob(b=>saveBlob(b,'榫生_方案卡.png'));toast('方案卡已导出');};
function exportOBJ(){let lines=['# SUNSHENG concept pavilion, metres, Y up','# Interpretive model. Not for construction.'],index=1;building.updateMatrixWorld(true);for(const [i,m]of exportables.entries()){if(!m.visible)continue;let p=m.geometry.getAttribute('position'),n=m.geometry.index;lines.push('o member_'+i);for(let j=0;j<p.count;j++){let v=new THREE.Vector3().fromBufferAttribute(p,j).applyMatrix4(m.matrixWorld);lines.push(`v ${v.x.toFixed(5)} ${v.y.toFixed(5)} ${v.z.toFixed(5)}`);}if(n){for(let k=0;k<n.count;k+=3)lines.push(`f ${index+n.getX(k)} ${index+n.getX(k+1)} ${index+n.getX(k+2)}`);}else{for(let k=0;k<p.count;k+=3)lines.push(`f ${index+k} ${index+k+1} ${index+k+2}`);}index+=p.count;}return lines.join('\n');}window.exportPavilionOBJ=exportOBJ;$('obj').onclick=()=>{saveBlob(new Blob([exportOBJ()],{type:'text/plain'}),'榫生_概念模型.obj');toast('已导出几何模型（米制 / Y向上）');};
let audioCtx,noiseNode;$('sound').onclick=()=>{if(audioCtx){audioCtx.close();audioCtx=null;$('sound').textContent='开启雨声';return;}audioCtx=new(window.AudioContext||window.webkitAudioContext)();let buf=audioCtx.createBuffer(1,audioCtx.sampleRate*3,audioCtx.sampleRate),arr=buf.getChannelData(0);for(let i=0;i<arr.length;i++)arr[i]=(Math.random()*2-1)*.22;noiseNode=audioCtx.createBufferSource();noiseNode.buffer=buf;noiseNode.loop=true;const filter=audioCtx.createBiquadFilter();filter.type='lowpass';filter.frequency.value=1900;noiseNode.connect(filter).connect(audioCtx.destination);noiseNode.start();$('sound').textContent='关闭雨声';};
let down=false,lastX=0,lastY=0;renderer.domElement.onpointerdown=e=>{down=true;lastX=e.clientX;lastY=e.clientY;renderer.domElement.setPointerCapture(e.pointerId);};renderer.domElement.onpointerup=()=>down=false;renderer.domElement.onpointermove=e=>{if(!down)return;state.angle-=(e.clientX-lastX)*.006;state.elevation=Math.max(.12,Math.min(1.42,state.elevation+(e.clientY-lastY)*.004));lastX=e.clientX;lastY=e.clientY;render();};renderer.domElement.onwheel=e=>{e.preventDefault();state.distance=Math.max(11,Math.min(38,state.distance+e.deltaY*.015));render();};
window.addEventListener('resize',()=>{if(capture)return;renderer.setSize(innerWidth,innerHeight);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();render();});
let prevSection=-1;window.setFilm=(t,kind=film||'theme')=>{const data=FILMS[kind],idx=Math.min(11,Math.floor(t/11)),u=(t-idx*11)/11,part=data[idx];const enter=idx!==prevSection;Object.assign(state,{span:6,eave:1.1,explode:0,roof:true,rain:false,mode:'building',angle:.78+u*.22,elevation:.43,distance:24});sun.intensity=3.2;glow.intensity=18;setMode('building');$('hero').style.opacity=0;$('heroShade').style.opacity=0;
 switch(part.scene){
 case'hero':$('hero').style.opacity=1;$('heroShade').style.opacity=1;break;
 case'joint':case'jointFit':setMode('joint');state.angle=.65+u*.28;state.elevation=.25;state.explode=part.scene==='joint'?1:Math.max(0,1-u*1.35);break;
 case'columns':state.roof=false;state.explode=.12;layers[3].visible=false;layers[4].visible=false;break;
 case'explode':state.explode=Math.sin(u*Math.PI)*.9;state.distance=28;break;
 case'side':state.angle=1.50+u*.12;state.elevation=.20;state.roof=false;break;
 case'rain':state.rain=true;state.angle=.68+u*.13;state.elevation=.28;state.distance=22;sun.intensity=1.9;glow.intensity=35;break;
 case'plan':setMode('plan');state.angle=.05+u*.20;state.roof=false;state.distance=23;break;
 case'param':state.span=5.4+Math.round(u*6)*.3;break;
 case'eave':state.eave=.6+Math.round(u*8)*.1;state.roof=u<.55;break;
 case'night':state.angle=.60+u*.30;sun.intensity=.55;glow.intensity=65;state.rain=true;break;
 case'rotate':state.angle=.3+u*1.35;break;
 }
 if(enter||state.span!==builtSpan||state.eave!==builtEave){makeBuilding();}layers[3].visible=part.scene!=='columns';layers[4].visible=part.scene!=='columns';layers[5].visible=state.roof;
 $('fKicker').textContent=part.tag;$('fTitle').innerText=part.title;$('fDesc').innerText=part.desc;$('fNo').textContent=String(idx+1).padStart(2,'0')+' / 12';$('fCaption').textContent=part.voice;$('filmTrack').textContent=kind==='theme'?'昆仑谣主题 / 建筑叙事':'X开放主题 / 数字共创';$('progress').style.width=(t/132*100)+'%';$('fLimit').textContent=part.scene==='hero'?'AI气氛概念图 · 以参数模型为准':'建筑概念设计 · 非施工图';updateUI();render(t);prevSection=idx;return{section:idx,scene:part.scene};};
window.takeView=(mode='orbit')=>{setMode(mode==='plan'?'plan':'building');state.roof=mode!=='plan'&&mode!=='frame';state.explode=mode==='exploded'?.9:0;state.angle=mode==='front'?0:mode==='side'?Math.PI/2:.78;state.elevation=mode==='front'||mode==='side'?.10:.44;state.distance=mode==='exploded'?28:23;layers[5].visible=state.roof;render(2);};
let start=performance.now();function loop(now){if(!capture){const t=(now-start)/1000;if(film)window.setFilm(t%132,film);else{if(state.auto)state.angle+=.002;render(t);}requestAnimationFrame(loop);}}render();if(!capture)requestAnimationFrame(loop);window.READY=true;
})();
