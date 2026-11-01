const { chromium } = require('playwright'); const fs=require('fs'); const http=require('http'); const path=require('path');
const dir=process.argv[2]; const out=process.argv[3]; const extra=process.argv[4]||'';
const srv=http.createServer((q,r)=>{const f=path.join(dir,decodeURIComponent(q.url.split('?')[0]));fs.readFile(f,(e,d)=>{if(e){r.writeHead(404);return r.end()}r.writeHead(200,{'Content-Type':f.endsWith('.js')?'text/javascript':'text/html'});r.end(d)})}).listen(8123,async()=>{
 const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});const p=await b.newPage();
 p.on('console',m=>console.log('console',m.text()));p.on('pageerror',e=>console.log('err',e.message));
 for(const k of (process.env.KINDS||'pawn,rook,bishop,knight,queen,king').split(',')){await p.goto(`http://127.0.0.1:8123/${process.env.PAGE||"render.html"}?p=${k}${extra}`);await p.waitForFunction(()=>window.__png,null,{timeout:60000});const d=await p.evaluate(()=>window.__png);fs.writeFileSync(`${out}/${k}.png`,Buffer.from(d.split(',')[1],'base64'));console.log('ok',k)}
 await b.close();srv.close();});
