import * as pdfjsLib from 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.4.624/pdf.min.mjs';
pdfjsLib.GlobalWorkerOptions.workerSrc='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.4.624/pdf.worker.min.mjs';
const W=528,H=792,$=id=>document.getElementById(id);
const languageSelect=$('language');
let currentLanguage='zh';
const exactTranslations={
'X3 PDF 跨页拼接批量转换 XTC/XTCH':'X3 PDF Stitching Batch Converter to XTC/XTCH',
'基于现有轻量转换器改版。支持多选 PDF、整文件夹、每份 PDF 内部跨页连续拼接，以及每 N 个 PDF 合并成一个 XTC/XTCH 文件；文件只在本机浏览器处理，不会上传。':'A modified lightweight converter supporting multiple PDFs, folder import, continuous stitching within each PDF, and merging every N PDFs into one XTC/XTCH file. All processing happens locally in your browser; files are never uploaded.',
'选择一个或多个 PDF':'Select one or more PDF files',
'可按住 Ctrl / Shift 多选':'Hold Ctrl / Shift to select multiple files',
'选择整个文件夹':'Select a folder',
'自动筛选文件夹中的 PDF':'PDF files in the folder will be selected automatically',
'灰度模式':'Grayscale mode',
'4 灰阶（2bit / XTCH）':'4-level grayscale (2-bit / XTCH)',
'黑白（1bit / XTC）':'Black and white (1-bit / XTC)',
'抖动算法':'Dithering algorithm',
'Atkinson（漫画推荐）':'Atkinson (recommended for comics)',
'Floyd–Steinberg':'Floyd–Steinberg',
'无抖动 / 阈值':'No dithering / Threshold',
'黑白阈值（仅 1bit 无抖动）':'Black-and-white threshold (1-bit, no dithering only)',
'标准（128）':'Standard (128)',
'偏黑（105）':'Darker (105)',
'偏白（150）':'Lighter (150)',
'每几个 PDF 合并成一本':'Merge every N PDFs into one file',
'1 个（每份 PDF 单独输出）':'1 (one output per PDF)',
'每 2 个 PDF 合并':'Merge every 2 PDFs',
'每 3 个 PDF 合并':'Merge every 3 PDFs',
'每 4 个 PDF 合并':'Merge every 4 PDFs',
'每 5 个 PDF 合并':'Merge every 5 PDFs',
'每 10 个 PDF 合并':'Merge every 10 PDFs',
'每 20 个 PDF 合并':'Merge every 20 PDFs',
'书名（可选）':'Book title (optional)',
'默认使用文件名自动命名':'Uses the filename by default',
'蒙版兼容模式（使用 PDF.js 的打印渲染路径，尝试兼容复杂蒙版/透明层）':'Mask compatibility mode (uses PDF.js print rendering to handle complex masks/transparency)',
'如果某个 PDF 转出黑屏，可勾选后再试；默认使用速度更快的标准显示路径。不同 PDF 的蒙版实现可能不同，此开关不保证修复所有文件。':'If a PDF converts to a black page, enable this option and try again. The faster standard display renderer is used by default. Mask implementations vary, so this option cannot guarantee a fix for every file.',
'目标尺寸固定为 X3 的 528 × 792。每份 PDF 内的页面连续拼接；每份 PDF 结束时，未满 792 行的最后一页用白色补齐，下一份 PDF 从新的 XTC 页面开始。采用分段渲染和行缓冲拼接，不会先导出整套 JPG。添加 PDF 后会自动生成最终 XTC 页面预览；调整灰度、抖动、阈值或蒙版设置时会重新预览。每组结果可单独下载，也可打包 ZIP。':'The target size is fixed at 528 × 792 for X3. Pages are stitched continuously within each PDF. Any final page shorter than 792 rows is padded with white, and the next PDF starts on a new XTC page. Rendering and stitching use row buffers; no full set of JPGs is exported first. A final XTC page preview is generated automatically after adding PDFs and refreshed when processing settings change. Each output can be downloaded separately or packaged into a ZIP.',
'转换队列':'Conversion queue',
'清空队列':'Clear queue',
'请先选择 PDF 文件或文件夹。':'Select PDF files or a folder to begin.',
'开始转换':'Start conversion',
'取消当前批次':'Cancel current batch',
'下载全部成功结果 ZIP':'Download ZIP of all successful outputs',
'请选择 PDF 文件或文件夹。':'Select PDF files or a folder.',
'最终 XTC 页面预览':'Final XTC page preview',
'选择 PDF 后立即生成；预览展示第一份 PDF 内部连续拼接、灰度与抖动处理后的第一张 528 × 792 XTC 页面。调整参数后会自动更新。':'Generated as soon as a PDF is selected. The preview shows the first 528 × 792 XTC page after continuous stitching, grayscale conversion, and dithering of the first PDF. It updates automatically when settings change.',
'编码参考：':'Encoding structure based on ',
' 的 XTG、XTH 与 XTC 容器结构。ZIP 使用 JSZip；PDF 使用 PDF.js。GitHub Pages 可直接托管。':' for the XTG, XTH, and XTC container formats. ZIP uses JSZip and PDF rendering uses PDF.js. The app can be hosted directly on GitHub Pages.',
'转换后的灰度预览':'Grayscale conversion preview',
'预览已更新。模式：':'Preview updated. Mode: ',
'4 灰阶 XTCH':'4-level grayscale XTCH',
'黑白 XTC':'Black-and-white XTC',
'；显示第一份 PDF 内部连续拼接后的第一页。':'; showing the first stitched page from the first PDF.',
'正在生成最终页面预览…':'Generating final page preview…',
'预览生成失败：':'Preview generation failed: ',
'没有找到 PDF 文件。请选择 PDF 文件，或用文件夹选择器导入。':'No PDF files found. Select PDF files or use the folder picker to import them.',
'这些 PDF 已在队列中，没有重复添加。':'These PDFs are already in the queue and were not added again.',
'队列已清空。':'Queue cleared.',
'源 PDF 文件':'Source PDF files',
'下载 XTC':'Download XTC',
'已加入 ':'Added ',
' 个 PDF。预览会显示拼接和参数处理后的第一页。':' PDF(s). The preview will show the first page after stitching and processing.',
'ZIP 组件未能加载，请检查网络后刷新页面再试。':'The ZIP library failed to load. Check your connection and refresh the page.',
'正在打包 ':'Packaging ',
' 个结果为 ZIP…':' output(s) into a ZIP…',
'正在打包 ZIP：':'Packaging ZIP: ',
'ZIP 打包完成。包含 ':'ZIP created. Contains ',
' 个文件，大小 ':' file(s), size ',
'ZIP 打包失败：':'ZIP creation failed: ',
'本批次已取消。完成 ':'Batch cancelled. Completed ',
' 组，失败 ':' group(s), failed ',
' 组；未处理文件仍保留在队列中。':' group(s). Unprocessed files remain in the queue.',
'本批次结束。成功 ':'Batch finished. Successful ',
' 组。失败 ':' group(s). Failed ',
' 组。':' group(s).',
'每组生成一个 XTC/XTCH 文件。':'One XTC/XTCH file is generated per group.',
'每份 PDF 单独输出。':'Each PDF is output separately.',
'可下载转换结果，或另行打包 ZIP。':'Download the converted files or package them into a ZIP.',
'已设置每 ':'Set to merge every ',
' 个 PDF 合并为一个 XTC/XTCH；预览正在更新。':' PDF(s) into one XTC/XTCH file. Updating preview.',
'正在取消；当前渲染段结束后会停止。':'Cancelling; processing will stop after the current render segment.',
'正在转换第 ':'Converting group ',
' 组：':' : ',
'XTC 页面已生成：':'XTC pages generated: ',
'正在封装第 ':'Building output for group ',
'组…':'…',
'已取消':'Cancelled',
'等待转换':'Waiting',
'转换中':'Converting',
'完成':'Complete',
'失败':'Failed',
'已合并':'Merged',
'输出：':'Output: ',
'合并 ':'Merged ',
' 个 X3 页面':' X3 pages',
' 个 PDF':' PDF(s)',
'源 PDF 文件':'Source PDF files',
'合并组':'Merge group',
' · 文件 ':' · File ',
' · PDF 页 ':' · PDF page ',
'页 ':'Page ',
'组 ':'Group ',
'文件 ':'File ',
' · 输出：':' · Output: '
};
const phraseTranslations=Object.entries(exactTranslations).sort((a,b)=>b[0].length-a[0].length);
function translateText(value){
  if(currentLanguage!=='en'||typeof value!=='string')return value;
  if(Object.prototype.hasOwnProperty.call(exactTranslations,value))return exactTranslations[value];
  let out=value;
  for(const [zh,en] of phraseTranslations){if(zh&&out.includes(zh))out=out.split(zh).join(en);}
  return out;
}
const originalTextNodes=new Map();
function translateStaticText(){
  const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
  let node;while((node=walker.nextNode())){if(!originalTextNodes.has(node))originalTextNodes.set(node,node.nodeValue);const original=originalTextNodes.get(node);node.nodeValue=currentLanguage==='en'?translateText(original):original;}
  document.documentElement.lang=currentLanguage==='en'?'en':'zh-CN';
  document.title=currentLanguage==='en'?'X3 PDF Stitching Batch Converter to XTC/XTCH':'X3 PDF 跨页拼接批量转换 XTC/XTCH';
}
function applyLanguage(){currentLanguage=languageSelect.value;translateStaticText();renderQueue();if(queueItems.length&&!processing)schedulePreview();}
languageSelect.addEventListener('change',applyLanguage);

function dither(gray,w,h,mode,depth,threshold){
  const a=new Float32Array(gray);
  for(let y=0;y<h;y++){
    const row=y*w;
    for(let x=0;x<w;x++){
      const i=row+x,old=a[i];
      let v;
      if(mode==='none') v=depth===2?(old<42?0:old<127?85:old<212?170:255):(old<threshold?0:255);
      else v=depth===2?(old<42?0:old<127?85:old<212?170:255):(old<128?0:255);
      a[i]=v;
      if(mode==='none')continue;
      let e=old-v;
      if(mode==='atkinson'){
        e/=8;
        if(x+1<w)a[i+1]+=e;
        if(x+2<w)a[i+2]+=e;
        if(y+1<h){const next=i+w;if(x>0)a[next-1]+=e;a[next]+=e;if(x+1<w)a[next+1]+=e;}
        if(y+2<h)a[i+2*w]+=e;
      }else{
        if(x+1<w)a[i+1]+=e*7/16;
        if(y+1<h){const next=i+w;if(x>0)a[next-1]+=e*3/16;a[next]+=e*5/16;if(x+1<w)a[next+1]+=e/16;}
      }
    }
  }
  return Uint8Array.from(a,v=>Math.max(0,Math.min(255,Math.round(v))));
}
function packXTG(px,w,h){const rb=Math.ceil(w/8),data=new Uint8Array(rb*h);for(let y=0;y<h;y++)for(let x=0;x<w;x++)if(px[y*w+x]>=128)data[y*rb+(x>>3)]|=0x80>>(x&7);return makePage('XTG\0',w,h,data);}
function packXTH(px,w,h){const cb=Math.ceil(h/8),plane=cb*w,p0=new Uint8Array(plane),p1=new Uint8Array(plane);for(let x=0;x<w;x++){const off=(w-1-x)*cb;for(let y=0;y<h;y++){const p=px[y*w+x],v=p>=212?0:p>=127?1:p>=42?2:3,idx=off+(y>>3),bit=7-(y&7);if(v&1)p0[idx]|=1<<bit;if(v&2)p1[idx]|=1<<bit;}}const data=new Uint8Array(plane*2);data.set(p0);data.set(p1,plane);return makePage('XTH\0',w,h,data);}
function makePage(magic,w,h,data){const out=new Uint8Array(22+data.length),v=new DataView(out.buffer);for(let i=0;i<4;i++)out[i]=magic.charCodeAt(i);v.setUint16(4,w,true);v.setUint16(6,h,true);out[8]=0;out[9]=0;v.setUint32(10,data.length,true);out.set(data,22);const hash=md5(data).slice(0,8);out.set(hash,14);return out;}
// Small MD5 implementation for XTG/XTH 8-byte data fingerprint.
function md5(input){const K=new Uint32Array(64),S=[7,12,17,22,5,9,14,20,4,11,16,23,6,10,15,21];for(let i=0;i<64;i++)K[i]=Math.floor(Math.abs(Math.sin(i+1))*4294967296)>>>0;const len=input.length,bitLen=len*8,total=((len+9+63)>>6)<<6,msg=new Uint8Array(total);msg.set(input);msg[len]=128;new DataView(msg.buffer).setUint32(total-8,bitLen>>>0,true);new DataView(msg.buffer).setUint32(total-4,Math.floor(bitLen/4294967296),true);let a0=0x67452301,b0=0xefcdab89,c0=0x98badcfe,d0=0x10325476;for(let o=0;o<total;o+=64){const M=new Uint32Array(16),dv=new DataView(msg.buffer,o,64);for(let i=0;i<16;i++)M[i]=dv.getUint32(i*4,true);let a=a0,b=b0,c=c0,d=d0;for(let i=0;i<64;i++){let f,g;if(i<16){f=(b&c)|(~b&d);g=i;}else if(i<32){f=(d&b)|(~d&c);g=(5*i+1)%16;}else if(i<48){f=b^c^d;g=(3*i+5)%16;}else{f=c^(b|~d);g=(7*i)%16;}const s=i<16?S[i%4]:i<32?S[4+i%4]:i<48?S[8+i%4]:S[12+i%4];const z=(a+f+K[i]+M[g])|0,r=(z<<s)|(z>>>(32-s));a=d;d=c;c=b;b=(b+r)|0;}a0=(a0+a)|0;b0=(b0+b)|0;c0=(c0+c)|0;d0=(d0+d)|0;}const out=new Uint8Array(16),dv=new DataView(out.buffer);[a0,b0,c0,d0].forEach((v,i)=>dv.setUint32(i*4,v,true));return out;}
function buildBook(pages,is2,title){const metaOff=56,indexOff=312,dataOff=indexOff+pages.length*16,total=dataOff+pages.reduce((n,p)=>n+p.length,0),out=new Uint8Array(total),v=new DataView(out.buffer);const magic=is2?'XTCH':'XTC\0';for(let i=0;i<4;i++)out[i]=magic.charCodeAt(i);v.setUint16(4,1,true);v.setUint16(6,pages.length,true);v.setUint32(8,0x01000100,true);v.setUint32(12,1,true);v.setBigUint64(16,BigInt(metaOff),true);v.setBigUint64(24,BigInt(indexOff),true);v.setBigUint64(32,BigInt(dataOff),true);v.setBigUint64(40,0n,true);v.setBigUint64(48,0n,true);new TextEncoder().encode(title).slice(0,127).forEach((c,i)=>out[metaOff+i]=c);let pos=dataOff;pages.forEach((p,i)=>{let e=indexOff+i*16;v.setBigUint64(e,BigInt(pos),true);v.setUint32(e+8,p.length,true);v.setUint16(e+12,W,true);v.setUint16(e+14,H,true);out.set(p,pos);pos+=p.length;});return out;}
function safeName(name){return name.replace(/[\\/:*?\"<>|\u0000-\u001f]/g,'_').replace(/[. ]+$/,'').trim()||'converted';}
function downloadBlob(blob,name){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name||'converted.xtc';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),15000);}
const fileInput=$('file'),folderInput=$('folder'),go=$('go'),cancel=$('cancel'),clear=$('clear'),zipButton=$('zip'),status=$('status'),bar=$('bar'),preview=$('preview'),queueList=$('queueList');
const queueItems=[];
const groupResults=[];
const collator=new Intl.Collator('zh-CN',{numeric:true,sensitivity:'base'});
let cancelled=false,processing=false,previewToken=0,previewTimer=null;
function setStatus(s,p){status.textContent=translateText(s);if(p!=null)bar.style.width=`${Math.max(0,Math.min(100,p))}%`;}
function humanSize(n){if(!Number.isFinite(n))return '';const units=['B','KB','MB','GB'];let i=0,v=n;while(v>=1024&&i<units.length-1){v/=1024;i++;}return `${v.toFixed(i?2:0)} ${units[i]}`;}
function fileKey(file){return `${file.name}\0${file.size}\0${file.lastModified}\0${file.webkitRelativePath||''}`;}
function displayName(item){return item.file.webkitRelativePath||item.file.name;}
function pendingItems(){return queueItems.filter(item=>item.state==='等待转换');}
function successItems(){return queueItems.filter(item=>item.blob);}
function mergeCount(){return Math.max(1,Number($('mergeCount').value)||1);}
function syncButtons(){go.disabled=processing||pendingItems().length===0;cancel.disabled=!processing;clear.disabled=processing||queueItems.length===0;zipButton.disabled=processing||successItems().length===0;fileInput.disabled=processing;folderInput.disabled=processing;}
function updateQueueItem(item){
  if(mergeCount()>1){const record=groupResults.find(r=>r.items?.includes(item));if(record&&record.items.length)record.progress=Math.round(record.items.reduce((sum,x)=>sum+(x.progress||0),0)/record.items.length);renderQueue();return;}
  const index=queueItems.indexOf(item),li=queueList.children[index];if(!li)return;const detail=li.querySelector('.file-detail'),state=li.querySelector('.file-state');if(detail)detail.textContent=translateText(`${humanSize(item.file.size)}${item.outputName?` · 输出：${item.outputName}`:''}${item.error?` · ${translateText(item.error)}`:''}${item.detail?` · ${translateText(item.detail)}`:''}`);if(state){state.className='file-state'+(item.state==='完成'?' ok':item.state==='失败'?' err':'');state.textContent=translateText(item.state==='转换中'?`转换中 ${Math.round(item.progress||0)}%`:item.state);}}
function renderQueue(){
  $('queueCount').textContent=currentLanguage==='en'?`(${queueItems.length} PDF${queueItems.length===1?'':'s'})`:`（${queueItems.length} 个 PDF）`;queueList.replaceChildren();
  if(!queueItems.length){const li=document.createElement('li');li.className='hint';li.textContent=translateText('请先选择 PDF 文件或文件夹。');queueList.append(li);syncButtons();return;}
  if(mergeCount()>1){
    for(const result of groupResults){const li=document.createElement('li');li.className='group-output';const info=document.createElement('div');info.className='file-info';const name=document.createElement('div');name.className='filename';name.textContent=translateText(`输出：${result.outputName}`);const detail=document.createElement('div');detail.className='file-detail';detail.textContent=translateText(`合并 ${result.files.length} 个 PDF${result.xtcPages!=null?` · ${result.xtcPages} 个 X3 页面`:''}${result.size?` · ${humanSize(result.size)}`:''}${result.error?` · ${result.error}`:''}`);info.append(name,detail);const state=document.createElement('span');state.className='file-state'+(result.state==='完成'?' ok':result.state==='失败'?' err':'');state.textContent=translateText(result.state==='转换中'?`转换中 ${Math.round(result.progress||0)}%`:result.state);li.append(info,state);if(result.blob){const btn=document.createElement('button');btn.className='secondary small';btn.textContent=translateText('下载 XTC');btn.addEventListener('click',()=>downloadBlob(result.blob,result.outputName));li.append(btn);}queueList.append(li);}
    const sourceHead=document.createElement('li');sourceHead.className='hint';sourceHead.textContent=translateText('源 PDF 文件');queueList.append(sourceHead);
    queueItems.forEach((item,index)=>{const li=document.createElement('li');const info=document.createElement('div');info.className='file-info';const name=document.createElement('div');name.className='filename';name.textContent=`${index+1}. ${displayName(item)}`;const detail=document.createElement('div');detail.className='file-detail';detail.textContent=humanSize(item.file.size);info.append(name,detail);li.append(info);queueList.append(li);});
  }else{
    queueItems.forEach((item,index)=>{const li=document.createElement('li');const info=document.createElement('div');info.className='file-info';const name=document.createElement('div');name.className='filename';name.textContent=`${index+1}. ${displayName(item)}`;const detail=document.createElement('div');detail.className='file-detail';detail.textContent=translateText(`${humanSize(item.file.size)}${item.outputName?` · 输出：${item.outputName}`:''}${item.error?` · ${translateText(item.error)}`:''}${item.detail?` · ${translateText(item.detail)}`:''}`);info.append(name,detail);const state=document.createElement('span');state.className='file-state'+(item.state==='完成'?' ok':item.state==='失败'?' err':'');state.textContent=translateText(item.state==='转换中'?`转换中 ${Math.round(item.progress||0)}%`:item.state);li.append(info,state);if(item.blob){const btn=document.createElement('button');btn.className='secondary small';btn.textContent=translateText('下载 XTC');btn.addEventListener('click',()=>downloadBlob(item.blob,item.outputName));li.append(btn);}queueList.append(li);});
  }
  syncButtons();
}
function addFiles(fileList){const known=new Set(queueItems.map(i=>fileKey(i.file)));const found=Array.from(fileList||[]).filter(f=>/\.pdf$/i.test(f.name));found.sort((a,b)=>collator.compare(a.webkitRelativePath||a.name,b.webkitRelativePath||b.name));let added=0;for(const file of found){const key=fileKey(file);if(known.has(key))continue;known.add(key);queueItems.push({file,state:'等待转换',progress:0,blob:null,outputName:'',error:'',detail:''});added++;}if(added){setStatus(`已加入 ${added} 个 PDF。预览会显示拼接和参数处理后的第一页。`,0);schedulePreview();}else if(found.length===0)setStatus('没有找到 PDF 文件。请选择 PDF 文件，或用文件夹选择器导入。',0);else setStatus('这些 PDF 已在队列中，没有重复添加。',0);renderQueue();}
fileInput.addEventListener('change',()=>{addFiles(fileInput.files);fileInput.value='';});folderInput.addEventListener('change',()=>{addFiles(folderInput.files);folderInput.value='';});
clear.addEventListener('click',()=>{if(processing)return;queueItems.length=0;groupResults.length=0;preview.style.display='none';preview.width=W;preview.height=H;preview.getContext('2d').clearRect(0,0,W,H);preview.dataset.hasPreview='';bar.style.width='0%';setStatus('队列已清空。',0);renderQueue();});
cancel.addEventListener('click',()=>{cancelled=true;cancel.disabled=true;setStatus(status.textContent+'\n正在取消；当前渲染段结束后会停止。');});
$('mergeCount').addEventListener('change',()=>{setStatus(`已设置每 ${mergeCount()} 个 PDF 合并为一个 XTC/XTCH；预览正在更新。`,0);renderQueue();schedulePreview();});
for(const id of ['depth','dither','threshold','maskMode','title'])$(id).addEventListener('change',schedulePreview);
$('title').addEventListener('input',schedulePreview);

function makeBlankBuffer(){const b=new Uint8Array(W*H);b.fill(255);return b;}
function grayscaleRows(imageData,rows){const out=new Uint8Array(W*rows),data=imageData.data;for(let y=0,j=0;y<rows;y++)for(let x=0;x<W;x++,j++){const i=(y*W+x)*4;out[j]=Math.round(.299*data[i]+.587*data[i+1]+.114*data[i+2]);}return out;}
function appendRows(acc,gray,rows){const copyRows=Math.min(rows,H-acc.used);acc.buffer.set(gray.subarray(0,copyRows*W),acc.used*W);acc.used+=copyRows;return acc.used===H;}
function resetAccumulator(acc){acc.buffer=makeBlankBuffer();acc.used=0;}
function processAccumulatedPage(acc,depth,algo,threshold,pages,previewMode=false){const processed=dither(acc.buffer,W,H,algo,depth,threshold);if(previewMode){const ctx=preview.getContext('2d',{alpha:false});preview.width=W;preview.height=H;const img=ctx.createImageData(W,H);for(let i=0,j=0;i<processed.length;i++,j+=4){const gray=processed[i];img.data[j]=gray;img.data[j+1]=gray;img.data[j+2]=gray;img.data[j+3]=255;}ctx.putImageData(img,0,0);preview.style.display='block';preview.dataset.hasPreview='1';}else pages.push(depth===2?packXTH(processed,W,H):packXTG(processed,W,H));resetAccumulator(acc);}
async function renderPdfRows(pdf,page,top,rows,maskMode){const canvas=document.createElement('canvas');canvas.width=W;canvas.height=H;const ctx=canvas.getContext('2d',{willReadFrequently:true});ctx.fillStyle='#fff';ctx.fillRect(0,0,W,H);await page.render({canvasContext:ctx,canvas,viewport:page.getViewport({scale:W/page.getViewport({scale:1}).width}),transform:[1,0,0,1,0,-top],background:'rgb(255,255,255)',intent:maskMode?'print':'display'}).promise;const gray=grayscaleRows(ctx.getImageData(0,0,W,rows),rows);canvas.width=canvas.height=1;return gray;}
function groupPending(items){const n=mergeCount(),groups=[];for(let i=0;i<items.length;i+=n)groups.push(items.slice(i,i+n));return groups;}
function outputTitle(files,groupIndex){const custom=$('title').value.trim();if(custom&&groupIndex===0)return safeName(custom);const bases=files.map(f=>safeName(f.name.replace(/\.pdf$/i,'')));if(bases.length===1)return bases[0];const numbered=bases.map(name=>name.match(/^(.*?)(\d+)$/));if(numbered.every(Boolean)&&numbered.every(m=>m[1]===numbered[0][1]&&m[2].length===numbered[0][2].length)){return safeName(`${numbered[0][1]}${numbered[0][2]}-${numbered[numbered.length-1][2]}`);}return safeName(`${bases[0]}-${bases[bases.length-1]}`);}

function schedulePreview(){if(processing)return;clearTimeout(previewTimer);const token=++previewToken;previewTimer=setTimeout(()=>updatePreview(token),220);}
async function updatePreview(token){
  const files=queueItems.slice(0,1).map(x=>x.file);
  if(!files.length){preview.style.display='none';preview.width=W;preview.height=H;preview.getContext('2d').clearRect(0,0,W,H);preview.dataset.hasPreview='';return;}
  preview.style.display='none';preview.width=W;preview.height=H;preview.getContext('2d').clearRect(0,0,W,H);preview.dataset.hasPreview='';setStatus('正在生成最终页面预览…',0);
  let pdf=null;
  try{
    const depth=Number($('depth').value),algo=$('dither').value,threshold=Number($('threshold').value),maskMode=$('maskMode').checked;
    const acc={buffer:makeBlankBuffer(),used:0};let finished=false;
    const file=files[0];
    if(token!==previewToken)return;
    pdf=await pdfjsLib.getDocument({data:await file.arrayBuffer()}).promise;
    for(let pn=1;pn<=pdf.numPages&&!finished;pn++){
      if(token!==previewToken)return;
      const page=await pdf.getPage(pn),base=page.getViewport({scale:1}),viewport=page.getViewport({scale:W/base.width}),scaledH=Math.max(1,Math.ceil(viewport.height));
      for(let top=0;top<scaledH&&!finished;top+=H){
        if(token!==previewToken)return;
        const rows=Math.min(H,scaledH-top),gray=await renderPdfRows(pdf,page,top,rows,maskMode);
        let offset=0;
        while(offset<rows){const take=Math.min(H-acc.used,rows-offset);acc.buffer.set(gray.subarray(offset*W,(offset+take)*W),acc.used*W);acc.used+=take;offset+=take;if(acc.used===H){processAccumulatedPage(acc,depth,algo,threshold,null,true);finished=true;}}
      }
      page.cleanup?.();
    }
    // Only pad at the end of the PDF, never at the end of each PDF page.
    if(!finished&&acc.used>0)processAccumulatedPage(acc,depth,algo,threshold,null,true);
    await pdf.destroy();pdf=null;
    if(token===previewToken)setStatus(`预览已更新。模式：${depth===2?'4 灰阶 XTCH':'黑白 XTC'}；显示第一份 PDF 内部连续拼接后的第一页。`,0);
  }catch(error){if(token===previewToken)setStatus(`预览生成失败：${error?.message||error}`,0);}
  finally{if(pdf){try{await pdf.destroy();}catch(_){}}}
}

async function convertGroup(group,groupIndex,totalGroups){
  let pdf=null;const pages=[],acc={buffer:makeBlankBuffer(),used:0};
  const depth=Number($('depth').value),algo=$('dither').value,threshold=Number($('threshold').value),maskMode=$('maskMode').checked;
  let pdfPageCount=0,segments=0;const files=group.map(item=>item.file),title=outputTitle(files,groupIndex);
  try{
    for(let fi=0;fi<files.length;fi++){
      if(cancelled)throw new Error('已取消');
      const item=group[fi];item.state='转换中';item.progress=0;item.detail=`合并组 ${groupIndex+1}/${totalGroups} · 文件 ${fi+1}/${files.length}`;updateQueueItem(item);
      pdf=await pdfjsLib.getDocument({data:await files[fi].arrayBuffer()}).promise;pdfPageCount+=pdf.numPages;
      for(let pn=1;pn<=pdf.numPages;pn++){
        if(cancelled)throw new Error('已取消');
        const page=await pdf.getPage(pn),base=page.getViewport({scale:1}),viewport=page.getViewport({scale:W/base.width}),scaledH=Math.max(1,Math.ceil(viewport.height));
        for(let top=0;top<scaledH;top+=H){
          if(cancelled)throw new Error('已取消');
          const rows=Math.min(H,scaledH-top),gray=await renderPdfRows(pdf,page,top,rows,maskMode);let offset=0;
          while(offset<rows){const take=Math.min(H-acc.used,rows-offset);acc.buffer.set(gray.subarray(offset*W,(offset+take)*W),acc.used*W);acc.used+=take;offset+=take;if(acc.used===H)processAccumulatedPage(acc,depth,algo,threshold,pages);}
          segments++;
          const progress=Math.min(99,((fi+(pn/pdf.numPages))/files.length)*99);
          item.progress=progress;item.detail=`组 ${groupIndex+1}/${totalGroups} · PDF 页 ${pn}/${pdf.numPages} · 文件 ${fi+1}/${files.length}`;
          setStatus(`正在转换第 ${groupIndex+1}/${totalGroups} 组：${files.map(f=>f.name).join(' + ')}\n${item.detail}\nXTC 页面已生成：${pages.length}`,((groupIndex+progress/100)/totalGroups)*100);
          updateQueueItem(item);await new Promise(resolve=>setTimeout(resolve,0));
        }
        page.cleanup?.();
      }
      // PDF boundary: pad its final partial XTC page with white. The next PDF starts fresh.
      if(acc.used>0)processAccumulatedPage(acc,depth,algo,threshold,pages);
      await pdf.destroy();pdf=null;
    }
    if(cancelled)throw new Error('已取消');
    setStatus(`正在封装第 ${groupIndex+1} 组…`,((groupIndex+.98)/totalGroups)*100);
    const book=buildBook(pages,depth===2,title),blob=new Blob([book],{type:'application/octet-stream'}),ext=depth===2?'.xtch':'.xtc';
    return {blob,outputName:title+ext,pdfPageCount,xtcPages:pages.length,size:book.length};
  }finally{pages.length=0;if(pdf){try{await pdf.destroy();}catch(_){}}}
}

go.addEventListener('click',async()=>{const todo=pendingItems();if(!todo.length||processing)return;const groups=groupPending(todo);processing=true;cancelled=false;syncButtons();let finished=0,failed=0;for(let gi=0;gi<groups.length;gi++){if(cancelled)break;const group=groups[gi];const record={files:group.map(x=>x.file),items:group,outputName:outputTitle(group.map(x=>x.file),gi),state:'转换中',progress:0,blob:null,xtcPages:null,size:0,error:''};if(mergeCount()>1)groupResults.push(record);for(const item of group){item.state='转换中';item.progress=0;item.error='';}renderQueue();try{const result=await convertGroup(group,gi,groups.length);record.blob=result.blob;record.outputName=result.outputName;record.state='完成';record.progress=100;record.xtcPages=result.xtcPages;record.size=result.size;const first=group[0];first.blob=result.blob;first.outputName=result.outputName;first.state='完成';first.progress=100;first.detail=`合并 ${group.length} 个 PDF · ${result.xtcPages} 个 X3 页面`;first.pageCount=result.pdfPageCount;first.size=result.size;for(const item of group.slice(1)){item.state='已合并';item.detail='';item.progress=100;}finished++;}catch(error){record.state=error?.message==='已取消'?'已取消':'失败';record.error=error?.message||String(error);for(const item of group){item.state=error?.message==='已取消'?'已取消':'失败';item.error=error?.message||String(error);}if(error?.message!=='已取消'&&!cancelled)failed++;if(!cancelled)console.error(error);}renderQueue();if(cancelled)break;}processing=false;syncButtons();if(cancelled)setStatus(`本批次已取消。完成 ${finished} 组，失败 ${failed} 组；未处理文件仍保留在队列中。`,null);else setStatus(`本批次结束。成功 ${finished} 组，失败 ${failed} 组。${mergeCount()>1?'每组生成一个 XTC/XTCH 文件。':'每份 PDF 单独输出。'} ${successItems().length?'可下载转换结果，或另行打包 ZIP。':''}`,100);});
zipButton.addEventListener('click',async()=>{const ready=successItems();if(!ready.length||processing)return;if(!window.JSZip){setStatus('ZIP 组件未能加载，请检查网络后刷新页面再试。',0);return;}zipButton.disabled=true;try{const zip=new window.JSZip(),used=new Set();for(const item of ready){let name=item.outputName||'converted.xtc',base=name,seq=2;while(used.has(name.toLowerCase())){const dot=base.lastIndexOf('.');name=dot>0?`${base.slice(0,dot)} (${seq})${base.slice(dot)}`:`${base} (${seq})`;seq++;}used.add(name.toLowerCase());zip.file(name,item.blob,{binary:true});}setStatus(`正在打包 ${ready.length} 个结果为 ZIP…`,0);const blob=await zip.generateAsync({type:'blob',compression:'STORE'},metadata=>setStatus(`正在打包 ZIP：${Math.round(metadata.percent)}%`,metadata.percent));downloadBlob(blob,currentLanguage==='en'?'X3-XTC-Batch-Conversion.zip':'X3-XTC-批量转换结果.zip');setStatus(`ZIP 打包完成。包含 ${ready.length} 个文件，大小 ${humanSize(blob.size)}。`,100);}catch(error){console.error(error);setStatus(`ZIP 打包失败：${error?.message||error}`,0);}finally{syncButtons();}});
translateStaticText();
renderQueue();
