"""Real-browser layout check (optional, needs: pip install playwright && playwright install chromium).
Loads the site with MOCKED /api/*, a fake Lanyard WebSocket and fake images (no network, no real account) in EN/FR/RU at several widths,
and reports horizontal overflow, banner size and screenshots (tests/e2e/out/). Run: python3 tests/e2e/layout_check.py demo"""
import json, sys, threading, http.server, socketserver, functools, time
from playwright.sync_api import sync_playwright
import os
ROOT=os.path.abspath(os.path.join(os.path.dirname(__file__),"..",".."))
HERE=os.path.dirname(os.path.abspath(__file__))
CHROME=os.environ.get("CHROME_PATH")
class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*a): pass
def serve(port):
    h=functools.partial(Q,directory=ROOT); s=socketserver.ThreadingTCPServer(("127.0.0.1",port),h); s.allow_reuse_address=True
    threading.Thread(target=s.serve_forever,daemon=True).start(); return s
ID="1356268956398387423"
BANNER=open(os.path.join(HERE,"fixtures","banner.png"),"rb").read(); SQ=open(os.path.join(HERE,"fixtures","square.png"),"rb").read()
def items(n):
    return [{"id":"%022d"%i,"title":t,"artists":a,"album":"x","cover":"https://i.scdn.co/image/%d"%i,"url":"https://open.spotify.com/track/%022d"%i,"playedAt":"2026-10-29T0%d:10:00Z"%(9-i),"durationMs":180000+i*7000,"album":"Álbum %d con un nombre bastante largo para probar"%i} for i,(t,a) in enumerate([("Blinding Lights","The Weeknd"),("Очень длинное название песни которое не помещается","Исполнитель Один, Исполнитель Два"),("Une chanson avec un titre vraiment très très long à rallonge","Artiste Numéro Un, Artiste Numéro Deux"),("Song 4","A"),("Song 5","B"),("Song 6","C"),("Song 7","D"),("Song 8","E"),("Song 9","F"),("Song 10","G")][:n])]
def run(scn, lang, w, h, shot=None, musicoff=True, bottom=None, banner=True, bio=None, spotify=True, kv=None, console=None, dedication=False):
    srv=serve(0); port=srv.server_address[1]
    with sync_playwright() as p:
        b=p.chromium.launch(**({"executable_path":CHROME} if CHROME else {}),args=["--no-sandbox"])
        ctx=b.new_context(viewport={"width":w,"height":h},device_scale_factor=2 if w<500 else 1,is_mobile=w<500,has_touch=w<500)
        pg=ctx.new_page(); errs=[]
        pg.on("console",lambda m: errs.append(m.type+": "+m.text) if m.type in("error","warning") else None); pg.on("pageerror",lambda e: errs.append("pageerror: "+str(e)))
        pg.add_init_script("sessionStorage.setItem('entered','1');localStorage.setItem('lang','%s');"%lang+("localStorage.setItem('music','off')" if musicoff else ""))
        prof={"id":ID,"username":"matheo","displayName":"Matheo","avatar":"https://cdn.discordapp.com/avatars/%s/x.png"%ID,"avatarStatic":"https://cdn.discordapp.com/avatars/%s/x.png"%ID,"decoration":"","banner":{"url":"https://cdn.discordapp.com/banners/%s/b.png?size=1024"%ID,"staticUrl":"https://cdn.discordapp.com/banners/%s/b.png?size=1024"%ID,"animated":False} if banner else None,"accentColor":"","badges":["hypesquadBravery","activeDeveloper","earlySupporter","verifiedDeveloper"],"bannerSource":"ok" if banner else "no_token"}
        if bio: prof["bio"]=bio
        def route(r):
            u=r.request.url
            if "/api/profile" in u: r.fulfill(json=prof)
            elif "/api/recent" in u: r.fulfill(json={"items":items(10),"live":True})
            elif "dedication.mp4" in u: r.fulfill(body=b"x",content_type="video/mp4")
            elif "banners" in u: r.fulfill(body=BANNER,content_type="image/png")
            elif "cdn.discordapp.com" in u or "scdn.co" in u: r.fulfill(body=SQ,content_type="image/png")
            elif "oembed" in u: r.fulfill(json={"thumbnail_url":"https://i.scdn.co/image/k"})
            elif u.startswith("http://127.0.0.1"): r.continue_()
            else: r.abort()
        pg.route("**/*",route)
        def ws(s):
            s.send(json.dumps({"op":1,"d":{"heartbeat_interval":3600000}}))
            def onm(m):
                d={"discord_user":{"id":ID,"username":"matheo","global_name":"Matheo","avatar":"x"},"discord_status":"online","activities":[{"type":4,"name":"Custom Status","state":"estado personalizado de prueba","emoji":{"name":"📚"}},{"type":0,"name":"Visual Studio Code","details":"Editing script.js"}],"kv":kv or {},
                   "listening_to_spotify":spotify,"spotify":{"track_id":"0VjIjW4GlUZAMYd2vXMi3b","song":"Una canción con un título bastante largo para probar el ajuste","artist":"Artista Uno; Artista Dos","album":"Álbum de prueba","album_art_url":"https://i.scdn.co/image/a","timestamps":{"start":int(time.time()*1000)-60000,"end":int(time.time()*1000)+140000}}}
                s.send(json.dumps({"op":0,"t":"INIT_STATE","d":d}))
            s.on_message(onm)
        pg.route_web_socket("wss://api.lanyard.rest/socket",ws)
        pg.goto("http://127.0.0.1:%d/index.html"%port); pg.wait_for_timeout(2500)
        pg.add_style_tag(content=".rv{opacity:1!important;transform:none!important}.intro-i{opacity:1!important;animation:none!important}")
        pg.evaluate("document.querySelectorAll('.rv').forEach(e=>e.classList.add('in'))")
        pg.wait_for_timeout(400)
        res=pg.evaluate("""()=>{const W=innerWidth,out={};out.scrollW=document.documentElement.scrollWidth;out.bodyScrollW=document.body.scrollWidth;
          out.over=[...document.querySelectorAll('body *')].filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&(r.right>W+1||r.left<-1)&&!e.closest('#stars')&&!e.closest('.lang-menu')&&!e.closest('.hist')&&!e.closest('svg')}).slice(0,8).map(e=>e.tagName+'#'+e.id+'.'+e.className+' '+Math.round(e.getBoundingClientRect().left)+'..'+Math.round(e.getBoundingClientRect().right));
          out.docH=document.documentElement.scrollHeight;
          const f=document.querySelector('footer p').getBoundingClientRect();out.footerBottom=Math.round(f.bottom+scrollY);
          const bn=document.querySelector('#banner').getBoundingClientRect();out.banner=[Math.round(bn.width),Math.round(bn.height)];const bi=document.querySelector('#banner-img');out.bannerImg={hidden:bi.hidden,nat:bi.naturalWidth,op:getComputedStyle(bi).opacity,disp:getComputedStyle(bi).display};
          out.ov=getComputedStyle(document.querySelector('#banner'),'::after').content;out.bio=document.querySelector('#bio')?{hidden:document.querySelector('#bio').hidden,text:document.querySelector('#bio').innerText}:null;
          const clip=[...document.querySelectorAll('.nav a,.nav button,.tag,#discord h2,#discord .muted,#discord .badges li,#about-text *,.row span')].filter(e=>e.scrollWidth>e.clientWidth+1&&getComputedStyle(e).overflow!=='visible'&&e.clientWidth>0).slice(0,8).map(e=>e.tagName+'#'+e.id+'.'+e.className+' '+e.scrollWidth+'>'+e.clientWidth+' "'+e.textContent.trim().slice(0,30)+'"');out.clipped=clip;return out}""")
        res.update(pg.evaluate("""()=>{const b=document.querySelector('#banner').getBoundingClientRect(),a=document.querySelector('.pf-who .avatar').getBoundingClientRect();
          const h=document.querySelector('#hist'),hb=h.getBoundingClientRect(),cv=h.children[0].querySelector('.cv').getBoundingClientRect();
          const vis=[...h.children].filter(li=>li.dataset.o&&Math.abs(+li.dataset.o)<=2&&getComputedStyle(li).opacity>0.9).map(li=>{const r=li.querySelector('.cv').getBoundingClientRect();return [li.dataset.o,Math.round(r.left),Math.round(r.right),Math.round(r.width)]});
          return {avatarOverlap:+((b.bottom-a.top)/a.height).toFixed(3),avatarSize:Math.round(a.width),cards:h.children.length,cover:Math.round(cv.width),visibleCards:vis.length,vis:vis,stage:[Math.round(hb.left),Math.round(hb.right)],histBox:getComputedStyle(document.querySelector('#history')).borderTopWidth,metaText:h.children[0].querySelector('.mt').innerText}}"""))
        if dedication:
            pg.evaluate("document.querySelector('#secret').click()"); pg.wait_for_timeout(1200)
            res['ded']=pg.evaluate("""()=>{const d=document.querySelector('#letter').getBoundingClientRect(),t=document.querySelector('#l-body').getBoundingClientRect(),g=document.querySelector('.ded-gif').getBoundingClientRect(),i=document.querySelector('#l-vid');
              const W=innerWidth;return {dlgCentre:Math.round((d.left+d.right)/2-W/2),text:[Math.round(t.left),Math.round(t.width),Math.round(t.height)],gif:[Math.round(g.left),Math.round(g.width),Math.round(g.height)],fit:getComputedStyle(i).objectFit,sameWidth:Math.abs(t.width-g.width)<2,stacked:g.top>=t.bottom-1,title:!!document.querySelector('#letter h1,#letter h2,#letter h3'),scrollW:document.documentElement.scrollWidth,dlgScroll:document.querySelector('#letter').scrollWidth>document.querySelector('#letter').clientWidth+1,textAlign:getComputedStyle(document.querySelector('#l-body')).textAlign}}""")
            if shot: pg.screenshot(path=shot.replace('.png','_ded.png'))
            pg.evaluate("document.querySelector('#close').click()"); pg.wait_for_timeout(700)
        if shot:
            pg.screenshot(path=shot,full_page=True)
        if bottom:
            pg.evaluate("window.scrollTo({top:document.documentElement.scrollHeight,behavior:'instant'})"); pg.wait_for_timeout(1200); pg.screenshot(path=bottom)
        b.close(); srv.shutdown(); srv.server_close()
        return res, errs
if __name__=="__main__":
    os.makedirs(os.path.join(HERE,"out"),exist_ok=True)
    scn=sys.argv[1]; 
    for lang in ["en","fr","ru"]:
        for w,h in [(320,640),(360,740),(390,844),(430,932),(768,1024),(1280,800)]:
            r,e=run(scn,lang,w,h,shot=os.path.join(HERE,"out","%s_%s_%d.png"%(scn,lang,w)))
            print(lang,w,'scrollW',r['scrollW'],'over',r['over'],'clipped',r['clipped'],'banner',r['banner'],r['bannerImg']['nat']); 
            if e: print("   CONSOLE:",e[:4])
