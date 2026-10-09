import * as pdfjsLib from 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.4.624/pdf.min.mjs';
pdfjsLib.GlobalWorkerOptions.workerSrc='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.4.624/pdf.worker.min.mjs';
const W=528,H=792,$=id=>document.getElementById(id);
let cancelled=false,processing=false;
const fileInput=$('file'),folderInput=$('folder'),go=$('go'),cancel=$('cancel'),clear=$('clear'),zipButton=$('zip'),status=$('status'),bar=$('bar'),preview=$('preview'),queueList=$('queueList');
const queueItems=[];
const collator=new Intl.Collator('zh-CN',{numeric:true,sensitivity:'base'});

function setStatus(s,p){status.textContent=s;if(p!=null)bar.style.width=`${Math.max(0,Math.min(100,p))}%`;}
function humanSize(n){if(!Number.isFinite(n))return '';const units=['B','KB','MB','GB'];let i=0,v=n;while(v>=1024&&i<units.length-1){v/=1024;i++;}return `${v.toFixed(i?2:0)} ${units[i]}`;}
function fileKey(file){return `${file.name}\0${file.size}\0${file.lastModified}\0${file.webkitRelativePath||''}`;}
function displayName(item){return item.file.webkitRelativePath||item.file.name;}
function pendingItems(){return queueItems.filter(item=>item.state==='等待转换');}
function successItems(){return queueItems.filter(item=>item.state==='完成'&&item.blob);}
function syncButtons(){go.disabled=processing||pendingItems().length===0;cancel.disabled=!processing;clear.disabled=processing||queueItems.length===0;zipButton.disabled=processing||successItems().length===0;fileInput.disabled=processing;folderInput.disabled=processing;}
function renderQueue(){
  $('queueCount').textContent=`（${queueItems.length} 个 PDF）`;
  queueList.replaceChildren();
  if(!queueItems.length){const li=document.createElement('li');li.className='hint';li.textContent='请先选择 PDF 文件或文件夹。';queueList.append(li);syncButtons();return;}
  queueItems.forEach((item,index)=>{
    const li=document.createElement('li');
    const info=document.createElement('div');info.className='file-info';
    const name=document.createElement('div');name.className='filename';name.textContent=`${index+1}. ${displayName(item)}`;
    const detail=document.createElement('div');detail.className='file-detail';detail.textContent=`${humanSize(item.file.size)}${item.outputName?` · 输出：${item.outputName}`:''}${item.error?` · ${item.error}`:''}`;
    info.append(name,detail);
    const state=document.createElement('span');state.className='file-state'+(item.state==='完成'?' ok':item.state==='失败'?' err':'');state.textContent=item.state==='转换中'?`转换中 ${Math.round(item.progress||0)}%`:item.state;
    li.append(info,state);
    if(item.blob){const btn=document.createElement('button');btn.className='secondary small';btn.textContent='下载 XTC';btn.addEventListener('click',()=>downloadBlob(item.blob,item.outputName));li.append(btn);}
    queueList.append(li);
  });
  syncButtons();
}
function addFiles(fileList){
  const known=new Set(queueItems.map(i=>fileKey(i.file)));
  const found=Array.from(fileList||[]).filter(f=>/\.pdf$/i.test(f.name));
  found.sort((a,b)=>collator.compare(a.webkitRelativePath||a.name,b.webkitRelativePath||b.name));
  let added=0;
  for(const file of found){const key=fileKey(file);if(known.has(key))continue;known.add(key);queueItems.push({file,state:'等待转换',progress:0,blob:null,outputName:'',error:''});added++;}
  if(added){preview.style.display='none';preview.removeAttribute('src');preview.dataset.hasPreview='';setStatus(`已加入 ${added} 个 PDF。队列按添加顺序逐个转换。` ,0);}
  else if(found.length===0)setStatus('没有找到 PDF 文件。请选择 PDF 文件，或用文件夹选择器导入。',0);
  else setStatus('这些 PDF 已在队列中，没有重复添加。',0);
  renderQueue();
}
fileInput.addEventListener('change',()=>{addFiles(fileInput.files);fileInput.value='';});
folderInput.addEventListener('change',()=>{addFiles(folderInput.files);folderInput.value='';});
clear.addEventListener('click',()=>{if(processing)return;queueItems.length=0;preview.style.display='none';preview.removeAttribute('src');preview.dataset.hasPreview='';bar.style.width='0%';setStatus('队列已清空。',0);renderQueue();});
cancel.addEventListener('click',()=>{cancelled=true;cancel.disabled=true;setStatus(status.textContent+'\n正在取消；当前 PDF 会在下一个分段边界停止。');});

function dither(gray,w,h,mode,depth,threshold){const a=new Float32Array(gray);for(let y=0;y<h;y++)for(let x=0;x<w;x++){let i=y*w+x,old=a[i],v;if(mode==='none'){v=depth===2?(old<42?0:old<127?85:old<212?170:255):(old<threshold?0:255);}else{if(depth===2)v=old<42?0:old<127?85:old<212?170:255;else v=old<128?0:255;}a[i]=v;if(mode==='none')continue;let e=old-v;if(mode==='atkinson'){e/=8;const add=(xx,yy,k=1)=>{if(xx>=0&&xx<w&&yy<h)a[yy*w+xx]+=e*k};add(x+1,y);add(x+2,y);add(x-1,y+1);add(x,y+1);add(x+1,y+1);add(x,y+2);}else{const add=(xx,yy,k)=>{if(xx>=0&&xx<w&&yy<h)a[yy*w+xx]+=e*k/16};add(x+1,y,7);add(x-1,y+1,3);add(x,y+1,5);add(x+1,y+1,1);}}return Uint8Array.from(a,v=>Math.max(0,Math.min(255,Math.round(v))));}
function packXTG(px,w,h){const rb=Math.ceil(w/8),data=new Uint8Array(rb*h);for(let y=0;y<h;y++)for(let x=0;x<w;x++)if(px[y*w+x]>=128)data[y*rb+(x>>3)]|=0x80>>(x&7);return makePage('XTG\0',w,h,data);}
function packXTH(px,w,h){const cb=Math.ceil(h/8),plane=cb*w,p0=new Uint8Array(plane),p1=new Uint8Array(plane);for(let x=0;x<w;x++){const off=(w-1-x)*cb;for(let y=0;y<h;y++){const p=px[y*w+x],v=p>=212?0:p>=127?1:p>=42?2:3,idx=off+(y>>3),bit=7-(y&7);if(v&1)p0[idx]|=1<<bit;if(v&2)p1[idx]|=1<<bit;}}const data=new Uint8Array(plane*2);data.set(p0);data.set(p1,plane);return makePage('XTH\0',w,h,data);}
function makePage(magic,w,h,data){const out=new Uint8Array(22+data.length),v=new DataView(out.buffer);for(let i=0;i<4;i++)out[i]=magic.charCodeAt(i);v.setUint16(4,w,true);v.setUint16(6,h,true);out[8]=0;out[9]=0;v.setUint32(10,data.length,true);out.set(data,22);const hash=md5(data).slice(0,8);out.set(hash,14);return out;}
// Small MD5 implementation for XTG/XTH 8-byte data fingerprint.
function md5(input){const K=new Uint32Array(64),S=[7,12,17,22,5,9,14,20,4,11,16,23,6,10,15,21];for(let i=0;i<64;i++)K[i]=Math.floor(Math.abs(Math.sin(i+1))*4294967296)>>>0;const len=input.length,bitLen=len*8,total=((len+9+63)>>6)<<6,msg=new Uint8Array(total);msg.set(input);msg[len]=128;new DataView(msg.buffer).setUint32(total-8,bitLen>>>0,true);new DataView(msg.buffer).setUint32(total-4,Math.floor(bitLen/4294967296),true);let a0=0x67452301,b0=0xefcdab89,c0=0x98badcfe,d0=0x10325476;for(let o=0;o<total;o+=64){const M=new Uint32Array(16),dv=new DataView(msg.buffer,o,64);for(let i=0;i<16;i++)M[i]=dv.getUint32(i*4,true);let a=a0,b=b0,c=c0,d=d0;for(let i=0;i<64;i++){let f,g;if(i<16){f=(b&c)|(~b&d);g=i;}else if(i<32){f=(d&b)|(~d&c);g=(5*i+1)%16;}else if(i<48){f=b^c^d;g=(3*i+5)%16;}else{f=c^(b|~d);g=(7*i)%16;}const s=i<16?S[i%4]:i<32?S[4+i%4]:i<48?S[8+i%4]:S[12+i%4];const z=(a+f+K[i]+M[g])|0,r=(z<<s)|(z>>>(32-s));a=d;d=c;c=b;b=(b+r)|0;}a0=(a0+a)|0;b0=(b0+b)|0;c0=(c0+c)|0;d0=(d0+d)|0;}const out=new Uint8Array(16),dv=new DataView(out.buffer);[a0,b0,c0,d0].forEach((v,i)=>dv.setUint32(i*4,v,true));return out;}
function buildBook(pages,is2,title){const metaOff=56,indexOff=312,dataOff=indexOff+pages.length*16,total=dataOff+pages.reduce((n,p)=>n+p.length,0),out=new Uint8Array(total),v=new DataView(out.buffer);const magic=is2?'XTCH':'XTC\0';for(let i=0;i<4;i++)out[i]=magic.charCodeAt(i);v.setUint16(4,1,true);v.setUint16(6,pages.length,true);v.setUint32(8,0x01000100,true);v.setUint32(12,1,true);v.setBigUint64(16,BigInt(metaOff),true);v.setBigUint64(24,BigInt(indexOff),true);v.setBigUint64(32,BigInt(dataOff),true);v.setBigUint64(40,0n,true);v.setBigUint64(48,0n,true);new TextEncoder().encode(title).slice(0,127).forEach((c,i)=>out[metaOff+i]=c);let pos=dataOff;pages.forEach((p,i)=>{let e=indexOff+i*16;v.setBigUint64(e,BigInt(pos),true);v.setUint32(e+8,p.length,true);v.setUint16(e+12,W,true);v.setUint16(e+14,H,true);out.set(p,pos);pos+=p.length;});return out;}
function safeName(name){return name.replace(/[\\/:*?"<>|\u0000-\u001f]/g,'_').replace(/[. ]+$/,'').trim()||'converted';}
function downloadBlob(blob,name){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name||'converted.xtc';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),15000);}

async function convertPdfFile(file,item,queueIndex,totalQueue){
  let pdf=null;const pages=[];
  try{
    const bytes=await file.arrayBuffer();
    pdf=await pdfjsLib.getDocument({data:bytes}).promise;
    const depth=Number($('depth').value),algo=$('dither').value,threshold=Number($('threshold').value),maskMode=$('maskMode').checked;
    const single=totalQueue===1;
    const title=safeName(single&&$('title').value.trim()?$('title').value.trim():file.name.replace(/\.pdf$/i,''));
    let totalSegments=0;
    for(let pn=1;pn<=pdf.numPages;pn++){
      if(cancelled)throw new Error('已取消');
      const page=await pdf.getPage(pn),base=page.getViewport({scale:1}),viewport=page.getViewport({scale:W/base.width});
      totalSegments+=Math.ceil(Math.max(1,Math.ceil(viewport.height))/H);
      page.cleanup?.();
    }
    let done=0;
    for(let pn=1;pn<=pdf.numPages;pn++){
      if(cancelled)throw new Error('已取消');
      const page=await pdf.getPage(pn),base=page.getViewport({scale:1}),viewport=page.getViewport({scale:W/base.width}),scaledH=Math.max(1,Math.ceil(viewport.height));
      for(let top=0;top<scaledH;top+=H){
        if(cancelled)throw new Error('已取消');
        const canvas=document.createElement('canvas');canvas.width=W;canvas.height=H;
        const ctx=canvas.getContext('2d',{willReadFrequently:true});
        ctx.fillStyle='#fff';ctx.fillRect(0,0,W,H);
        const transform=[1,0,0,1,0,-top];
        await page.render({canvasContext:ctx,canvas,viewport,transform,background:'rgb(255,255,255)',intent:maskMode?'print':'display'}).promise;
        const image=ctx.getImageData(0,0,W,H),gray=new Uint8Array(W*H);
        for(let i=0,j=0;i<image.data.length;i+=4,j++)gray[j]=Math.round(.299*image.data[i]+.587*image.data[i+1]+.114*image.data[i+2]);
        const processed=dither(gray,W,H,algo,depth,threshold);
        pages.push(depth===2?packXTH(processed,W,H):packXTG(processed,W,H));
        if(!preview.dataset.hasPreview){preview.src=canvas.toDataURL('image/png');preview.style.display='block';preview.dataset.hasPreview='1';}
        done++;item.progress=100*done/totalSegments;item.detail=`PDF 页 ${pn}/${pdf.numPages} · 分段 ${done}/${totalSegments}`;
        const batchPosition=(queueIndex+item.progress/100)/totalQueue*100;
        setStatus(`正在处理 ${queueIndex+1}/${totalQueue}：${file.name}\n${item.detail}\n模式：${maskMode?'蒙版兼容（print）':'标准（display）'}`,batchPosition);
        renderQueue();
        canvas.width=1;canvas.height=1;
        await new Promise(resolve=>setTimeout(resolve,0));
      }
      page.cleanup?.();
    }
    if(cancelled)throw new Error('已取消');
    setStatus(`正在封装 ${file.name}…`,(queueIndex+0.98)/totalQueue*100);
    const book=buildBook(pages,depth===2,title);
    const ext=depth===2?'.xtch':'.xtc';
    return {blob:new Blob([book],{type:'application/octet-stream'}),outputName:title+ext,pageCount:pdf.numPages,xtcPages:pages.length,size:book.length};
  }finally{
    pages.length=0;
    if(pdf){try{await pdf.destroy();}catch(_){}}
  }
}

go.addEventListener('click',async()=>{
  const todo=pendingItems();if(!todo.length||processing)return;
  processing=true;cancelled=false;syncButtons();
  let finished=0,failed=0;
  preview.style.display='none';preview.removeAttribute('src');preview.dataset.hasPreview='';bar.style.width='0%';
  for(let pos=0;pos<todo.length;pos++){
    if(cancelled)break;
    const item=todo[pos];item.state='转换中';item.progress=0;item.detail='正在读取 PDF';renderQueue();
    try{
      const result=await convertPdfFile(item.file,item,pos,todo.length);
      item.blob=result.blob;item.outputName=result.outputName;item.state='完成';item.progress=100;item.pageCount=result.pageCount;item.xtcPages=result.xtcPages;item.size=result.size;finished++;
      setStatus(`完成 ${pos+1}/${todo.length}：${item.file.name}\nPDF 页数：${result.pageCount}\n生成 X3 页面：${result.xtcPages}\n输出大小：${humanSize(result.size)}`,((pos+1)/todo.length)*100);
    }catch(error){
      if(error?.message==='已取消'||cancelled){item.state='已取消';item.error='已取消';}
      else{item.state='失败';item.error=error?.message||String(error);failed++;console.error(error);setStatus(`转换失败：${item.file.name}\n${item.error}\n将继续处理下一个文件。`,((pos+1)/todo.length)*100);}
    }
    renderQueue();
    if(cancelled)break;
  }
  processing=false;syncButtons();
  const waiting=pendingItems().length;
  if(cancelled){setStatus(`本批次已取消。完成 ${finished} 个，失败 ${failed} 个；未处理的文件仍保留在队列中。`,null);}
  else{setStatus(`本批次结束。成功 ${finished} 个，失败 ${failed} 个，队列中剩余 ${waiting} 个待处理。${successItems().length?' 可单独下载结果，或点击“下载全部成功结果 ZIP”。':''}`,100);}
});

zipButton.addEventListener('click',async()=>{
  const ready=successItems();if(!ready.length||processing)return;
  if(!window.JSZip){setStatus('ZIP 组件未能加载，请检查网络后刷新页面再试。',0);return;}
  zipButton.disabled=true;
  try{
    const zip=new window.JSZip(),used=new Set();
    for(const item of ready){
      let name=item.outputName||'converted.xtc',base=name,seq=2;
      while(used.has(name.toLowerCase())){const dot=base.lastIndexOf('.');name=dot>0?`${base.slice(0,dot)} (${seq})${base.slice(dot)}`:`${base} (${seq})`;seq++;}
      used.add(name.toLowerCase());zip.file(name,item.blob,{binary:true});
    }
    setStatus(`正在打包 ${ready.length} 个结果为 ZIP…`,0);
    const blob=await zip.generateAsync({type:'blob',compression:'STORE'},metadata=>setStatus(`正在打包 ZIP：${Math.round(metadata.percent)}%`,metadata.percent));
    downloadBlob(blob,'X3-XTC-批量转换结果.zip');
    setStatus(`ZIP 打包完成。包含 ${ready.length} 个文件，大小 ${humanSize(blob.size)}。`,100);
  }catch(error){console.error(error);setStatus(`ZIP 打包失败：${error?.message||error}`,0);}
  finally{syncButtons();}
});
renderQueue();
